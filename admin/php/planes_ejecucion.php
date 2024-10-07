<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Administración de Bases de Datos - Planes de Ejecución</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #001f3f, #0056b3);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .container {
            flex-grow: 1;
            display: flex;
            align-items: center;
        }
        .card {
            background-color: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: none;
            border-radius: 15px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        .card-body {
            padding: 2rem;
        }
        .card-title {
            color: #ffffff;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .card-text {
            color: #e0e0e0;
            margin-bottom: 1.5rem;
        }
        .btn-primary {
            background-color: #007bff;
            border: none;
            padding: 0.5rem 1.5rem;
            font-weight: bold;
            transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
        footer {
            background-color: rgba(0, 0, 0, 0.5);
            color: #ffffff;
            text-align: center;
            padding: 1rem 0;
            margin-top: auto;
        }
    </style>
</head>

<body>
    <div class="container py-5">
        <div class="row g-4">
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Plan de Ejecución Simple</h5>
                        <p class="card-text">Analiza el plan de ejecución básico de una consulta para mejorar su rendimiento.</p>
                        <a href="plan_simple.php" class="btn btn-primary">Ver Plan</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Plan de Ejecución Detallado</h5>
                        <p class="card-text">Obtén un análisis detallado del plan de ejecución de una consulta SQL compleja.</p>
                        <a href="plan_detallado.php" class="btn btn-primary">Ver Plan</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Comparación de Planes</h5>
                        <p class="card-text">Compara dos o más planes de ejecución para determinar el mejor rendimiento.</p>
                        <a href="comparacion_planes.php" class="btn btn-primary">Comparar Planes</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Historial de Planes de Ejecución</h5>
                        <p class="card-text">Accede al historial de planes de ejecución generados para consultas anteriores.</p>
                        <a href="historial_planes.php" class="btn btn-primary">Ver Historial</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Optimización de Consultas</h5>
                        <p class="card-text">Mejora el rendimiento de tus consultas a través de la optimización de planes de ejecución.</p>
                        <a href="optimizar_consultas.php" class="btn btn-primary">Optimizar</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 Sistema de Administración de Bases de Datos</p>
    </footer>
</body>

</html>
