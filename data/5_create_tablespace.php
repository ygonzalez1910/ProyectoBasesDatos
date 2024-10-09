<?php
include 'connect.php'; // Incluye el archivo de conexión

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $tablespaceName = $_POST['tablespaceName'];
    $datafile = $_POST['datafile'];
    $size = $_POST['size'];

    $sql = "CREATE TABLESPACE $tablespaceName DATAFILE '$datafile' SIZE $size";
    $stmt = oci_parse($conn, $sql);
    oci_execute($stmt);
    echo "Tablespace '$tablespaceName' creado con éxito.<br>";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Crear Tablespace</title>
</head>
<body>
    <h1>Crear Tablespace</h1>
    <form method="post" action="">
        <label for="tablespaceName">Nombre del Tablespace:</label>
        <input type="text" id="tablespaceName" name="tablespaceName" required><br><br>
        <label for="datafile">Nombre del Archivo de Datos:</label>
        <input type="text" id="datafile" name="datafile" required><br><br>
        <label for="size">Tamaño:</label>
        <input type="text" id="size" name="size" required><br><br>
        <input type="submit" value="Crear Tablespace">
    </form>
</body>
</html>
