<?php
include('../../procesos/connect.php');

// Arreglo para almacenar los datos de rendimiento
$performance_data = [];

// Consulta para obtener el número de sesiones activas
$query_active_sessions = "SELECT COUNT(*) AS active_sessions FROM v\$session WHERE status = 'ACTIVE'";
$result_active_sessions = oci_parse($conn, $query_active_sessions);
if (oci_execute($result_active_sessions)) {
    $row = oci_fetch_assoc($result_active_sessions);
    $performance_data['Active Sessions'] = $row ? $row['active_sessions'] : 0;
} else {
    $performance_data['Active Sessions'] = 'Error: No se pudo obtener datos - ' . oci_error($result_active_sessions)['message'];
}

// Consulta para obtener el tamaño de la base de datos (suma de todos los datafiles)
$query_db_size = "SELECT SUM(bytes) / (1024 * 1024) AS database_size_mb FROM dba_data_files";
$result_db_size = oci_parse($conn, $query_db_size);
if (oci_execute($result_db_size)) {
    $row = oci_fetch_assoc($result_db_size);
    $performance_data['Database Size (MB)'] = $row ? round($row['database_size_mb'], 2) : 0;
} else {
    $performance_data['Database Size (MB)'] = 'Error: No se pudo obtener datos - ' . oci_error($result_db_size)['message'];
}

// Consulta para obtener el uso de CPU
$query_cpu_usage = "SELECT SUM(value) AS cpu_usage FROM v\$osstat WHERE stat_name = 'NUMCPUS'";
$result_cpu_usage = oci_parse($conn, $query_cpu_usage);
if (oci_execute($result_cpu_usage)) {
    $row = oci_fetch_assoc($result_cpu_usage);
    $performance_data['CPU Usage'] = $row ? $row['cpu_usage'] : 0;
} else {
    $performance_data['CPU Usage'] = 'Error: No se pudo obtener datos - ' . oci_error($result_cpu_usage)['message'];
}

// Consulta para obtener el número total de sesiones
$query_total_sessions = "SELECT COUNT(*) AS total_sessions FROM v\$session";
$result_total_sessions = oci_parse($conn, $query_total_sessions);
if (oci_execute($result_total_sessions)) {
    $row = oci_fetch_assoc($result_total_sessions);
    $performance_data['Total Sessions'] = $row ? $row['total_sessions'] : 0;
} else {
    $performance_data['Total Sessions'] = 'Error: No se pudo obtener datos - ' . oci_error($result_total_sessions)['message'];
}

// Consulta para obtener el espacio libre en la base de datos
$query_free_space = "SELECT ROUND(SUM(bytes) / (1024 * 1024), 2) AS free_space_mb FROM dba_free_space";
$result_free_space = oci_parse($conn, $query_free_space);
if (oci_execute($result_free_space)) {
    $row = oci_fetch_assoc($result_free_space);
    $performance_data['Free Space (MB)'] = $row ? $row['free_space_mb'] : 0;
} else {
    $performance_data['Free Space (MB)'] = 'Error: No se pudo obtener datos - ' . oci_error($result_free_space)['message'];
}

oci_close($conn); // Cerrar la conexión al final
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendimiento de la Base de Datos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container mt-5">
        <h1 class="text-center mb-4">Rendimiento de la Base de Datos</h1>
        <div class="row">
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Sesiones Activas</h5>
                        <p class="card-text"><?php echo $performance_data['Active Sessions']; ?></p>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Tamaño de la Base de Datos (MB)</h5>
                        <p class="card-text"><?php echo $performance_data['Database Size (MB)']; ?></p>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Uso de CPU</h5>
                        <p class="card-text"><?php echo $performance_data['CPU Usage']; ?></p>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Total de Sesiones</h5>
                        <p class="card-text"><?php echo $performance_data['Total Sessions']; ?></p>
                    </div>
                </div>
            </div>

            <div class="col-md-6 mb-3">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">Espacio Libre (MB)</h5>
                        <p class="card-text"><?php echo $performance_data['Free Space (MB)']; ?></p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón de regreso -->
        <div class="text-center mt-4">
            <a href="../index.php" class="btn btn-primary">Regresar</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
