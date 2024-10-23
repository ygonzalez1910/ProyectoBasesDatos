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
    $table = $_POST['backup_tabla']; // Tabla seleccionada
    $directory = $_POST['directory'];  // Directorio seleccionado
    $backup_name = $_POST['backup_name'];  // Nombre del respaldo

    // Comando para crear el respaldo de la tabla
    $backup_sql = "CREATE TABLE $backup_name AS SELECT * FROM $schema.$table";

    // Ejecutar el comando para crear el respaldo
    $backup_stmt = oci_parse($conn, $backup_sql);

    if (oci_execute($backup_stmt)) {
        $message = "Respaldo de la tabla '$table' creado con éxito.";
        $message_type = "success";
    } else {
        $message = "Hubo un problema al crear el respaldo.";
        $message_type = "error";
    }
}

// Cargar tablas de un esquema específico
if (isset($_GET['schema'])) {
    $selected_schema = $_GET['schema'];
    $tables = [];
    $query_tables = "SELECT table_name FROM all_tables WHERE owner = :schema";
    $stmt = oci_parse($conn, $query_tables);
    oci_bind_by_name($stmt, ':schema', $selected_schema);
    oci_execute($stmt);

    while ($row = oci_fetch_assoc($stmt)) {
        $tables[] = $row['TABLE_NAME'];
    }

    // Verificar que hay tablas antes de enviar la respuesta
    header('Content-Type: application/json');
    echo json_encode($tables);
    exit; // Esto asegura que no haya más salida
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
    <script>
        function cargarTablas() {
            const schemaSelect = document.getElementById('schema');
            const selectedSchema = schemaSelect.value;
            const tablesSelect = document.getElementById('backup_tabla');

            // Limpiar las tablas anteriores
            tablesSelect.innerHTML = '<option value="" disabled selected>Cargando...</option>';

            // Construir la URL correctamente
            fetch(`${window.location.pathname}?schema=${selectedSchema}`)
                .then(response => response.json())  // Cambiar a response.json() directamente
                .then(data => {
                    // Limpiar opciones y agregar las nuevas
                    tablesSelect.innerHTML = '<option value="" disabled selected>Selecciona una tabla</option>';
                    data.forEach(table => {
                        const option = document.createElement('option');
                        option.value = table;
                        option.textContent = table;
                        tablesSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    tablesSelect.innerHTML = '<option value="" disabled>Error al cargar tablas</option>';
                });
        }
    </script>
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
                                <select id="schema" name="schema" class="form-select" required
                                    onchange="cargarTablas()">
                                    <?php foreach ($schemas as $schema): ?>
                                        <option value="<?php echo htmlspecialchars($schema); ?>">
                                            <?php echo htmlspecialchars($schema); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="backup_tabla" class="form-label">Tabla:</label>
                                <select id="backup_tabla" name="backup_tabla" class="form-select" required>
                                    <option value="" disabled selected>Selecciona una tabla</option>
                                </select>
                            </div>

                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Respaldar Tabla">
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