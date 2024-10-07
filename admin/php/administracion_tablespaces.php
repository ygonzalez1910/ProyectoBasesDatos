<?php
session_start();
if (!$_SESSION['verificar']) {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Administración de Bases de Datos - Administración de Tablespaces</title>
    <link rel="stylesheet" href="../css/gestion_filiales.css"> <!-- Enlace al archivo CSS -->
</head>

<body>
    <header>Gestión de Filiales</header>

    <div class="table-container">
        
        <!-- Enlace para volver -->
        <div class="center-button">
            <a href="../menu_principal.php" class="back-button">Volver</a>
        </div>
    </div>

    <!-- Capa de fondo desenfocado -->
    <div class="blur-background" id="blur-background"></div>

    <dialog id="modal">
        <div id="modal-content">
            <!-- Aqui va el contenido del modal -->
        </div>
        <form method="dialog">
            <button>OK</button>
        </form>
    </dialog>

    <script src="../js/get_dueno.js"></script>

    <footer class="footer">
        <p>&copy;2024 KYC Living. Todos los derechos reservados.</p>
    </footer>
</body>

</html>