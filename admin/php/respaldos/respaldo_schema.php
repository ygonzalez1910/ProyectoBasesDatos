<?php
// Conexión a la base de datos
include('../../../procesos/connect.php');

// Obtener los esquemas (usuarios) de la base de datos
$schemas = [];
$query = "SELECT username FROM all_users";
$result = oci_parse($conn, $query);
oci_execute($result);

while ($row = oci_fetch_assoc($result)) {
    $schemas[] = $row['USERNAME'];
}

// Procesamiento del formulario para crear un respaldo
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $schema = $_POST['schema'];
    $directory = $_POST['directory'];  // Directorio seleccionado del input select
    $dumpfile = $_POST['dumpfile'];
    $logfile = $_POST['logfile'];
    $backup_type = $_POST['backup_type'];
    $size_max = $_POST['size_max'];
    $size_min = $_POST['size_min'];
    $autoextend = isset($_POST['autoextend']) ? 'autoextend on' : 'autoextend off';
    $max_limit = isset($_POST['max_limit']) ? $_POST['max_limit'] : '';

    if ($backup_type == 'mysqldump') {
        // Comando para generar un respaldo usando mysqldump
        $command = "mysqldump -u usuario -p contraseña --databases $schema > /path/$dumpfile.sql";

        // Ejecutar el comando
        system($command, $output);

        if ($output === 0) {
            echo "<script>swal('Éxito', 'Respaldo creado con éxito usando mysqldump.', 'success');</script>";
        } else {
            echo "<script>swal('Error', 'Hubo un problema al crear el respaldo con mysqldump.', 'error');</script>";
        }
    } else if ($backup_type == 'expdp') {
        // Comando para generar un respaldo usando expdp con tamaño máximo, mínimo, autoextend y límite máximo
        $command = "expdp $schema/$db_password schemas=$schema directory=$directory dumpfile=$dumpfile logfile=$logfile filesize=$size_max minsize=$size_min $autoextend";
        if ($autoextend == 'autoextend on' && !empty($max_limit)) {
            $command .= " maxsize=$max_limit";
        }
        $output = shell_exec($command);

        if ($output) {
            echo "<script>swal('Éxito', 'Respaldo creado con éxito usando expdp.', 'success');</script>";
        } else {
            echo "<script>swal('Error', 'Hubo un problema al crear el respaldo con expdp.', 'error');</script>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Respaldo por Esquema</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

    <!-- Estilos personalizados -->
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
                                <label for="schema" class="form-label">Esquema:</label>
                                <input type="text" id="schema" name="schema" class="form-control" required>
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
                                <label for="size_max" class="form-label">Tamaño máximo (en MB):</label>
                                <input type="number" id="size_max" name="size_max" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <label for="size_min" class="form-label">Tamaño mínimo (en MB):</label>
                                <input type="number" id="size_min" name="size_min" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="autoextend" name="autoextend" onclick="toggleMaxLimit()">
                                    <label class="form-check-label" for="autoextend">Autoextend</label>
                                </div>
                            </div>

                            <!-- Campo adicional que se mostrará solo si se selecciona Autoextend -->
                            <div class="mb-3" id="maxLimitContainer" style="display: none;">
                                <label for="max_limit" class="form-label">Límite máximo (en MB):</label>
                                <input type="number" id="max_limit" name="max_limit" class="form-control">
                            </div>

                            <div class="mb-3">
                                <label for="backup_type" class="form-label">Tipo de respaldo:</label>
                                <select id="backup_type" name="backup_type" class="form-select" required>
                                    <option value="mysqldump">mysqldump</option>
                                    <option value="expdp">expdp</option>
                                </select>
                            </div>

                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Respaldar Esquema">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Columna de la tabla con los esquemas -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Esquemas Disponibles</h1>
                        <div class="fixed-size">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Esquema</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($schemas as $schema): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($schema); ?></td>
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

    <!-- Script para mostrar/ocultar el campo Límite máximo cuando se selecciona Autoextend -->
    <script>
        function toggleMaxLimit() {
            var autoextendCheckbox = document.getElementById('autoextend');
            var maxLimitContainer = document.getElementById('maxLimitContainer');

            if (autoextendCheckbox.checked) {
                maxLimitContainer.style.display = 'block';
            } else {
                maxLimitContainer.style.display = 'none';
            }
        }
    </script>
</body>

</html>
