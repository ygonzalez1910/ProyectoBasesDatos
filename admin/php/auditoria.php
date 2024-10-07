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
    <title>Sistema de Administración de Bases de Datos - Auditoría</title>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Estilo del fondo con gradiente lineal */
        .background-radial-gradient {
            background-color: hsl(218, 41%, 15%);
            background-image: radial-gradient(650px circle at 0% 0%,
                    hsl(218, 61%, 55%) 15%,
                    hsl(218, 51%, 40%) 35%,
                    hsl(218, 51%, 30%) 75%,
                    hsl(218, 51%, 29%) 80%,
                    transparent 100%),
                radial-gradient(1250px circle at 100% 100%,
                    hsl(218, 61%, 55%) 15%,
                    hsl(218, 51%, 40%) 35%,
                    hsl(218, 51%, 30%) 75%,
                    hsl(218, 51%, 29%) 80%,
                    transparent 100%);
        }

        .background-radial-gradient .bg-image {
            height: 300px;
            /* Cambio al gradiente lineal azul */
            background: linear-gradient(to right, #001b44, #0056b3);
        }

        /* Resto de estilos mantenidos */
        .card {
            margin-top: -200px;
            backdrop-filter: blur(30px);
        }

        .form-outline {
            position: relative;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
        }

        .form-outline .icon-container {
            flex: 0 0 auto;
            margin-right: 15px;
            display: flex;
            align-items: center;
            pointer-events: none;
            color: #6c757d;
        }

        .form-outline label {
            flex: 0 0 100px;
            margin-right: 10px;
            text-align: left;
        }

        .form-outline input {
            flex: 1 1 auto;
        }

        .back-button {
            display: block;
            margin-top: 10px;
            text-align: center;
            text-decoration: none;
            color: #007bff;
        }

        .text-center {
            text-align: center;
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
    </style>
</head>

<body>
    <div class="background-radial-gradient">
        <div class="p-5 bg-image"></div>
    </div>
    <div class="container mt-5">
        <div class="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary">
            <div class="card-body py-5 px-md-5">
                <div class="row d-flex justify-content-center">
                    <div class="col-lg-8">
                        <h2 class="fw-bold mb-5 text-center">Registrar Cuota Extraordinaria</h2>
                        <form method="post" action="">
                            <div class="form-outline mb-4">
                                <div class="icon-container">
                                    <ion-icon name="document-text-outline"></ion-icon>
                                </div>
                                <label for="descripcion" class="form-label">Descripción</label>
                                <input type="text" class="form-control" id="descripcion" name="descripcion" required>
                            </div>
                            <div class="form-outline mb-4">
                                <div class="icon-container">
                                    <ion-icon name="cash-outline"></ion-icon>
                                </div>
                                <label for="monto" class="form-label">Monto</label>
                                <input type="number" step="1000" class="form-control" id="monto" name="monto" min="0" required>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary btn-block mb-4" name="submit">Guardar
                                    Cuota</button>
                            </div>
                        </form>
                        <a href="menu_cuotas.php" class="back-button">Volver</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>

    <footer class="footer">
        <p>&copy;2024 KYC Living. Todos los derechos reservados.</p>
    </footer>

</body>

</html>