<?php
// Iniciar la sesión si no está iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Verificar si el usuario está autenticado
if (!isset($_SESSION['verificar'])) {
    header("Location: ../index.php");
    exit;
}

// Incluir el archivo de conexión
require_once "../php/connect.php";

// Obtener los datos del formulario
$nombre = $_POST['nombre'];
$telefono = $_POST['telefono'];
$email = $_POST['email'];
$clave = $_POST['clave'];

// Preparar la consulta para insertar los datos
$query = "INSERT INTO usuario (nombre, telefono, email, clave) VALUES (:nombre, :telefono, :email, :clave)";

// Preparar la sentencia
$stid = oci_parse($conn, $query);

// Vincular los parámetros
oci_bind_by_name($stid, ':nombre', $nombre);
oci_bind_by_name($stid, ':telefono', $telefono);
oci_bind_by_name($stid, ':email', $email);
oci_bind_by_name($stid, ':clave', $clave);

// Ejecutar la sentencia
$result = oci_execute($stid);

// Verificar si la inserción fue exitosa
if ($result) {
    echo "Datos guardados exitosamente.";
    header("Location: ../index.php");
} else {
    $e = oci_error($stid);
    echo "Error al guardar los datos: " . $e['message'];
}

// Liberar los recursos
oci_free_statement($stid);
oci_close($conn);
?>
