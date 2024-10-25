<?php
// Conexión a la base de datos
include('../../../procesos/connect.php');

// Configuración de caracteres para Oracle
$sql = "ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MM-YYYY HH24:MI:SS'";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);

// Función para manejar errores de Oracle
function handleOracleError($stmt, $conn) {
    $error = oci_error($stmt);
    if ($error) {
        oci_rollback($conn);
        return 'Error Oracle: ' . htmlspecialchars($error['message']);
    }
    return null;
}

// Función para validar el nombre de usuario
function validateUsername($username) {
    // Reglas específicas para Oracle XE:
    // - Debe comenzar con una letra
    // - Puede contener letras, números y _
    // - Longitud máxima de 30 caracteres
    return preg_match('/^[A-Za-z][A-Za-z0-9_]{0,29}$/', $username);
}

// Función para validar la contraseña
function validatePassword($password) {
    // Reglas de contraseña para Oracle:
    // - Mínimo 8 caracteres
    // - Al menos una letra y un número
    return strlen($password) >= 8 && 
           preg_match('/[A-Za-z]/', $password) && 
           preg_match('/[0-9]/', $password);
}

// Función para verificar si un usuario existe
function userExists($conn, $username) {
    $sql = "SELECT COUNT(*) AS count FROM dba_users WHERE username = :username";
    $stmt = oci_parse($conn, $sql);
    oci_bind_by_name($stmt, ":username", $username);
    oci_execute($stmt);
    $row = oci_fetch_assoc($stmt);
    return $row['COUNT'] > 0;
}

// Función para validar el espacio disponible en tablespace
function checkTablespaceSpace($conn) {
    $sql = "SELECT tablespace_name, 
            ROUND((MAX_BYTES - BYTES_USED)/1024/1024,2) AS FREE_MB 
            FROM (SELECT tablespace_name, 
                         SUM(BYTES) BYTES_USED,
                         SUM(MAXBYTES) MAX_BYTES
                  FROM dba_data_files 
                  GROUP BY tablespace_name)
            WHERE tablespace_name = 'USERS'";
    
    $stmt = oci_parse($conn, $sql);
    oci_execute($stmt);
    $row = oci_fetch_assoc($stmt);
    return $row['FREE_MB'] > 50; // Asegura que haya al menos 50MB libres
}

