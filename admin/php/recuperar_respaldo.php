<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $backupFile = $_POST['backup_file'];
    
    // Comando para restaurar desde un archivo de respaldo
    $command = "mysql -u usuario -p contraseña < /path/$backupFile";

    system($command, $output);

    if ($output === 0) {
        echo "<script>swal('Éxito', 'Base de datos restaurada con éxito.', 'success');</script>";
    } else {
        echo "<script>swal('Error', 'Error al restaurar la base de datos.', 'error');</script>";
    }
}
?>

<!-- Formulario para seleccionar el archivo de respaldo -->
<form method="post" action="">
    <label for="backup_file">Seleccionar archivo de respaldo:</label>
    <input type="text" id="backup_file" name="backup_file" required>
    <button type="submit" class="btn btn-primary">Recuperar</button>
</form>
