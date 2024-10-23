<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Administración de Bases de Datos - Respaldos</title>
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
                        <h5 class="card-title">Respaldo por Schema</h5>
                        <p class="card-text">Crea un respaldo de un schema específico de la base de datos.</p>
                        <a href="respaldo_schema.php" class="btn btn-primary">Crear Respaldo</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Respaldo por Tablas</h5>
                        <p class="card-text">Crea un respaldo de tablas específicas dentro de un schema.</p>
                        <a href="respaldo_tablas.php" class="btn btn-primary">Crear Respaldo</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Respaldo Completo</h5>
                        <p class="card-text">Crea un respaldo completo de toda la base de datos.</p>
                        <a href="respaldo_completo.php" class="btn btn-primary">Crear Respaldo</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Recuperar Respaldo</h5>
                        <p class="card-text">Restaura la base de datos desde un archivo de respaldo.</p>
                        <a href="recuperar_respaldo.php" class="btn btn-primary">Recuperar</a>
                    </div>
                </div>
            </div>
            <div class="col-md-6 col-lg-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Administrar Archivos de Respaldo</h5>
                        <p class="card-text">Gestiona los archivos de respaldo almacenados en el servidor.</p>
                        <a href="admin_archivos.php" class="btn btn-primary">Administrar</a>
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