<?php
// Conexión a la base de datos
include('../../../procesos/connect.php');

// Obtener los esquemas (usuarios) de la base de datos
$schemas = [];
$query_schemas = "SELECT username 
                 FROM all_users 
                 WHERE username NOT IN ('SYS','SYSTEM','OUTLN','DBSNMP','APPQOSSYS','DBSFWUSER','GSMADMIN_INTERNAL')
                 ORDER BY username";
$result_schemas = oci_parse($conn, $query_schemas);
oci_execute($result_schemas);

while ($row = oci_fetch_assoc($result_schemas)) {
    $schemas[] = $row['USERNAME'];
}

// Obtener los directorios
$directories = [];
$query_directories = "SELECT directory_name, directory_path FROM dba_directories WHERE directory_name NOT LIKE 'ORACLE%'";
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
    try {
        $schema = $_POST['schema'];  // Esquema seleccionado
        $directory = $_POST['directory'];  // Directorio seleccionado
        $backup_name = $_POST['backup_name'];  // Nombre del respaldo
        $password = $_POST['password']; // Contraseña del esquema

        // Crear el directorio en la base de datos
        $create_directory_sql = "CREATE OR REPLACE DIRECTORY $backup_name AS '$directory'";
        $grant_permission_sql = "GRANT READ, WRITE ON DIRECTORY $backup_name TO $schema";

        $create_directory_stmt = oci_parse($conn, $create_directory_sql);
        $grant_permission_stmt = oci_parse($conn, $grant_permission_sql);

        if (!oci_execute($create_directory_stmt) || !oci_execute($grant_permission_stmt)) {
            throw new Exception("Error al crear el directorio o asignar permisos.");
        }

        // Comando para exportar el esquema usando EXPDP con captura de errores
        $dumpfile = "{$backup_name}.DMP";
        $logfile = "{$backup_name}.LOG";
        $expdp_command = "EXPDP \"$schema/$password@XE\" SCHEMAS=$schema DIRECTORY=$backup_name " .
            "DUMPFILE=$dumpfile LOGFILE=$logfile";

        // Ejecutar el comando y capturar la salida
        exec($expdp_command, $output, $return_var);

        // Verificar el resultado
        if ($return_var !== 0) {
            throw new Exception(implode("\n", $output));
        }

        // Verificar si el archivo DMP fue creado
        $full_path = $directory . '/' . $dumpfile;
        if (!file_exists($full_path)) {
            throw new Exception("El archivo de respaldo no fue creado.");
        }

        // Verificar el tamaño del archivo
        $file_size = filesize($full_path);
        if ($file_size === 0) {
            throw new Exception("El archivo de respaldo está vacío.");
        }

        $formatted_size = number_format($file_size / 1024 / 1024, 2);
        $message = "Respaldo creado exitosamente.\nTamaño del archivo: {$formatted_size} MB\nUbicación: $full_path";
        $message_type = "success";

    } catch (Exception $e) {
        $message = "Error: " . $e->getMessage();
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

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
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

        .loading {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            justify-content: center;
            align-items: center;
        }

        .loading-content {
            background: white;
            padding: 20px;
            border-radius: 5px;
            text-align: center;
        }
    </style>
</head>

<body class="bg-light">
    <!-- Loading overlay -->
    <div class="loading" id="loadingOverlay">
        <div class="loading-content">
            <div class="spinner-border text-primary mb-2" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <div>Creando respaldo... Por favor espere</div>
        </div>
    </div>

    <div class="container mt-5">
        <div class="row">
            <!-- Columna del formulario -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Respaldo por Esquema</h1>
                        <form method="post" action="" id="backupForm">

                            <div class="mb-3">
                                <label for="backup_name" class="form-label">Nombre del respaldo:</label>
                                <input type="text" id="backup_name" name="backup_name" class="form-control"
                                    title="Solo se permiten letras, números, guiones y guiones bajos" required>
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

                            <div class="mb-3">
                                <label for="password" class="form-label">Contraseña del esquema:</label>
                                <input type="password" id="password" name="password" class="form-control" required>
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

        <!-- Al final de tu archivo PHP -->
        <?php if ($message): ?>
            <script>
                Swal.fire({
                    title: <?php echo json_encode($message_type === "success" ? "Éxito" : "Error"); ?>,
                    text: <?php echo json_encode($message); ?>,
                    icon: <?php echo json_encode($message_type); ?>,
                    confirmButtonText: 'Ok'
                });
            </script>
        <?php endif; ?>


        <div class="text-start mt-3">
            <a href="respaldos.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        document.getElementById('backupForm').addEventListener('submit', function () {
            document.getElementById('loadingOverlay').style.display = 'flex';
        });
    </script>
</body>

</html>