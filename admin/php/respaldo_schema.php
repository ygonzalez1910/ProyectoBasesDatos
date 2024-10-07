<?php

// Conexión a la base de datos
include('conexion.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $schema = $_POST['schema'];
    
    // Comando para generar un respaldo del schema
    $command = "mysqldump -u usuario -p contraseña --databases $schema > /path/respaldo_$schema.sql";

    // Ejecutar el comando
    system($command, $output);

    if ($output === 0) {
        echo "<script>swal('Éxito', 'Respaldo creado con éxito.', 'success');</script>";
    } else {
        echo "<script>swal('Error', 'Hubo un problema al crear el respaldo.', 'error');</script>";
    }
}
?>

<!-- Formulario para seleccionar el schema -->
<form method="post" action="">
    <label for="schema">Seleccionar Schema:</label>
    <input type="text" id="schema" name="schema" required>
    <button type="submit" class="btn btn-primary">Crear Respaldo</button>
</form>
