<?php
// Conexión a la base de datos
include('../../procesos/connect.php');

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
        // Comando para generar un respaldo usando expdp
        $command = "expdp $schema/$db_password schemas=$schema directory=$directory dumpfile=$dumpfile logfile=$logfile";
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
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> <!-- SweetAlert para los mensajes -->

    <!-- Estilos personalizados -->
    <style>
        .fixed-size {
            max-height: 400px;
            /* Altura máxima del contenedor con scroll */
            overflow-y: scroll;
        }

        .card-custom {
            height: 100%;
            /* Ajusta el tamaño de la card para que ocupe toda la altura disponible */
        }

        /* Ajustar para pantallas pequeñas */
        @media (max-width: 767.98px) {
            .fixed-size {
                max-height: 300px;
                /* Menor altura en pantallas pequeñas */
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
                                <!-- Cambiado a un select para elegir entre tres opciones -->
                                <select id="directory" name="directory" class="form-select" required>
                                    <option value="C:\ORACLE_FILES\HD1">C:\ORACLE_FILES\HD1</option>
                                    <option value="C:\ORACLE_FILES\HD2">C:\ORACLE_FILES\HD2</option>
                                    <option value="C:\ORACLE_FILES\HD3">C:\ORACLE_FILES\HD3</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="dumpfile" class="form-label">Nombre del archivo de volcado:</label>
                                <input type="text" id="dumpfile" name="dumpfile" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <label for="logfile" class="form-label">Nombre del archivo de log:</label>
                                <input type="text" id="logfile" name="logfile" class="form-control" required>
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
                        <div class="fixed-size"> <!-- Contenedor con scroll -->
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
</body>

</html>