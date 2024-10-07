<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Liga de Campeones de la UEFA">
    <meta name="keywords" content="UEFA">
    <meta name="robots" content="index" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;500;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <script src="js/main.js"></script>
    <style>
        .contenedor {
            width: 90%;
            margin: 0 auto;
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

        .navegacion p, .navegacion a {
            display: flex;
            align-items: center;
            margin-right: 20px;
            color: #000;
        }

        .navegacion a img {
            margin-right: 5px;
            margin-left: 5px; 
        }
        .contenedor-inicio-sesion p {
            margin-left: 10px;
            color: #ffffff;
            font-weight: bold;
        }

        .competicion-titulo img {
            width: 100px;
            height: auto;
        }

        .competiciones {
            margin-bottom: 100px;
            display: grid;
            grid-template-columns: repeat(3, 1fr); /* Tres columnas por fila */
            gap: 20px;
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
        footer p {
            color: white;
        }
        .competicion {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            transition: box-shadow 0.3s ease;
        }
        .competicion:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .competicion-titulo {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .competicion-titulo h3 {
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <header class="header">
        <nav class="navegacion">
            <a class="dispNone a" href="iniciarSesion.php">
                <div class="contenedor-inicio-sesion"></div>
            </a>
            <a class="dispNone a" href="iniciarSesion.php">
                <div class="contenedor-inicio-sesion">
                    <p>¡Bienvenido, Administrador!</p>
                </div>
            </a>        
            <div class="dropdown">
                <a class="menu" href="#"><img src="/imagenes/menublanco.png" alt="icono de menus"></a>
                <div class="dropdown-content" id="dropdownContent">
                    <a href="tablaPosiciones.php">Tabla de Posiciones</a>
                    <a href="iniciarSesion.php">
                        <div class="contenedor-inicio-sesion"></div>
                    </a>
                </div>
            </div>
        </nav>
    </header>
    <main class="contenedor main" style="margin-top: 65px; margin-bottom: 65px">
        <h1 id="torneos" class="titulo">Configuracion</h1>
        <section class="competiciones">
            <a href="php/respaldos.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="imagenes/respado.png" alt="Icono 1">
                        <h3>Respaldos</h3>
                    </div>
                </article>
            </a>
            <a href="php/administracion_tablespaces.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="imagenes/tablespaces.png" alt="Icono 1">
                        <h3>Administración de Tablespaces</h3>
                    </div>
                </article>
            </a>
            <a href="php/tunning_consultas.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="imagenes/tunning.png" alt="Icono 1">
                        <h3>Tunning de Consultas</h3>
                    </div>
                </article>
            </a>
            <a href="php/performance_bases.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="imagenes/performance.png" alt="Icono 1">
                        <h3>Performance de la Base de Datos</h3>
                    </div>
                </article>
            </a>
            <a href="php/auditoria.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="imagenes/auditoria.png" alt="Icono 1">
                        <h3>Auditoria de la Base de Datos</h3>
                    </div>
                </article>
            </a>
            <a href="php/seguridad_usuarios.php">
                <article class="competicion">
                    <div class="competicion-titulo">
                        <img src="imagenes/segurdiad.png" alt="Icono 1">
                        <h3> Seguridad de Usuarios</h3>
                    </div>
                </article>
            </a>
        </section>
    </main>
    <div class="respuestaForm"></div>
</body>
</html>
