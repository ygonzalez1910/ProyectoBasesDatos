<?php

error_reporting(E_ALL & ~E_WARNING);

$db_username = 'SYSTEM';
$db_password = 'root';
$db_connection_string = 'localhost/XE'; // Cambia según tu configuración

// Crear la conexión
$conn = oci_connect($db_username, $db_password, $db_connection_string);

// Verificar si la conexión fue exitosa
if (!$conn) {
    $e = oci_error();
    echo '<script> console.log("Error de conexión a Oracle: ' . $e['message'] . '"); </script>';
    exit;
} else {
    echo '<script> console.log("Conexión exitosa a Oracle!"); </script>';
}
?>
