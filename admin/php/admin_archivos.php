<?php
// Directorio donde se almacenan los archivos de respaldo
$backup_dir = 'respaldos/';

// Obtener todos los archivos del directorio
$files = scandir($backup_dir);

// Filtrar solo los archivos SQL
$backup_files = array_filter($files, function($file) use ($backup_dir) {
    return is_file($backup_dir . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'sql';
});
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración de Archivos de Respaldo</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1 class="mt-4">Administración de Archivos de Respaldo</h1>
        <table class="table table-striped mt-4">
            <thead>
                <tr>
                    <th>Nombre del Archivo</th>
                    <th>Tamaño</th>
                    <th>Fecha de Creación</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($backup_files)): ?>
                    <tr>
                        <td colspan="4" class="text-center">No se encontraron archivos de respaldo.</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($backup_files as $file): ?>
                        <tr>
                            <td><?php echo $file; ?></td>
                            <td><?php echo round(filesize($backup_dir . $file) / 1024, 2) . ' KB'; ?></td>
                            <td><?php echo date('Y-m-d H:i:s', filemtime($backup_dir . $file)); ?></td>
                            <td>
                                <!-- Botón para descargar el archivo -->
                                <a href="descargar_respaldo.php?file=<?php echo urlencode($file); ?>" class="btn btn-success btn-sm">Descargar</a>

                                <!-- Botón para eliminar el archivo -->
                                <a href="eliminar_respaldo.php?file=<?php echo urlencode($file); ?>" class="btn btn-danger btn-sm" onclick="return confirm('¿Estás seguro de eliminar este archivo?')">Eliminar</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html>