// Procesar formularios
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $username = strtoupper(trim($_POST['username'] ?? ''));
        $password = $_POST['password'] ?? '';
        $role = $_POST['role'] ?? '';
        
        // Validación básica
        if (!validateUsername($username)) {
            echo "<script>swal('Error', 'Nombre de usuario inválido. Debe comenzar con una letra y contener solo letras, números y guiones bajos.', 'error');</script>";
            exit;
        }

        try {
            switch ($_POST['action']) {
                case 'create':
                    if (!validatePassword($password)) {
                        echo "<script>swal('Error', 'La contraseña debe tener al menos 8 caracteres, incluir letras y números.', 'error');</script>";
                        exit;
                    }

                    if (userExists($conn, $username)) {
                        echo "<script>swal('Error', 'El usuario ya existe.', 'error');</script>";
                        exit;
                    }

                    if (!checkTablespaceSpace($conn)) {
                        echo "<script>swal('Error', 'No hay suficiente espacio en el tablespace USERS.', 'error');</script>";
                        exit;
                    }

                    // Iniciar transacción
                    $success = true;
                    
                    // Crear usuario con tablespace específico y cuota
                    $create_user_sql = "CREATE USER :username IDENTIFIED BY :password 
                                      DEFAULT TABLESPACE USERS 
                                      TEMPORARY TABLESPACE TEMP
                                      QUOTA 50M ON USERS";
                    $stmt = oci_parse($conn, $create_user_sql);
                    oci_bind_by_name($stmt, ":username", $username);
                    oci_bind_by_name($stmt, ":password", $password);
                    
                    $success = $success && @oci_execute($stmt, OCI_DEFAULT);
                    if ($error = handleOracleError($stmt, $conn)) {
                        echo "<script>swal('Error', '$error', 'error');</script>";
                        exit;
                    }
                    
                    // Otorgar permisos básicos
                    $basic_grants = [
                        "GRANT CREATE SESSION TO :username",
                        "GRANT CREATE TABLE TO :username",
                        "GRANT CREATE VIEW TO :username"
                    ];
                    
                    foreach ($basic_grants as $grant_sql) {
                        $stmt = oci_parse($conn, $grant_sql);
                        oci_bind_by_name($stmt, ":username", $username);
                        $success = $success && @oci_execute($stmt, OCI_DEFAULT);
                        if ($error = handleOracleError($stmt, $conn)) {
                            echo "<script>swal('Error', '$error', 'error');</script>";
                            exit;
                        }
                    }
                    
                    // Otorgar rol según el tipo seleccionado
                    $role_sql = "";
                    switch ($role) {
                        case 'admin':
                            $role_sql = "GRANT DBA TO :username";
                            break;
                        case 'read_only':
                            $role_sql = "GRANT SELECT_CATALOG_ROLE, SELECT ANY TABLE TO :username";
                            break;
                        case 'user':
                            $role_sql = "GRANT RESOURCE, CONNECT TO :username";
                            break;
                    }
                    
                    if ($role_sql) {
                        $stmt = oci_parse($conn, $role_sql);
                        oci_bind_by_name($stmt, ":username", $username);
                        $success = $success && @oci_execute($stmt, OCI_DEFAULT);
                        if ($error = handleOracleError($stmt, $conn)) {
                            echo "<script>swal('Error', '$error', 'error');</script>";
                            exit;
                        }
                    }

                    if ($success) {
                        oci_commit($conn);
                        echo "<script>swal('Éxito', 'Usuario creado correctamente', 'success').then(() => location.reload());</script>";
                    }
                    break;

                case 'update':
                    if (!userExists($conn, $username)) {
                        echo "<script>swal('Error', 'El usuario no existe.', 'error');</script>";
                        exit;
                    }

                    $success = true;
                    
                    // Actualizar contraseña si se proporcionó una nueva
                    if (!empty($password)) {
                        if (!validatePassword($password)) {
                            echo "<script>swal('Error', 'La contraseña debe tener al menos 8 caracteres, incluir letras y números.', 'error');</script>";
                            exit;
                        }
                        
                        $alter_user_sql = "ALTER USER :username IDENTIFIED BY :password";
                        $stmt = oci_parse($conn, $alter_user_sql);
                        oci_bind_by_name($stmt, ":username", $username);
                        oci_bind_by_name($stmt, ":password", $password);
                        $success = $success && @oci_execute($stmt, OCI_DEFAULT);
                        if ($error = handleOracleError($stmt, $conn)) {
                            echo "<script>swal('Error', '$error', 'error');</script>";
                            exit;
                        }
                    }
                    
                    // Revocar roles existentes
                    $revoke_roles = [
                        "REVOKE DBA FROM :username",
                        "REVOKE SELECT_CATALOG_ROLE FROM :username",
                        "REVOKE RESOURCE FROM :username",
                        "REVOKE CONNECT FROM :username"
                    ];
                    
                    foreach ($revoke_roles as $revoke_sql) {
                        $stmt = oci_parse($conn, $revoke_sql);
                        oci_bind_by_name($stmt, ":username", $username);
                        @oci_execute($stmt, OCI_DEFAULT); // Ignoramos errores aquí
                    }
                    
                    // Asignar nuevo rol
                    $role_sql = "";
                    switch ($role) {
                        case 'admin':
                            $role_sql = "GRANT DBA TO :username";
                            break;
                        case 'read_only':
                            $role_sql = "GRANT SELECT_CATALOG_ROLE, SELECT ANY TABLE TO :username";
                            break;
                        case 'user':
                            $role_sql = "GRANT RESOURCE, CONNECT TO :username";
                            break;
                    }
                    
                    if ($role_sql) {
                        $stmt = oci_parse($conn, $role_sql);
                        oci_bind_by_name($stmt, ":username", $username);
                        $success = $success && @oci_execute($stmt, OCI_DEFAULT);
                        if ($error = handleOracleError($stmt, $conn)) {
                            echo "<script>swal('Error', '$error', 'error');</script>";
                            exit;
                        }
                    }

                    if ($success) {
                        oci_commit($conn);
                        echo "<script>swal('Éxito', 'Usuario actualizado correctamente', 'success').then(() => location.reload());</script>";
                    }
                    break;

                case 'delete':
                    if (!userExists($conn, $username)) {
                        echo "<script>swal('Error', 'El usuario no existe.', 'error');</script>";
                        exit;
                    }

                    // Primero intentamos matar las sesiones activas del usuario
                    $kill_session_sql = "SELECT 'ALTER SYSTEM KILL SESSION ''' || sid || ',' || serial# || '''' AS kill_sql 
                                       FROM v\$session 
                                       WHERE username = :username";
                    $stmt = oci_parse($conn, $kill_session_sql);
                    oci_bind_by_name($stmt, ":username", $username);
                    oci_execute($stmt);
                    
                    while ($row = oci_fetch_assoc($stmt)) {
                        $kill_stmt = oci_parse($conn, $row['KILL_SQL']);
                        @oci_execute($kill_stmt);
                    }

                    // Ahora eliminamos el usuario
                    $drop_user_sql = "DROP USER :username CASCADE";
                    $stmt = oci_parse($conn, $drop_user_sql);
                    oci_bind_by_name($stmt, ":username", $username);
                    
                    if (@oci_execute($stmt, OCI_DEFAULT)) {
                        oci_commit($conn);
                        echo "<script>swal('Éxito', 'Usuario eliminado correctamente', 'success').then(() => location.reload());</script>";
                    } else {
                        $error = handleOracleError($stmt, $conn);
                        echo "<script>swal('Error', '$error', 'error');</script>";
                    }
                    break;
            }
        } catch (Exception $e) {
            oci_rollback($conn);
            echo "<script>swal('Error', 'Error inesperado: " . htmlspecialchars($e->getMessage()) . "', 'error');</script>";
        }
    }
}

