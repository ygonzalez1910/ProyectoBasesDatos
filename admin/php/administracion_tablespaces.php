<?php
include('../../procesos/connect.php');

// Consulta para obtener los tablespaces
$tablespaces = [];
$query = "
    SELECT
        ts.tablespace_name,    
        ts.status,
        ts.contents,
        ROUND(SUM(df.bytes) / 1024 / 1024) AS total_size_mb,
        ROUND(SUM(df.bytes) / 1024 / 1024) - ROUND(SUM(f.bytes) / 1024 / 1024) AS used_size_mb
    FROM
        dba_tablespaces ts
    JOIN
        dba_data_files df ON ts.tablespace_name = df.tablespace_name
    JOIN
        (SELECT tablespace_name, SUM(bytes) AS bytes FROM dba_free_space GROUP BY tablespace_name) f
    ON ts.tablespace_name = f.tablespace_name
    GROUP BY
        ts.tablespace_name, ts.status, ts.contents
";
$result = oci_parse($conn, $query);
oci_execute($result);

while ($row = oci_fetch_assoc($result)) {
    $tablespaces[] = $row;
}

// Procesamiento del formulario según la acción seleccionada
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];
    $tablespace = $_POST['tablespace'];

    // Aquí puedes agregar la lógica para cambiar tamaño, eliminar o poner offline el tablespace.
    // Por ejemplo, un comando para cambiar tamaño podría ser:
    if ($action === 'change_size') {
        // Lógica para cambiar tamaño del tablespace
        // $new_size = $_POST['new_size'];
        // ejecutar comando para cambiar tamaño
        echo "<script>swal('Éxito', 'Tamaño del tablespace actualizado.', 'success');</script>";
    } elseif ($action === 'delete') {
        // Lógica para eliminar el tablespace
        echo "<script>swal('Éxito', 'Tablespace eliminado.', 'success');</script>";
    } elseif ($action === 'offline') {
        // Lógica para poner el tablespace offline
        echo "<script>swal('Éxito', 'Tablespace puesto offline.', 'success');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración de Tablespaces</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> <!-- SweetAlert para los mensajes -->

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
                        <h1 class="card-title text-center mb-4">Administrar Tablespaces</h1>
                        <form method="post" action="" onsubmit="showSpinner()">
                            <div class="mb-3">
                                <label for="tablespace" class="form-label">Seleccionar Tablespace:</label>
                                <select id="tablespace" name="tablespace" class="form-select" required>
                                    <option value="">Seleccione un tablespace</option>
                                    <?php foreach ($tablespaces as $ts): ?>
                                        <option value="<?php echo htmlspecialchars($ts['TABLESPACE_NAME']); ?>"><?php echo htmlspecialchars($ts['TABLESPACE_NAME']); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="action" class="form-label">Acción:</label>
                                <select id="action" name="action" class="form-select" required onchange="showActionFields(this.value)">
                                    <option value="">Seleccione una acción</option>
                                    <option value="change_size">Cambiar tamaño</option>
                                    <option value="delete">Eliminar</option>
                                    <option value="offline">Poner offline</option>
                                </select>
                            </div>

                            <div id="change_size_fields" style="display: none;">
                                <div class="mb-3">
                                    <label for="new_size" class="form-label">Nuevo Tamaño (MB):</label>
                                    <input type="number" id="new_size" name="new_size" class="form-control" placeholder="Ejemplo: 500" required>
                                </div>
                            </div>

                            <div class="d-grid">
                                <input type="submit" class="btn btn-primary" value="Ejecutar">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Columna de la tabla con los tablespaces -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Tablespaces Disponibles</h1>
                        <div class="fixed-size"> <!-- Contenedor con scroll -->
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Contenido</th>
                                        <th>Tamaño Total (MB)</th>
                                        <th>Tamaño Usado (MB)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($tablespaces as $ts): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($ts['TABLESPACE_NAME']); ?></td>
                                            <td><?php echo htmlspecialchars($ts['STATUS']); ?></td>
                                            <td><?php echo htmlspecialchars($ts['CONTENTS']); ?></td>
                                            <td><?php echo htmlspecialchars($ts['TOTAL_SIZE_MB']); ?></td>
                                            <td><?php echo htmlspecialchars($ts['USED_SIZE_MB']); ?></td>
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
            <a href="../index.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        function showSpinner() {
            document.getElementById('spinner').style.display = 'block'; // Muestra el spinner
        }

        function showActionFields(action) {
            document.getElementById('change_size_fields').style.display = action === 'change_size' ? 'block' : 'none';
        }
    </script>
</body>
</html>
