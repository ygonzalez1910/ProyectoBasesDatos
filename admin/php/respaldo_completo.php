<?php
include('../../procesos/connect.php'); // Asegúrate de que este archivo tenga la conexión a la base de datos

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $directory = $_POST['directory'];
    $dumpfile = $_POST['dumpfile'];
    $logfile = $_POST['logfile'];

    $command = "expdp $db_username/$db_password full=y directory=$directory dumpfile=$dumpfile logfile=$logfile";
    $output = shell_exec($command);
    echo "Respaldo completo completado.<br>";
    echo $output;
}

// Consulta para obtener los tablespaces
$query = "SELECT tablespace_name, SUM(bytes) / 1024 / 1024 AS size_mb 
          FROM dba_data_files 
          GROUP BY tablespace_name 
          ORDER BY tablespace_name";
$result = oci_parse($conn, $query); // Cambia $connection por $conn
oci_execute($result);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respaldo Completo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Respaldo Completo</h1>
                        <form method="post" action="">
                            <div class="mb-3">
                                <label for="directory" class="form-label">Directorio:</label>
                                <input type="text" id="directory" name="directory" class="form-control" required>
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
                                <input type="submit" class="btn btn-primary" value="Respaldar Completo">
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title text-center">Espacios de Tabla</h5>
                        <div style="max-height: 300px; overflow-y: auto;">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre del Tablespace</th>
                                        <th>Tamaño (MB)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($row = oci_fetch_assoc($result)): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($row['TABLESPACE_NAME']); ?></td>
                                        <td><?php echo htmlspecialchars($row['SIZE_MB']); ?></td>
                                    </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3">
            <a href="respaldos.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>
</body>
</html>
