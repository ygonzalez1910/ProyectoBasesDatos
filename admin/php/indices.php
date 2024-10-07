<?php
// Incluir conexión a la base de datos
include('db_connection.php');

$tabla = '';
$indices = '';
$mensaje = '';

if (isset($_POST['tabla'])) {
    $tabla = $_POST['tabla'];
    
    // Obtener los índices actuales de la tabla seleccionada
    $resultado = $conn->query("SHOW INDEXES FROM " . $tabla);
}

if (isset($_POST['nuevo_indice'])) {
    $tabla = $_POST['tabla'];
    $columna = $_POST['columna'];
    $tipo = $_POST['tipo'];
    
    // Crear nuevo índice
    $conn->query("CREATE $tipo INDEX idx_$columna ON $tabla ($columna)");
    $mensaje = "Índice creado exitosamente.";
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Administración de Bases de Datos - Índices</title>
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
        .card-text, .form-label {
            color: #e0e0e0;
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
            <div class="col-md-12">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">Gestión de Índices</h5>
                        <form action="indices.php" method="POST" class="mb-4">
                            <div class="mb-3">
                                <label for="tabla" class="form-label">Tabla:</label>
                                <input type="text" name="tabla" class="form-control" placeholder="Nombre de la tabla" value="<?php echo $tabla; ?>">
                            </div>
                            <button type="submit" class="btn btn-primary">Ver Índices</button>
                        </form>

                        <?php if ($resultado): ?>
                            <h5 class="card-title">Índices en la tabla <?php echo $tabla; ?>:</h5>
                            <table class="table table-dark table-striped">
                                <thead>
                                    <tr>
                                        <th>Nombre del Índice</th>
                                        <th>Columna</th>
                                        <th>Tipo de Índice</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while($row = $resultado->fetch_assoc()): ?>
                                        <tr>
                                            <td><?php echo $row['Key_name']; ?></td>
                                            <td><?php echo $row['Column_name']; ?></td>
                                            <td><?php echo $row['Index_type']; ?></td>
                                        </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>

                        <h5 class="card-title mt-4">Crear un nuevo índice:</h5>
                        <form action="indices.php" method="POST">
                            <input type="hidden" name="tabla" value="<?php echo $tabla; ?>">
                            <div class="mb-3">
                                <label for="columna" class="form-label">Columna:</label>
                                <input type="text" name="columna" class="form-control" placeholder="Nombre de la columna">
                            </div>
                            <div class="mb-3">
                                <label for="tipo" class="form-label">Tipo de índice:</label>
                                <select name="tipo" class="form-select">
                                    <option value="">Normal</option>
                                    <option value="UNIQUE">Único</option>
                                </select>
                            </div>
                            <button type="submit" name="nuevo_indice" class="btn btn-primary">Crear Índice</button>
                        </form>

                        <?php if ($mensaje): ?>
                            <div class="alert alert-success mt-3">
                                <?php echo $mensaje; ?>
                            </div>
                        <?php endif; ?>
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
