<?php
include('../../../procesos/connect.php');

$files = []; // Inicializa un array para almacenar los archivos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $schema = $_POST['schema'];
    $directory = $_POST['directory'];
    $dumpfile = $_POST['dumpfile'];
    $logfile = $_POST['logfile'];

    $command = "impdp $schema/$db_password schemas=$schema directory=$directory dumpfile=$dumpfile logfile=$logfile";
    $output = shell_exec($command);

    // Mensaje de éxito con SweetAlert
    echo "<script>swal('Éxito', 'Restauración de esquema completada.', 'success');</script>";
}

// Verifica si se ha enviado un directorio
if (isset($_POST['directory'])) {
    $selectedDirectory = $_POST['directory'];
    if (is_dir($selectedDirectory)) {
        $files = array_diff(scandir($selectedDirectory), array('..', '.')); // Lista archivos en el directorio
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurar Esquema</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> <!-- SweetAlert para los mensajes -->

    <!-- Estilos personalizados -->
    <style>
        .card-custom {
            height: 100%;
            /* Ajusta el tamaño de la card para que ocupe toda la altura disponible */
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
                        <h1 class="card-title text-center mb-4">Restaurar Esquema</h1>
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
                                <label for="dumpfile" class="form-label">Nombre del archivo de volcado:</label>
                                <input type="text" id="dumpfile" name="dumpfile" class="form-control" required>
                            </div>

                            <div class="mb-3">
                                <label for="logfile" class="form-label">Nombre del archivo de log:</label>
                                <input type="text" id="logfile" name="logfile" class="form-control" required>
                            </div>

                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Restaurar Esquema">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Columna de archivos en el directorio seleccionado -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Archivos en el Directorio Seleccionado</h1>
                        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Archivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($files as $file): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($file); ?></td>
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