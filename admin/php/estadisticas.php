<?php
include('../../procesos/connect.php');

// Inicializar el arreglo de estadísticas
$stats = [
    'database_size_mb' => 'No disponible',
    'num_files' => 'No disponible',
    'temp_space_mb' => 'No disponible',
];

// Consulta para obtener estadísticas de la base de datos
$query = "
    SELECT 
        (SELECT ROUND(SUM(bytes) / 1024 / 1024) FROM dba_data_files) AS database_size_mb,
        (SELECT COUNT(*) FROM dba_data_files) AS num_files,
        (SELECT ROUND(SUM(bytes) / 1024 / 1024) FROM user_temp_tablespaces) AS temp_space_mb
    FROM dual";

$result = oci_parse($conn, $query);
if (oci_execute($result)) {
    $stats = oci_fetch_assoc($result);
} else {
    // Manejar error de ejecución de consulta
    echo "<script>console.error('Error en la ejecución de la consulta: " . oci_error($result)['message'] . "');</script>";
}

// Cerrar la conexión al final
oci_close($conn);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadísticas de Base de Datos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Estilos personalizados -->
    <style>
        .card-custom {
            height: 100%; /* Ajusta el tamaño de la card para que ocupe toda la altura disponible */
        }
    </style>
</head>
<body class="bg-light">
    <div class="container mt-5">
        <h1 class="text-center mb-4">Estadísticas de Base de Datos</h1>
        <div class="row">
            <div class="col-md-12 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h5 class="card-title">Datos de Estadísticas</h5>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <strong>Tamaño de la Base de Datos (MB):</strong> 
                                <?php echo htmlspecialchars($stats['database_size_mb'] ?? 'No disponible'); ?>
                            </li>
                            <li class="list-group-item">
                                <strong>Número de Archivos de Datos:</strong> 
                                <?php echo htmlspecialchars($stats['num_files'] ?? 'No disponible'); ?>
                            </li>
                            <li class="list-group-item">
                                <strong>Espacio Temporal (MB):</strong> 
                                <?php echo htmlspecialchars($stats['temp_space_mb'] ?? 'No disponible'); ?>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Botón de volver -->
        <div class="text-start mt-3">
            <a href="tunning_consultas.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
