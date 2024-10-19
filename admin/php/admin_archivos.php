<?php
// Directorio por defecto
$selected_dir = isset($_POST['directory']) ? $_POST['directory'] : 'C:\\ORACLE_FILES\\HD1';

// Obtener los archivos del directorio seleccionado
$files = scandir($selected_dir);

// Filtrar solo los archivos SQL
$backup_files = array_filter($files, function ($file) use ($selected_dir) {
    return is_file($selected_dir . DIRECTORY_SEPARATOR . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'sql';
});

// Borrar archivo si el formulario de eliminación se envió
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['filename']) && isset($_POST['delete'])) {

    $filename = $_POST['filename'];
    $full_path = $selected_dir . DIRECTORY_SEPARATOR . $filename;

    if (file_exists($full_path)) {
        unlink($full_path); // Elimina el archivo
        $msg = "Archivo eliminado exitosamente.";
    } else {
        $msg = "El archivo no existe.";
    }
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración de Archivos de Respaldo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script> <!-- SweetAlert para los mensajes -->
    <style>
        .fixed-size {
            max-height: 400px;
            overflow-y: scroll;
        }

        .card-custom {
            height: 100%;
        }

        .spinner-container {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
        }

        @media (max-width: 767.98px) {
            .fixed-size {
                max-height: 300px;
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
            <!-- Columna del formulario para seleccionar directorio -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Seleccionar Directorio</h1>

                        <form method="post" action="">
                            <div class="mb-3">
                                <label for="directory" class="form-label">Directorio:</label>
                                <select id="directory" name="directory" class="form-select"
                                    onchange="this.form.submit()">
                                    <option value="C:\ORACLE_FILES\HD1" <?php if ($selected_dir == 'C:\ORACLE_FILES\HD1')
                                        echo 'selected'; ?>>C:\ORACLE_FILES\HD1</option>
                                    <option value="C:\ORACLE_FILES\HD2" <?php if ($selected_dir == 'C:\ORACLE_FILES\HD2')
                                        echo 'selected'; ?>>C:\ORACLE_FILES\HD2</option>
                                    <option value="C:\ORACLE_FILES\HD3" <?php if ($selected_dir == 'C:\ORACLE_FILES\HD3')
                                        echo 'selected'; ?>>C:\ORACLE_FILES\HD3</option>
                                </select>
                            </div>
                        </form>
                        <?php if (isset($msg)): ?>
                            <script>
                                swal("Resultado", "<?php echo $msg; ?>", "<?php echo (strpos($msg, 'exitosamente') !== false) ? 'success' : 'error'; ?>");
                            </script>
                        <?php endif; ?>

                        <form method="post" action="" onsubmit="showSpinner()">
                            <!-- Mantener el directorio seleccionado -->
                            <input type="hidden" name="directory"
                                value="<?php echo htmlspecialchars($selected_dir); ?>">

                            <div class="mb-3">
                                <label for="filename" class="form-label">Nombre del Archivo a Eliminar:</label>
                                <input type="text" id="filename" name="filename" class="form-control"
                                    placeholder="Ejemplo: respaldo.sql" required>
                            </div>

                            <div class="d-grid">
                                <input type="submit" name="delete" class="btn btn-danger" value="Eliminar Archivo">
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Columna de la tabla con los archivos disponibles -->
            <div class="col-md-6 mb-3">
                <div class="card shadow-sm card-custom">
                    <div class="card-body">
                        <h1 class="card-title text-center mb-4">Archivos de Respaldo</h1>
                        <div class="fixed-size">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre del Archivo</th>
                                        <th>Tamaño</th>
                                        <th>Fecha de Creación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($backup_files)): ?>
                                        <tr>
                                            <td colspan="3" class="text-center">No se encontraron archivos de respaldo.</td>
                                        </tr>
                                    <?php else: ?>
                                        <?php foreach ($backup_files as $file): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($file); ?></td>
                                                <td><?php echo round(filesize($selected_dir . DIRECTORY_SEPARATOR . $file) / 1024, 2) . ' KB'; ?>
                                                </td>
                                                <td><?php echo date('Y-m-d H:i:s', filemtime($selected_dir . DIRECTORY_SEPARATOR . $file)); ?>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="text-start mt-3">
            <a href="respaldos.php" class="btn btn-secondary">Volver</a>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        function showSpinner() {
            document.getElementById('spinner').style.display = 'block';
        }
    </script>
</body>

</html>