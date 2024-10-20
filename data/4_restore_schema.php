<?php
include 'connect.php'; // Incluye el archivo de conexión

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $schema = $_POST['schema'];
    $directory = $_POST['directory'];
    $dumpfile = $_POST['dumpfile'];
    $logfile = $_POST['logfile'];

    $command = "impdp $schema/$db_password schemas=$schema directory=$directory dumpfile=$dumpfile logfile=$logfile";
    $output = shell_exec($command);
    echo "Restauración de esquema completada.<br>";
    echo $output;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Restaurar Esquema</title>
</head>
<body>
    <h1>Restaurar Esquema</h1>
    <form method="post" action="">
        <label for="schema">Esquema:</label>
        <input type="text" id="schema" name="schema" required><br><br>
        <label for="directory">Directorio:</label>
        <input type="text" id="directory" name="directory" required><br><br>
        <label for="dumpfile">Nombre del archivo de volcado:</label>
        <input type="text" id="dumpfile" name="dumpfile" required><br><br>
        <label for="logfile">Nombre del archivo de log:</label>
        <input type="text" id="logfile" name="logfile" required><br><br>
        <input type="submit" value="Restaurar Esquema">
    </form>
</body>
</html>
