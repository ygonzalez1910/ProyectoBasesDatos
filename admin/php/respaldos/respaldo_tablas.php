<?php
include('../../../procesos/connect.php');

// Obtener los esquemas y las tablas de la base de datos en formato esquema.tabla
$schema_tables = [];
$query_schema_tables = "SELECT owner, table_name 
FROM dba_tables
WHERE owner NOT IN ('ORDDATA', 'GSMADMIN_INTERNAL', 'DBSNMP', 'XDB', 'OUTLN', 'DBSFWUSER')
AND owner NOT LIKE '%SYS%'
ORDER BY owner, table_name";

$result_schema_tables = oci_parse($conn, $query_schema_tables);
oci_execute($result_schema_tables);

while ($row = oci_fetch_assoc($result_schema_tables)) {
    // Formato: esquema.tabla (por ejemplo, PADRON.DISTRITO)
    $schema_tables[] = $row['OWNER'] . '.' . $row['TABLE_NAME'];
}

// Obtener los directorios
$directories = [];
$query_directories = "SELECT directory_name, directory_path FROM dba_directories WHERE directory_name NOT LIKE 'ORACLE%'";
$result_directories = oci_parse($conn, $query_directories);
oci_execute($result_directories);

while ($row = oci_fetch_assoc($result_directories)) {
    $directories[] = $row;
}

// Variables para mensajes
$message = '';
$message_type = '';

// Procesamiento del formulario para crear un respaldo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $schema_table = $_POST['backup_tabla'];  // Esquema y tabla seleccionada en formato schema.tabla
        $directory = $_POST['directory'];  // Directorio seleccionado
        $backup_name = preg_replace('/[^a-zA-Z0-9_]/', '_', $_POST['backup_name']); // Sanitizar nombre del respaldo
        $schema_password = $_POST['schema_password'];  // Contraseña del esquema

        // Validar el esquema y la tabla
        if (strpos($schema_table, '.') === false || !in_array($schema_table, $schema_tables)) {
            throw new Exception("Selección de esquema.tabla no válida.");
        }

        // Separar esquema y tabla
        list($schema, $table) = explode('.', $schema_table);

        // Crear el directorio en la base de datos
        $create_directory_sql = "CREATE OR REPLACE DIRECTORY $backup_name AS '$directory'";
        $grant_permission_sql = "GRANT READ, WRITE ON DIRECTORY $backup_name TO $schema";

        $create_directory_stmt = oci_parse($conn, $create_directory_sql);
        $grant_permission_stmt = oci_parse($conn, $grant_permission_sql);

        if (!oci_execute($create_directory_stmt) || !oci_execute($grant_permission_stmt)) {
            throw new Exception("Error al crear el directorio o asignar permisos.");
        }

        // Construir el comando EXPDP
        $dumpfile = "{$backup_name}.DMP";
        $logfile = "{$backup_name}.LOG";
        $expdp_command = "EXPDP \"$schema/$schema_password@XE\" TABLES=$schema.$table DIRECTORY=$backup_name " . 
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
    <title>Respaldo de Tablas</title>
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
    </style>
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row">
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Respaldo de Tablas</h1>
                        <form method="post" action="" id="backupForm">
                            <div class="mb-3">
                                <label for="backup_name" class="form-label">Nombre del respaldo:</label>
                                <input type="text" id="backup_name" name="backup_name" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label for="directory" class="form-label">Directorio:</label>
                                <select id="directory" name="directory" class="form-select" required>
                                    <?php foreach ($directories as $dir): ?>
                                        <option value="<?php echo htmlspecialchars($dir['DIRECTORY_PATH']); ?>">
                                            <?php echo htmlspecialchars($dir['DIRECTORY_NAME']); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="backup_tabla" class="form-label">Tabla a respaldar:</label>
                                <select id="backup_tabla" name="backup_tabla" class="form-select" required>
                                    <?php foreach ($schema_tables as $schema_table): ?>
                                        <option value="<?php echo htmlspecialchars($schema_table); ?>">
                                            <?php echo htmlspecialchars($schema_table); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="schema_password" class="form-label">Contraseña del esquema:</label>
                                <input type="password" id="schema_password" name="schema_password" class="form-control" required>
                            </div>
                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Respaldar Tabla">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Directorios Disponibles</h1>
                        <div class="fixed-size">
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
</body>
</html>