// Obtener lista de usuarios del sistema con información adicional
$query = "SELECT u.username, 
                 u.created, 
                 u.account_status,
                 u.default_tablespace,
                 LISTAGG(rp.granted_role, ', ') WITHIN GROUP (ORDER BY rp.granted_role) as roles
          FROM dba_users u
          LEFT JOIN dba_role_privs rp ON u.username = rp.grantee
          WHERE u.account_status = 'OPEN'
          AND u.username NOT IN ('SYS','SYSTEM', 'OUTLN', 'DIP', 'ORACLE_OCM', 'DBSNMP', 'APPQOSSYS', 'WMSYS', 'EXFSYS', 'CTXSYS', 'XDB', 'ANONYMOUS', 'XS$NULL', 'ORDDATA', 'SI_INFORMTN_SCHEMA', 'ORDPLUGINS', 'ORDSYS', 'MDSYS', 'OLAPSYS', 'MDDATA', 'SPATIAL_WFS_ADMIN_USR', 'SPATIAL_CSW_ADMIN_USR', 'SYSMAN', 'MGMT_VIEW', 'FLOWS_FILES', 'APEX_PUBLIC_USER', 'APEX_030200', 'OWBSYS', 'OWBSYS_AUDIT', 'SCOTT')
          GROUP BY u.username, u.created, u.account_status, u.default_tablespace
          ORDER BY u.created DESC";

$result = oci_parse($conn, $query);
oci_execute($result);

