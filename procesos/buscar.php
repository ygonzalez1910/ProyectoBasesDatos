<?php
    session_start();
    if(!$_SESSION['verificar']){
        header("Location: index.php");
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Once</title>
    <link rel="stylesheet" type="text/css" href="buscar.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css">
</head>
<body>
	<div class ="form-box">
		
        <?php
            if(isset($_POST['palabra'])) {
                $palabra = $_POST['palabra'];
                require_once "php/connect.php";
                $query = "SELECT * FROM usuario WHERE Nombre LIKE '%$palabra%'";
                $consulta3 = $mysqli->query($query);
                if($consulta3->num_rows >= 1) {
                    echo "<table>
                        <thead>
                            <tr>
                                <th>id</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Actualizar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>";
                    while($fila = $consulta3->fetch_array(MYSQLI_ASSOC)) {
                        echo "<tr>
                            <td>".$fila['Id']."</td>
                            <td>".$fila['Nombre']."</td>
                            <td>".$fila['Apellido']."</td>
                            <td>".$fila['Email']."</td>
                            <td><a href='#!'>Actualizar</a></td>
                            <td><a href='#!'>Eliminar</a></td>
                        </tr>";
                    }
                    echo "</tbody>
                    </table>";
                    echo '<a href="../buscador.php" class="busqueda-button">Regresar a Buscador</a>'; // Enlace dentro del bloque PHP
                } else {
                    echo "No hemos encontrado ningún registro con la palabra ".$palabra;
                }
            }
        ?>
	</div>
</body>
</html>
