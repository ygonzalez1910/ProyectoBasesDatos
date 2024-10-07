<?php
// Configuración de la base de datos
$db_host = 'localhost';
$db_user = 'root';
$db_pass = 'password';
$backup_file = 'respaldos/respaldo_completo_' . date('Ymd_His') . '.sql';

// Comando mysqldump
$command = "mysqldump --user=$db_user --password=$db_pass --host=$db_host --all-databases --routines --events > $backup_file";

// Ejecutar comando
exec($command, $output, $return_var);

if ($return_var === 0) {
    // Forzar la descarga del archivo SQL
    header('Content-Type: application/sql');
    header('Content-Disposition: attachment; filename="' . basename($backup_file) . '"');
    readfile($backup_file);
} else {
    echo "Error al crear el respaldo.";
}
?>
