<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
      
    <link href="../css/style.css" rel="stylesheet">
    <script src="js/main.js"></script>
    <title>KYC Living</title>
    <style>
        .contenedor {
            width: 90%;
        }

        .form {
            max-width: 25rem;
        }

        .navegacion {
            color: #000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .navegacion p,
        .navegacion a {
            display: flex;
            align-items: center;
            margin-right: 20px;
            /* Añade espacio entre los elementos */
            left-right: 20px;
            /* Añade espacio entre los elementos */
            color: #000;
            /* Cambia el color del texto si es necesario */
        }

        .navegacion a img {
            margin-right: 5px;
            /* Añade espacio entre el ícono y el texto */
            margin-left: 5px;
        }

        .contenedor-inicio-sesion p {
            margin-left: 10px;
            /* Añade espacio entre el ícono y el texto */
            color: #ffffff;
            /* Cambia el color de los títulos */
            font-weight: bold;
            /* Hace que el texto esté siempre en negrita */
        }

        /* Ajusta el tamaño de los iconos */
        .competicion-titulo img {
            width: 100px;
            /* Ajusta el tamaño del icono según tus necesidades */
            height: auto;
            /* Mantiene la proporción del icono */
        }

        /* Añade espacio entre las cards y el footer */
        .competiciones {
            margin-bottom: 50px;
            /* Ajusta este valor según tus necesidades */
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
        footer p{
            color: white;
        }

        .back-button {
            display: block;
            margin-top: 10px;
            text-align: center;
            text-decoration: none;
            color: #0056b3; /* Cambiado a azul */
        }
        /* Estilo para el enlace de volver */
    a.back-button {
    color: #2789f1; /* Color del texto */
    text-decoration: none; /* Quitar subrayado */
    font-size: 2rem; /* Tamaño de fuente */
    transition: color 0.3s ease, text-decoration 0.3s ease; /* Transición suave al pasar el ratón */
    }

    </style>
</head>

<body>
    <header class="header">
        <nav class="navegacion">
            <a class="dispNone a" href="iniciarSesion.php">
                <div class="contenedor-inicio-sesion">
                </div>
            </a>
            <a class="dispNone a" href="iniciarSesion.php">
                <div class="contenedor-inicio-sesion">
                    <p>Tunning</p>
                    
                </div>
            </a>
            <div class="dropdown">
                <a class="menu" href="#"><img src="/imagenes/menublanco.png" alt="icono de menus"></a>
                <div class="dropdown-content" id="dropdownContent">
                    <a href="tablaPosiciones.php">Tabla de Posiciones</a>
                    <a href="iniciarSesion.php">
                    </a>
                </div>
            </div>
        </nav>
    </header>
    <main class="contenedor main" style="margin-top: 65px" style="margin-botton: 65px">

        <h1 id="torneos" class="titulo">Tunning de Consultas</h1>
        <section class="competiciones">
            <a href="planes_ejecucion.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="../imagenes/ejecucion.png" alt="Icono 1">
                        <h3>Planes de Ejecución</h3>
                    </div>
                </article>
            </a>
            <a href="indices.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="../imagenes/indices.png" alt="Icono 1">
                        <h3>Índices</h3>
                    </div>
                </article>
            </a>
            <a href="estadisticas.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="../imagenes/estadisticas.png" alt="Icono 1">
                        <h3>Estadísticas</h3>
                    </div>
                </article>
            </a>
            
        </section>
        <!-- Enlace para volver -->
        <a href="../menu_principal.php" class="back-button">Volver</a>
    </main>
</body>

</html>