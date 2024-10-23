
<?php
// get_tables.php
include('../../../procesos/connect.php');

if (isset($_POST['schema'])) {
    $schema = filter_input(INPUT_POST, 'schema', FILTER_SANITIZE_STRING);
    
    $query = "SELECT table_name FROM all_tables WHERE owner = :schema ORDER BY table_name";
    $stmt = oci_parse($conn, $query);
    oci_bind_by_name($stmt, ":schema", $schema);
    oci_execute($stmt);
    
    echo '<option value="">Seleccione una tabla</option>';
    while ($row = oci_fetch_assoc($stmt)) {
        echo '<option value="' . htmlspecialchars($row['TABLE_NAME']) . '">' . 
             htmlspecialchars($row['TABLE_NAME']) . '</option>';
    }
}
?>