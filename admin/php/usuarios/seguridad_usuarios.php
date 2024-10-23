<?php
// Conexión a la base de datos
include('../../procesos/connect.php');

// Iniciar sesión si no está iniciada
session_start();

// Verificar si el usuario tiene permisos de administrador
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    header('Location: login.php');
    exit();
}

// Procesar formularios
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'create':
                $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
                $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
                $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
                $role = filter_input(INPUT_POST, 'role', FILTER_SANITIZE_STRING);
                
                $query = "INSERT INTO users (username, password, email, role, created_at) 
                         VALUES (:username, :password, :email, :role, CURRENT_TIMESTAMP)";
                $stmt = oci_parse($conn, $query);
                
                oci_bind_by_name($stmt, ":username", $username);
                oci_bind_by_name($stmt, ":password", $password);
                oci_bind_by_name($stmt, ":email", $email);
                oci_bind_by_name($stmt, ":role", $role);
                
                if (oci_execute($stmt)) {
                    echo "<script>swal('Éxito', 'Usuario creado correctamente', 'success');</script>";
                } else {
                    echo "<script>swal('Error', 'Error al crear el usuario', 'error');</script>";
                }
                break;

            case 'update':
                $user_id = filter_input(INPUT_POST, 'user_id', FILTER_SANITIZE_NUMBER_INT);
                $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
                $role = filter_input(INPUT_POST, 'role', FILTER_SANITIZE_STRING);
                
                $query = "UPDATE users SET email = :email, role = :role WHERE id = :user_id";
                $stmt = oci_parse($conn, $query);
                
                oci_bind_by_name($stmt, ":email", $email);
                oci_bind_by_name($stmt, ":role", $role);
                oci_bind_by_name($stmt, ":user_id", $user_id);
                
                if (oci_execute($stmt)) {
                    echo "<script>swal('Éxito', 'Usuario actualizado correctamente', 'success');</script>";
                } else {
                    echo "<script>swal('Error', 'Error al actualizar el usuario', 'error');</script>";
                }
                break;

            case 'delete':
                $user_id = filter_input(INPUT_POST, 'user_id', FILTER_SANITIZE_NUMBER_INT);
                
                $query = "DELETE FROM users WHERE id = :user_id";
                $stmt = oci_parse($conn, $query);
                
                oci_bind_by_name($stmt, ":user_id", $user_id);
                
                if (oci_execute($stmt)) {
                    echo "<script>swal('Éxito', 'Usuario eliminado correctamente', 'success');</script>";
                } else {
                    echo "<script>swal('Error', 'Error al eliminar el usuario', 'error');</script>";
                }
                break;
        }
    }
}

// Obtener lista de usuarios
$users = [];
$query = "SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC";
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
    <title>Gestión de Usuarios</title>
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
                        <h2 class="card-title text-center mb-4">Crear Usuario</h2>
                        <form method="post" id="userForm">
                            <input type="hidden" name="action" value="create">
                            <input type="hidden" name="user_id" id="user_id">
                            
                            <div class="mb-3">
                                <label for="username" class="form-label">Usuario:</label>
                                <input type="text" class="form-control" id="username" name="username" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña:</label>
                                <input type="password" class="form-control" id="password" name="password" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="email" class="form-label">Email:</label>
                                <input type="email" class="form-control" id="email" name="email" required>
                            </div>
                            
                            <div class="mb-3">
                                <label for="role" class="form-label">Rol:</label>
                                <select class="form-select" id="role" name="role" required>
                                    <option value="user">Usuario</option>
                                    <option value="admin">Administrador</option>
                                    <option value="read_only">Solo lectura</option>
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
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th>Fecha Creación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($users as $user): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($user['USERNAME']); ?></td>
                                        <td><?php echo htmlspecialchars($user['EMAIL']); ?></td>
                                        <td><?php echo htmlspecialchars($user['ROLE']); ?></td>
                                        <td><?php echo htmlspecialchars($user['CREATED_AT']); ?></td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" 
                                                    onclick="editUser(<?php echo $user['ID']; ?>)">
                                                Editar
                                            </button>
                                            <button class="btn btn-sm btn-danger" 
                                                    onclick="deleteUser(<?php echo $user['ID']; ?>)">
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
            <a href="index.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- JavaScript para la funcionalidad -->
    <script>
        function editUser(userId) {
            // Obtener datos del usuario mediante AJAX
            fetch(`get_user.php?id=${userId}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('user_id').value = data.id;
                    document.getElementById('username').value = data.username;
                    document.getElementById('username').readOnly = true;
                    document.getElementById('email').value = data.email;
                    document.getElementById('role').value = data.role;
                    document.getElementById('password').required = false;
                    document.querySelector('form').action.value = 'update';
                });
        }

        function deleteUser(userId) {
            swal({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    const form = new FormData();
                    form.append('action', 'delete');
                    form.append('user_id', userId);
                    
                    fetch('users.php', {
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
            document.querySelector('form').action.value = 'create';
        }
    </script>
</body>
</html>