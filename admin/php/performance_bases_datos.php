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
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <title>Sistema de Administración de Bases de Datos - Performance</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e9ecef; /* Color de fondo */
            margin: 0;
            padding: 0;
        }

        header {
            background: linear-gradient(to right, #001b44, #0056b3);
            padding: 1rem;
            text-align: left;
            color: white;
            font-size: 1.5rem;
        }

        .table-container {
            width: 50%; /* Ajustar el ancho de la tabla */
            margin: 2rem auto;
            background-color: #ffffff; /* Color de fondo blanco */
            border-radius: 8px;
            overflow: hidden;
            padding: 1rem; /* Añadir padding para que la tabla no esté pegada a los bordes */
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4); /* Efecto de sombra más pronunciado */
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0; /* Añadir margen superior e inferior para separar del contenedor */
        }

        th, td {
            padding: 0.75rem; /* Reducir el padding para hacer la tabla más compacta */
            text-align: left;
        }

        th {
            background-color: #0056b3;
            color: white;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #e0e0e0; /* Color de fondo al pasar el cursor */
            transition: background-color 0.3s ease; /* Transición suave */
        }

        button {
            background-color: #0056b3;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        button:hover {
            background-color: #003d80;
        }

        footer {
            background: linear-gradient(to right, #001b44, #0056b3);
            padding: 1rem;
            text-align: center;
            color: white;
            position: fixed;
            width: 100%;
            bottom: 0;
        }

        /* Estilo para enlaces */
        a {
            color: #000; /* Color del enlace */
            text-decoration: none; /* Sin subrayado */
        }

        /* Mantener el mismo color para los enlaces visitados */
        a:visited {
            color: #000;
        }

        /* Mantener el mismo color cuando el ratón pasa sobre el enlace */
        a:hover {
            color: #000;
            text-decoration: underline; /* Subrayado opcional al pasar el ratón */
        }

        /* Mantener el mismo color cuando el enlace está activo (clicado) */
        a:active {
            color: #000;
        }

        .blur-background {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Color de fondo semitransparente */
            backdrop-filter: blur(5px); /* Desenfoque */
            z-index: 1; /* Asegurar que esté por encima de otros elementos */
            display: none; /* Ocultar inicialmente */
        }

        /* Estilo para el modal */
        #modal {
            border: 2px solid white; /* Borde blanco */
        }

        .table-container {
            margin-bottom: 10vh;
        }

        .center-button {
            display: flex;
            justify-content: center;
            margin-top: 20px; /* Margen superior para separar del contenido */
        }

        /* Estilo para el enlace de volver */
        a.back-button {
            color: #2789f1; /* Color del texto */
            text-decoration: none; /* Quitar subrayado */
            font-size: 1rem; /* Tamaño de fuente */
            transition: color 0.3s ease, text-decoration 0.3s ease; /* Transición suave al pasar el ratón */
        } 
    </style>
</head>

<body>
    
    <header>Sistema de Administración de Bases de Datos - Performance</header>

    <div class="table-container">
        
        <div class="center-button">
            <a href="../menu_principal.php" class="back-button">Volver</a>
        </div>
    </div>

    <footer class="footer">
        <p>&copy;2024 KYC Living. Todos los derechos reservados.</p>
    </footer>
</body>

</html>
