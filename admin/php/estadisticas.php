<?php
// Incluir conexión a la base de datos
include('db_connection.php');

// Obtener estadísticas de MySQL
$estadisticas = $conn->query("SHOW STATUS LIKE 'Handler%'");
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadísticas - Tunning de Consultas</title>
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
        .table {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
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
            <div class="col-md-12">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Estadísticas de Consultas</h5>

                        <h6 class="card-title">Estadísticas Generales:</h6>
                        <table class="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Variable</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while($row = $estadisticas->fetch_assoc()): ?>
                                    <tr>
                                        <td><?php echo $row['Variable_name']; ?></td>
                                        <td><?php echo $row['Value']; ?></td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
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
