<?php
include 'connect.php'; // Incluye el archivo de conexión

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $directory = $_POST['directory'];
    $dumpfile = $_POST['dumpfile'];
    $logfile = $_POST['logfile'];

    $command = "expdp $db_username/$db_password full=y directory=$directory dumpfile=$dumpfile logfile=$logfile";
    $output = shell_exec($command);
    echo "Respaldo completo completado.<br>";
    echo $output;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respaldo Completo</title>
</head>
<body>
    <h1>Respaldo Completo</h1>
    <form method="post" action="">
        <label for="directory">Directorio:</label>
        <input type="text" id="directory" name="directory" required><br><br>
        <label for="dumpfile">Nombre del archivo de volcado:</label>
        <input type="text" id="dumpfile" name="dumpfile" required><br><br>
        <label for="logfile">Nombre del archivo de log:</label>
        <input type="text" id="logfile" name="logfile" required><br><br>
        <input type="submit" value="Respaldar Completo">
    </form>
</body>
</html>
