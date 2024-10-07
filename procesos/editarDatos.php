<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Resultado de Actualización</title>
    <link rel="stylesheet" type="text/css" href="editarDatos.css">
</head>
<body>
    <section>
        <div class="form-box">
            <?php
            require_once "../php/connect.php";
            $id = $_POST['id'];
            $nombre = $_POST['nombre'];
            $apellido = $_POST['apellido'];
            $email = $_POST['email'];
            $clave1 = $_POST['clave1'];
            $clave2 = $_POST['clave2'];
            $clave3 = $_POST['clave3'];

            if ($clave1 != "" && $clave2 != "" && $clave3 != "") {
                $cons = "SELECT * FROM usuario WHERE id = :id";
                $stid = oci_parse($conn, $cons);
                oci_bind_by_name($stid, ':id', $id);
                oci_execute($stid);
                $fila = oci_fetch_array($stid, OCI_ASSOC);
                $claveOriginal = $clave1;
                if ($claveOriginal == $fila['CLAVE']) {
                    if ($clave2 == $clave3) {
                        $clave = $clave2;
                        $campos = "NOMBRE = :nombre, APELLIDO = :apellido, EMAIL = :email, CLAVE = :clave";
                    } else {
                        echo '<p class="mensaje-error">Las claves no coinciden</p>';
                        echo '<button id="btn-reintentar" onclick="history.back()">Volver a intentar</button>';
                        exit();
                    }
                } else {
                    echo '<p class="mensaje-error">La clave es incorrecta</p>';
                    echo '<button id="btn-reintentar" onclick="history.back()">Volver a intentar</button>';
                    exit();
                }
            } else {
                $campos = "NOMBRE = :nombre, APELLIDO = :apellido, EMAIL = :email";
            }

            $query = "UPDATE usuario SET $campos WHERE id = :id";
            $stid = oci_parse($conn, $query);
            oci_bind_by_name($stid, ':id', $id);
            oci_bind_by_name($stid, ':nombre', $nombre);
            oci_bind_by_name($stid, ':apellido', $apellido);
            oci_bind_by_name($stid, ':email', $email);
            if (isset($clave)) {
                oci_bind_by_name($stid, ':clave', $clave);
            }

            $result = oci_execute($stid);

            if ($result) {
                echo '<p class="mensaje-exito">Datos actualizados</p>';
            } else {
                $e = oci_error($stid);
                echo '<p class="mensaje-error">No se pudo actualizar los datos: ' . $e['message'] . '</p>';
                echo '<button id="btn-reintentar" onclick="history.back()">Volver a intentar</button>';
            }

            oci_free_statement($stid);
            oci_close($conn);
            ?>
        </div>
    </section>
</body>
</html>
