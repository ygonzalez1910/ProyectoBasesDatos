<?php
// Conexión a la base de datos
include('../../../procesos/connect.php');

// Procesar formularios
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'create':
                $username = strtoupper(filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING));
                $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
                $role = filter_input(INPUT_POST, 'role', FILTER_SANITIZE_STRING);
                
                // Crear usuario
                $create_user_sql = "CREATE USER $username IDENTIFIED BY $password";
                $stmt = oci_parse($conn, $create_user_sql);
                
                if (oci_execute($stmt)) {
                    // Otorgar permisos básicos
                    $grant_connect = "GRANT CONNECT TO $username";
                    $stmt_connect = oci_parse($conn, $grant_connect);
                    oci_execute($stmt_connect);
                    
                    // Otorgar rol según el tipo seleccionado
                    switch ($role) {
                        case 'admin':
                            $grant_role = "GRANT DBA TO $username";
                            break;
                        case 'read_only':
                            $grant_role = "GRANT SELECT_CATALOG_ROLE TO $username";
                            break;
                        case 'user':
                            $grant_role = "GRANT RESOURCE TO $username";
                            break;
                    }
                    
                    $stmt_role = oci_parse($conn, $grant_role);
                    oci_execute($stmt_role);
                    
                    echo "<script>swal('Éxito', 'Usuario creado correctamente', 'success');</script>";
                } else {
                    $error = oci_error($stmt);
                    echo "<script>swal('Error', 'Error al crear el usuario: " . $error['message'] . "', 'error');</script>";
                }
                break;

            case 'update':
                $username = strtoupper(filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING));
                $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
                $role = filter_input(INPUT_POST, 'role', FILTER_SANITIZE_STRING);
                
                // Actualizar contraseña si se proporcionó una nueva
                if (!empty($password)) {
                    $alter_user_sql = "ALTER USER $username IDENTIFIED BY $password";
                    $stmt = oci_parse($conn, $alter_user_sql);
                    oci_execute($stmt);
                }
                
                // Revocar roles existentes
                $revoke_roles = [
                    "REVOKE DBA FROM $username",
                    "REVOKE SELECT_CATALOG_ROLE FROM $username",
                    "REVOKE RESOURCE FROM $username"
                ];
                
                foreach ($revoke_roles as $revoke_sql) {
                    $stmt = oci_parse($conn, $revoke_sql);
                    @oci_execute($stmt); // Usamos @ para ignorar errores si el rol no estaba asignado
                }
                
                // Asignar nuevo rol
                switch ($role) {
                    case 'admin':
                        $grant_role = "GRANT DBA TO $username";
                        break;
                    case 'read_only':
                        $grant_role = "GRANT SELECT_CATALOG_ROLE TO $username";
                        break;
                    case 'user':
                        $grant_role = "GRANT RESOURCE TO $username";
                        break;
                }
                
                $stmt_role = oci_parse($conn, $grant_role);
                if (oci_execute($stmt_role)) {
                    echo "<script>swal('Éxito', 'Usuario actualizado correctamente', 'success');</script>";
                } else {
                    $error = oci_error($stmt_role);
                    echo "<script>swal('Error', 'Error al actualizar el usuario: " . $error['message'] . "', 'error');</script>";
                }
                break;

            case 'delete':
                $username = strtoupper(filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING));
                
                $drop_user_sql = "DROP USER $username CASCADE";
                $stmt = oci_parse($conn, $drop_user_sql);
                
                if (oci_execute($stmt)) {
                    echo "<script>swal('Éxito', 'Usuario eliminado correctamente', 'success');</script>";
                } else {
                    $error = oci_error($stmt);
                    echo "<script>swal('Error', 'Error al eliminar el usuario: " . $error['message'] . "', 'error');</script>";
                }
                break;
        }
    }
}

// Obtener lista de usuarios del sistema
$users = [];
$query = "SELECT username, 
                 created, 
                 LISTAGG(granted_role, ', ') WITHIN GROUP (ORDER BY granted_role) as roles
          FROM dba_users 
          LEFT JOIN dba_role_privs ON dba_users.username = dba_role_privs.grantee
          WHERE account_status = 'OPEN'
          AND username NOT IN ('SYS','SYSTEM')
          GROUP BY username, created
          ORDER BY created DESC";
$result = oci_parse($conn, $query);
oci_execute($result);

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