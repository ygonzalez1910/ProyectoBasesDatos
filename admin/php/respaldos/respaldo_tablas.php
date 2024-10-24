<?php
include('../../../procesos/connect.php');

// Consulta para obtener las tablas disponibles
$tables = [];
$query = "SELECT owner, table_name FROM all_tables ORDER BY owner, table_name";
$result = oci_parse($conn, $query);
oci_execute($result);

while ($row = oci_fetch_assoc($result)) {
    $tables[] = $row;
}

// Procesamiento del formulario para crear un respaldo de tabla
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $table = $_POST['table'];
    $directory = $_POST['directory'];
    $dumpfile = $_POST['dumpfile'];
    $logfile = $_POST['logfile'];

    // Comando para crear el respaldo
    $command = "expdp $db_username/$db_password tables=$table directory=$directory dumpfile=$dumpfile logfile=$logfile";
    $output = shell_exec($command);

    // Comprobar si el comando se ejecutó correctamente
    if ($output === null) {
        echo "<script>swal('Error', 'Hubo un problema al crear el respaldo.', 'error');</script>";
    } else {
        echo "<script>swal('Éxito', 'Respaldo de tabla completado.', 'success');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respaldo de Tabla</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> <!-- SweetAlert para los mensajes -->

    <!-- Estilos personalizados -->
    <style>
        .fixed-size {
            max-height: 400px; /* Altura máxima del contenedor con scroll */
            overflow-y: scroll;
        }

        .card-custom {
            height: 100%; /* Ajusta el tamaño de la card para que ocupe toda la altura disponible */
        }

        .spinner-container {
            display: none; /* Oculta el spinner por defecto */
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000; /* Asegúrate de que esté por encima de otros elementos */
        }

        /* Ajustar para pantallas pequeñas */
        @media (max-width: 767.98px) {
            .fixed-size {
                max-height: 300px; /* Menor altura en pantallas pequeñas */
            }
        }
    </style>
</head>
<body class="bg-light">
    <div class="spinner-container" id="spinner">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
    </div>

    <div class="container mt-5">
        <div class="row">
            <!-- Columna del formulario -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Respaldo de Tabla</h1>
                        <form method="post" action="" onsubmit="showSpinner()">
                            <div class="mb-3">
                                <label for="table" class="form-label">Tabla:</label>
                                <input type="text" id="table" name="table" class="form-control" placeholder="Ejemplo: Schema.Table" required>
                            </div>

                            <div class="mb-3">
                                <label for="directory" class="form-label">Directorio:</label>
                                <!-- Cambiado a un select para elegir entre tres opciones -->
                                <select id="directory" name="directory" class="form-select" required>
                                    <option value="C:\ORACLE_FILES\HD1">C:\ORACLE_FILES\HD1</option>
                                    <option value="C:\ORACLE_FILES\HD2">C:\ORACLE_FILES\HD2</option>
                                    <option value="C:\ORACLE_FILES\HD3">C:\ORACLE_FILES\HD3</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="dumpfile" class="form-label">Nombre del archivo de volcado:</label>
                                <input type="text" id="dumpfile" name="dumpfile" class="form-control" placeholder="Ejemplo: table_YYYYMMDD.dmp" required>
                            </div>

                            <div class="mb-3">
                                <label for="logfile" class="form-label">Nombre del archivo de log:</label>
                                <input type="text" id="logfile" name="logfile" class="form-control" placeholder="Ejemplo: table_YYYYMMDD.log" required>
                            </div>

                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Respaldar Tabla">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Columna de la tabla con las tablas disponibles -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Tablas Disponibles</h1>
                        <div class="fixed-size"> <!-- Contenedor con scroll -->
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Propietario</th>
                                        <th>Tabla</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($tables as $table): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($table['OWNER']); ?></td>
                                            <td><?php echo htmlspecialchars($table['TABLE_NAME']); ?></td>
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
            <a href="respaldos.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        function showSpinner() {
            document.getElementById('spinner').style.display = 'block'; // Muestra el spinner
        }
    </script>
</body>
</html>
