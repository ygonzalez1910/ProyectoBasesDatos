<?php
// Conexión a la base de datos
include('../../../procesos/connect.php');

// Obtener los esquemas (usuarios) de la base de datos
$schemas = [];
$query_schemas = "SELECT username FROM all_users";
$result_schemas = oci_parse($conn, $query_schemas);
oci_execute($result_schemas);

while ($row = oci_fetch_assoc($result_schemas)) {
    $schemas[] = $row['USERNAME'];
}

// Obtener los directorios
$directories = [];
$query_directories = "SELECT directory_name, directory_path FROM all_directories";
$result_directories = oci_parse($conn, $query_directories);
oci_execute($result_directories);

while ($row = oci_fetch_assoc($result_directories)) {
    $directories[] = $row;
}

// Variable para mensajes
$message = '';
$message_type = '';


// Procesamiento del formulario para crear un respaldo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $schema = $_POST['schema'];  // Esquema seleccionado
    $directory = $_POST['directory'];  // Directorio seleccionado
    $backup_name = $_POST['backup_name'];  // Nombre del respaldo

    // Comando para crear el directorio y asignar permisos
    $create_directory_sql = "CREATE OR REPLACE DIRECTORY $backup_name AS '$directory'";
    $grant_permission_sql = "GRANT READ, WRITE ON DIRECTORY $backup_name TO $schema";

    // Ejecutar el comando para crear el directorio
    $create_directory_stmt = oci_parse($conn, $create_directory_sql);
    $grant_permission_stmt = oci_parse($conn, $grant_permission_sql);

    if (oci_execute($create_directory_stmt) && oci_execute($grant_permission_stmt)) {
        $message = "Directorio creado y permisos asignados con éxito.";
        $message_type = "success";
    } else {
        $message = "Hubo un problema al crear el directorio o asignar permisos.";
        $message_type = "error";
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respaldo por Esquema</title>

    <!-- Incluye SweetAlert2 antes de que lo uses -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .fixed-size {
            max-height: 400px;
            overflow-y: scroll;
        }

        .card-custom {
            height: 100%;
        }

        @media (max-width: 767.98px) {
            .fixed-size {
                max-height: 300px;
            }
        }
    </style>
</head>

<body class="bg-light">
    <div class="container mt-5">
        <div class="row">
            <!-- Columna del formulario -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Respaldo por Esquema</h1>
                        <form method="post" action="">
                            <div class="mb-3">
                                <label for="backup_name" class="form-label">Nombre del respaldo:</label>
                                <input type="text" id="backup_name" name="backup_name" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <label for="directory" class="form-label">Directorio:</label>
                                <select id="directory" name="directory" class="form-select" required>
                                    <option value="C:\ORACLE_FILES\HD1">C:\ORACLE_FILES\HD1</option>
                                    <option value="C:\ORACLE_FILES\HD2">C:\ORACLE_FILES\HD2</option>
                                    <option value="C:\ORACLE_FILES\HD3">C:\ORACLE_FILES\HD3</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="schema" class="form-label">Esquema:</label>
                                <select id="schema" name="schema" class="form-select" required>
                                    <?php foreach ($schemas as $schema): ?>
                                        <option value="<?php echo htmlspecialchars($schema); ?>">
                                            <?php echo htmlspecialchars($schema); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Respaldar Esquema">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Columna de la tabla con los directorios -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Directorios Disponibles</h1>
                        <div class="fixed-size"> <!-- Contenedor con scroll -->
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre del Directorio</th>
                                        <th>Ruta del Directorio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($directories as $dir): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($dir['DIRECTORY_NAME']); ?></td>
                                            <td><?php echo htmlspecialchars($dir['DIRECTORY_PATH']); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mensaje de éxito o error -->
        <?php if ($message): ?>
            <script>
                Swal.fire({
                    title: '<?php echo $message_type === "success" ? "Éxito" : "Error"; ?>',
                    text: '<?php echo $message; ?>',
                    icon: '<?php echo $message_type; ?>',
                    confirmButtonText: 'Ok'
                });
            </script>
        <?php endif; ?>

        <div class="text-start mt-3">
            <a href="respaldos.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>