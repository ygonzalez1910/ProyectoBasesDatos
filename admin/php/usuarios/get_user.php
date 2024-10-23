<?php
// get_user.php
include('../../procesos/connect.php');
session_start();

// Verificar si el usuario tiene permisos de administrador
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    http_response_code(403);
    exit('Acceso denegado');
}

if (isset($_GET['id'])) {
    $user_id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);
    
    $query = "SELECT id, username, email, role FROM users WHERE id = :user_id";
    $stmt = oci_parse($conn, $query);
    
    oci_bind_by_name($stmt, ":user_id", $user_id);
    
    if (oci_execute($stmt)) {
        $user = oci_fetch_assoc($stmt);
        header('Content-Type: application/json');
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado']);
    }
}
?>