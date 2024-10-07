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
    <title>Sistema de Administración de Bases de Datos - Seguridad</title>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
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

        #radius-shape-1 {
            height: 220px;
            width: 220px;
            top: -60px;
            left: -130px;
            background: radial-gradient(#44006b, #ad1fff);
            overflow: hidden;
        }

        #radius-shape-2 {
            border-radius: 38% 62% 63% 37% / 70% 33% 67% 30%;
            bottom: -60px;
            right: -110px;
            width: 300px;
            height: 300px;
            background: radial-gradient(#44006b, #ad1fff);
            overflow: hidden;
        }

        .bg-glass {
            background-color: hsla(0, 0%, 100%, 0.9) !important;
            backdrop-filter: saturate(200%) blur(25px);
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
            /* Ajustar este valor según sea necesario */
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

<!-- Section: Design Block -->
<section class="text-center">
    <!-- Background image -->
    <div class="p-5 bg-image" style="
            background: linear-gradient(to right, #001b44, #0056b3);
            height: 300px;
            "></div>
    <!-- Background image -->

    <div class="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary" style="
            margin-top: -100px;
            backdrop-filter: blur(30px);
            ">
        <div class="card-body py-5 px-md-5">
            <div class="row d-flex justify-content-center">
                <div class="col-lg-8">
                    <h2 class="fw-bold mb-5">Registrarse</h2>
                    <form method="post" action="" autocomplete="off">
                        <!-- Nombre input -->
                        <div class="form-outline mb-4">
                            <div class="icon-container">
                                <ion-icon name="person-outline"></ion-icon>
                            </div>
                            <label class="form-label" for="nombre">Nombre</label>
                            <input type="text" id="nombre" name="nombre" class="form-control" required />
                        </div>
                        <div class="form-outline mb-4">
                            <div class="icon-container">
                                <ion-icon name="person-outline"></ion-icon>
                            </div>
                            <label class="form-label" for="Primer Apellido">Primer Apellido</label>
                            <input type="text" id="apellido1" name="primer_apellido" class="form-control" required />
                        </div>
                        <div class="form-outline mb-4">
                            <div class="icon-container">
                                <ion-icon name="person-outline"></ion-icon>
                            </div>
                            <label class="form-label" for="Segundo Apellido">Segundo Apellido</label>
                            <input type="text" id="apellido2" name="segundo_apellido" class="form-control" required />
                        </div>
                        <!-- Teléfono input -->
                        <div class="form-outline mb-4">
                            <div class="icon-container">
                                <ion-icon name="call-outline"></ion-icon>
                            </div>
                            <label class="form-label" for="telefono">Teléfono</label>
                            <input type="text" id="telefono" name="telefono" class="form-control" required />
                        </div>

                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <div class="icon-container">
                                <ion-icon name="mail-outline"></ion-icon>
                            </div>
                            <label class="form-label" for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-control" required />
                        </div>

                        <!-- Clave input -->
                        <div class="form-outline mb-4">
                            <div class="icon-container">
                                <ion-icon name="lock-closed-outline"></ion-icon>
                            </div>
                            <label class="form-label" for="clave">Clave</label>
                            <input type="password" id="clave" name="clave" class="form-control" required />
                        </div>

                        <!-- Submit button -->
                        <button type="submit" class="btn btn-primary btn-block mb-4" name="submit">Guardar
                            Datos</button>
                    </form>
                    <a href="../menu_principal.php" class="back-button">Volver</a>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Section: Design Block -->


<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.min.js"></script>
<footer class="footer">
    <p>&copy;2024 KYC Living. Todos los derechos reservados.</p>
</footer>
</body>

</html>