$users = array();
while ($row = oci_fetch_assoc($result)) {
    $users[] = $row;
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Usuarios Oracle</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    
    <style>
        .fixed-size {
            max-height: 600px;
            overflow-y: auto;
        }
        .card-custom {
            height: 100%;
        }
        .table th {
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
        }
        @media (max-width: 767.98px) {
            .fixed-size {
                max-height: 400px;
            }
        }
    </style>
</head>

<body class="bg-light">
    <div class="container mt-5">
        <div class="row">
            <!-- Formulario de crear/editar usuario -->
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-center mb-4">Gestión de Usuario Oracle</h2>
                        <form method="post" id="userForm">
                            <input type="hidden" name="action" value="create">
                            
                            <div class="mb-3">
                                <label for="username" class="form-label">Nombre de Usuario:</label>
                                <input type="text" class="form-control" id="username" name="username" required>
                                <small class="text-muted">El nombre se convertirá a mayúsculas automáticamente</small>
                            </div>
                            
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña:</label>
                                <input type="password" class="form-control" id="password" name="password">
                                <small class="text-muted">Dejar en blanco para mantener la contraseña actual al editar</small>
                            </div>
                            
                            <div class="mb-3">
                                <label for="role" class="form-label">Rol:</label>
                                <select class="form-select" id="role" name="role" required>
                                    <option value="user">Usuario Normal (RESOURCE)</option>
                                    <option value="admin">Administrador (DBA)</option>
                                    <option value="read_only">Solo Lectura (SELECT_CATALOG_ROLE)</option>
                                </select>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Guardar Usuario</button>
                                <button type="button" class="btn btn-secondary" onclick="resetForm()">Limpiar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <!-- Lista de usuarios -->
            <div class="col-md-8 mb-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="card-title text-center mb-4">Usuarios del Sistema</h2>
                        <div class="fixed-size">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Usuario</th>
                                        <th>Roles Asignados</th>
                                        <th>Fecha Creación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($user['USERNAME']); ?></td>
                                        <td><?php echo htmlspecialchars($user['ROLES'] ?? 'Sin roles'); ?></td>
                                        <td><?php echo htmlspecialchars($user['CREATED']); ?></td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" 
                                                    onclick="editUser('<?php echo $user['USERNAME']; ?>')">
                                                Editar
                                            </button>
                                            <button class="btn btn-sm btn-danger" 
                                                    onclick="deleteUser('<?php echo $user['USERNAME']; ?>')">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Botón de volver -->
        <div class="text-start mt-3">
            <a href="../../index.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- JavaScript para la funcionalidad -->
    <script>
        function editUser(username) {
            document.getElementById('username').value = username;
            document.getElementById('username').readOnly = true;
            document.getElementById('password').required = false;
            document.querySelector('[name="action"]').value = 'update';
            document.querySelector('.card-title').textContent = 'Editar Usuario Oracle';
            
            // Determinar el rol actual basado en los roles mostrados en la tabla
            const roleCell = Array.from(document.querySelectorAll('td')).find(td => 
                td.textContent === username
            ).nextElementSibling;
            const roles = roleCell.textContent;
            
            if (roles.includes('DBA')) {
                document.getElementById('role').value = 'admin';
            } else if (roles.includes('SELECT_CATALOG_ROLE')) {
                document.getElementById('role').value = 'read_only';
            } else {
                document.getElementById('role').value = 'user';
            }
        }

        function deleteUser(username) {
            swal({
                title: "¿Estás seguro?",
                text: "Esta acción eliminará el usuario y todos sus objetos de la base de datos",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    const form = new FormData();
                    form.append('action', 'delete');
                    form.append('username', username);
                    
                    fetch(window.location.href, {
                        method: 'POST',
                        body: form
                    })
                    .then(() => location.reload());
                }
            });
        }

        function resetForm() {
            document.getElementById('userForm').reset();
            document.getElementById('username').readOnly = false;
            document.getElementById('password').required = true;
            document.querySelector('[name="action"]').value = 'create';
            document.querySelector('.card-title').textContent = 'Crear Usuario Oracle';
        }
    </script>
</body>
</html>