<?php
include('../../procesos/connect.php');

// Consulta para obtener los índices
$indexes = [];
$query = "SELECT owner, index_name, table_name, uniqueness FROM all_indexes ORDER BY owner, index_name";
$result = oci_parse($conn, $query);
oci_execute($result);

while ($row = oci_fetch_assoc($result)) {
    $indexes[] = $row;
}

oci_close($conn); // Cerrar la conexión al final
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Índices de Base de Datos</title>
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
        <h1 class="text-center mb-4">Índices de Base de Datos</h1>
        <div class="row">
            <div class="col-md-12 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h5 class="card-title">Lista de Índices</h5>
                        <div class="fixed-size"> <!-- Contenedor con scroll -->
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Propietario</th>
                                        <th>Nombre del Índice</th>
                                        <th>Tabla Asociada</th>
                                        <th>Unicidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($indexes as $index): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($index['OWNER']); ?></td>
                                            <td><?php echo htmlspecialchars($index['INDEX_NAME']); ?></td>
                                            <td><?php echo htmlspecialchars($index['TABLE_NAME']); ?></td>
                                            <td><?php echo htmlspecialchars($index['UNIQUE'] == 'Y' ? 'Único' : 'No Único'); ?></td>
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
