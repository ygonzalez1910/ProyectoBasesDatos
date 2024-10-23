<?php
include('../../procesos/connect.php');

// Consulta para obtener los planes de ejecución
$execution_plans = [];
$query = "SELECT * FROM table(dbms_xplan.display_cursor(null, null, 'ALL'))"; // Esta consulta puede cambiar según tus necesidades
$result = oci_parse($conn, $query);
oci_execute($result);

while ($row = oci_fetch_assoc($result)) {
    $execution_plans[] = $row;
}

oci_close($conn); // Cerrar la conexión al final
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planes de Ejecución</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Estilos personalizados -->
    <style>
        .fixed-size {
            max-height: 400px; /* Altura máxima del contenedor con scroll */
            overflow-y: scroll;
        }

        .card-custom {
            height: 100%; /* Ajusta el tamaño de la card para que ocupe toda la altura disponible */
        }
    </style>
</head>
<body class="bg-light">
    <div class="container mt-5">
        <h1 class="text-center mb-4">Planes de Ejecución</h1>
        <div class="row">
            <div class="col-md-12 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h5 class="card-title">Planes de Ejecución de Consultas</h5>
                        <div class="fixed-size"> <!-- Contenedor con scroll -->
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Operación</th>
                                        <th>Nombre</th>
                                        <th>Coste</th>
                                        <th>Filas</th>
                                        <th>Bytes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($execution_plans as $plan): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($plan['OPERATION']); ?></td>
                                            <td><?php echo htmlspecialchars($plan['NAME']); ?></td>
                                            <td><?php echo htmlspecialchars($plan['COST']); ?></td>
                                            <td><?php echo htmlspecialchars($plan['ROWS']); ?></td>
                                            <td><?php echo htmlspecialchars($plan['BYTES']); ?></td>
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
            <a href="tunning_consultas.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
