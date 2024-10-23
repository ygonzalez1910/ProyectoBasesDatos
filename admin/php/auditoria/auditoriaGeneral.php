<?php
// Conexión a la base de datos
include('../../../procesos/connect.php');

// Procesar formularios
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'enable_table_audit':
                $schema = filter_input(INPUT_POST, 'schema', FILTER_SANITIZE_STRING);
                $table = filter_input(INPUT_POST, 'table', FILTER_SANITIZE_STRING);
                $operations = implode(', ', $_POST['operations'] ?? []);
                $audit_type = filter_input(INPUT_POST, 'audit_type', FILTER_SANITIZE_STRING);
                
                if (!empty($operations)) {
                    $enable_audit_sql = "AUDIT $operations ON $schema.$table BY $audit_type";
                    $stmt = oci_parse($conn, $enable_audit_sql);
                    
                    if (oci_execute($stmt)) {
                        echo "<script>swal('Éxito', 'Auditoría de tabla habilitada correctamente', 'success');</script>";
                    } else {
                        $error = oci_error($stmt);
                        echo "<script>swal('Error', 'Error al habilitar auditoría: " . $error['message'] . "', 'error');</script>";
                    }
                }
                break;

            case 'enable_schema_audit':
                $schema = filter_input(INPUT_POST, 'schema', FILTER_SANITIZE_STRING);
                
                $enable_audit_sql = "AUDIT ALL ON $schema BY SESSION";
                $stmt = oci_parse($conn, $enable_audit_sql);
                
                if (oci_execute($stmt)) {
                    echo "<script>swal('Éxito', 'Auditoría de esquema habilitada correctamente', 'success');</script>";
                } else {
                    $error = oci_error($stmt);
                    echo "<script>swal('Error', 'Error al habilitar auditoría: " . $error['message'] . "', 'error');</script>";
                }
                break;

            case 'disable_audit':
                $schema = filter_input(INPUT_POST, 'schema', FILTER_SANITIZE_STRING);
                $table = filter_input(INPUT_POST, 'table', FILTER_SANITIZE_STRING);
                
                $disable_audit_sql = "NOAUDIT ALL ON $schema.$table";
                $stmt = oci_parse($conn, $disable_audit_sql);
                
                if (oci_execute($stmt)) {
                    echo "<script>swal('Éxito', 'Auditoría deshabilitada correctamente', 'success');</script>";
                } else {
                    $error = oci_error($stmt);
                    echo "<script>swal('Error', 'Error al deshabilitar auditoría: " . $error['message'] . "', 'error');</script>";
                }
                break;
        }
    }
}

// Obtener lista de esquemas
$schemas = [];
$query = "SELECT DISTINCT owner FROM ALL_TABLES WHERE owner NOT IN ('SYS','SYSTEM') ORDER BY owner";
$result = oci_parse($conn, $query);
oci_execute($result);
while ($row = oci_fetch_assoc($result)) {
    $schemas[] = $row['OWNER'];
}

// Obtener configuración actual de auditoría
$audit_settings = [];
$query = "SELECT 
            owner, 
            object_name,
            DECODE(sel, 'S/S', 'S', '-/-', 'N', sel) as select_audit,
            DECODE(ins, 'S/S', 'S', '-/-', 'N', ins) as insert_audit,
            DECODE(upd, 'S/S', 'S', '-/-', 'N', upd) as update_audit,
            DECODE(del, 'S/S', 'S', '-/-', 'N', del) as delete_audit,
            DECODE(alt, 'S/S', 'S', '-/-', 'N', alt) as alter_audit
          FROM DBA_OBJ_AUDIT_OPTS 
          WHERE owner NOT IN ('SYS', 'SYSTEM', 'OUTLN', 'APPQOSSYS', 'DBSNMP', 'ORACLE_OCM')
            AND object_type = 'TABLE'
          ORDER BY owner, object_name";
$result = oci_parse($conn, $query);
oci_execute($result);
while ($row = oci_fetch_assoc($result)) {
    $audit_settings[] = $row;
}

// Obtener registros de auditoría de sesiones
$session_audits = [];
$query = "SELECT 
            OS_Username,
            Username,
            Terminal,
            DECODE(Returncode,
                   '0', 'Conectado',
                   '1005', 'Fallo - Null',
                   '1017', 'Fallo',
                   Returncode) as Tipo_Suceso,
            TO_CHAR(Timestamp, 'DD-MM-YY HH24:MI:SS') as Hora_Inicio_Sesion,
            TO_CHAR(Logoff_Time, 'DD-MM-YY HH24:MI:SS') as Hora_Fin_Sesion
          FROM DBA_AUDIT_SESSION
          WHERE Timestamp > SYSDATE - 30
          ORDER BY Timestamp DESC";
$result = oci_parse($conn, $query);
oci_execute($result);
while ($row = oci_fetch_assoc($result)) {
    $session_audits[] = $row;
}

// Obtener registros de auditoría de operaciones DML
$dml_audits = [];
$query = "SELECT 
            os_username,
            username,
            owner,
            obj_name as object_name,
            action_name,
            TO_CHAR(timestamp, 'DD-MM-YY HH24:MI:SS') as event_timestamp,
            DECODE(returncode, '0', 'Éxito', 'Error ' || returncode) as status
          FROM DBA_AUDIT_TRAIL
          WHERE action_name IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')
            AND timestamp > SYSDATE - 30
          ORDER BY timestamp DESC";
$result = oci_parse($conn, $query);
oci_execute($result);
while ($row = oci_fetch_assoc($result)) {
    $dml_audits[] = $row;
}
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Auditoría Oracle</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    
    <style>
        .fixed-size {
            max-height: 400px;
            overflow-y: auto;
        }
        .table th {
            position: sticky;
            top: 0;
            background: white;
            z-index: 1;
        }
    </style>
</head>

<body class="bg-light">
    <div class="container-fluid mt-4">
        <div class="row">
            <!-- Panel de configuración -->
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Configurar Auditoría de Tabla</h4>
                    </div>
                    <div class="card-body">
                        <form method="post" id="tableAuditForm">
                            <input type="hidden" name="action" value="enable_table_audit">
                            
                            <div class="mb-3">
                                <label for="schema" class="form-label">Esquema:</label>
                                <select class="form-select" id="schema" name="schema" required>
                                    <?php foreach ($schemas as $schema): ?>
                                        <option value="<?php echo htmlspecialchars($schema); ?>">
                                            <?php echo htmlspecialchars($schema); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="table" class="form-label">Tabla:</label>
                                <select class="form-select" id="table" name="table" required>
                                    <option value="">Seleccione un esquema primero</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label class="form-label">Operaciones a Auditar:</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="operations[]" value="INSERT" id="check_insert">
                                    <label class="form-check-label" for="check_insert">INSERT</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="operations[]" value="UPDATE" id="check_update">
                                    <label class="form-check-label" for="check_update">UPDATE</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="operations[]" value="DELETE" id="check_delete">
                                    <label class="form-check-label" for="check_delete">DELETE</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="operations[]" value="SELECT" id="check_select">
                                    <label class="form-check-label" for="check_select">SELECT</label>
                                </div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="audit_type" class="form-label">Tipo de Auditoría:</label>
                                <select class="form-select" id="audit_type" name="audit_type" required>
                                    <option value="ACCESS">Por Acceso</option>
                                    <option value="SESSION">Por Sesión</option>
                                </select>
                            </div>
                            
                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary">Habilitar Auditoría</button>
                                <button type="button" class="btn btn-danger" onclick="disableAudit()">Deshabilitar Auditoría</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Auditar Esquema Completo</h4>
                    </div>
                    <div class="card-body">
                        <form method="post">
                            <input type="hidden" name="action" value="enable_schema_audit">
                            
                            <div class="mb-3">
                                <label for="schema_full" class="form-label">Esquema:</label>
                                <select class="form-select" id="schema_full" name="schema" required>
                                    <?php foreach ($schemas as $schema): ?>
                                        <option value="<?php echo htmlspecialchars($schema); ?>">
                                            <?php echo htmlspecialchars($schema); ?>
                                        </option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <div class="d-grid">
                                <button type="submit" class="btn btn-warning">Auditar Todo el Esquema</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Panel de resultados -->
            <div class="col-md-8">
                <!-- Pestaña de auditoría de sesiones -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Auditoría de Sesiones</h4>
                    </div>
                    <div class="card-body">
                        <div class="fixed-size">
                        <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Esquema</th>
                        <th>Objeto</th>
                        <th>Operaciones Auditadas</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($audit_settings as $setting): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($setting['OWNER']); ?></td>
                        <td><?php echo htmlspecialchars($setting['OBJECT_NAME']); ?></td>
                        <td>
                            <?php
                            $operations = [];
                            if ($setting['INSERT_AUDIT'] === 'S') $operations[] = 'INSERT';
                            if ($setting['UPDATE_AUDIT'] === 'S') $operations[] = 'UPDATE';
                            if ($setting['DELETE_AUDIT'] === 'S') $operations[] = 'DELETE';
                            if ($setting['SELECT_AUDIT'] === 'S') $operations[] = 'SELECT';
                            if ($setting['ALTER_AUDIT'] === 'S') $operations[] = 'ALTER';
                            echo !empty($operations) ? 
                                htmlspecialchars(implode(', ', $operations)) : 
                                '<span class="text-muted">Sin auditorías</span>';
                            ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
                        </div>
                    </div>
                </div>

                <!-- Pestaña de auditoría de operaciones -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Auditoría de Operaciones</h4>
                    </div>
                    <div class="card-body">
                        <div class="fixed-size">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Fecha</th>
                                        <th>Usuario</th>
                                        <th>Esquema</th>
                                        <th>Tabla</th>
                                        <th>Operación</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                <?php foreach ($dml_audits as $audit): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($audit['TIMESTAMP']); ?></td>
                                        <td><?php echo htmlspecialchars($audit['USERNAME']); ?></td>
                                        <td><?php echo htmlspecialchars($audit['OWNER']); ?></td>
                                        <td><?php echo htmlspecialchars($audit['OBJ_NAME']); ?></td>
                                        <td><?php echo htmlspecialchars($audit['ACTION_NAME']); ?></td>
                                        <td>
                                            <?php if ($audit['STATUS'] === 'Éxito'): ?>
                                                <span class="badge bg-success">Éxito</span>
                                            <?php else: ?>
                                                <span class="badge bg-danger"><?php echo htmlspecialchars($audit['STATUS']); ?></span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Configuración actual de auditoría -->
                <div class="card mb-4">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Configuración Actual de Auditoría</h4>
                    </div>
                    <div class="card-body">
                        <div class="fixed-size">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Esquema</th>
                                        <th>Objeto</th>
                                        <th>Operaciones Auditadas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($audit_settings as $setting): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($setting['OWNER']); ?></td>
                                        <td><?php echo htmlspecialchars($setting['OBJ_NAME']); ?></td>
                                        <td>
                                            <?php
                                            $operations = [];
                                            if ($setting['INS'] === 'S') $operations[] = 'INSERT';
                                            if ($setting['UPD'] === 'S') $operations[] = 'UPDATE';
                                            if ($setting['DEL'] === 'S') $operations[] = 'DELETE';
                                            if ($setting['SEL'] === 'S') $operations[] = 'SELECT';
                                            echo htmlspecialchars(implode(', ', $operations));
                                            ?>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Función para cargar las tablas de un esquema
        function loadTables(schema) {
            $.ajax({
                url: 'get_tables.php',
                method: 'POST',
                data: { schema: schema },
                success: function(response) {
                    $('#table').html(response);
                }
            });
        }

        // Cargar tablas cuando cambia el esquema
        $('#schema').change(function() {
            loadTables($(this).val());
        });

        // Cargar tablas iniciales
        $(document).ready(function() {
            loadTables($('#schema').val());
        });

        // Función para deshabilitar auditoría
        function disableAudit() {
            const schema = $('#schema').val();
            const table = $('#table').val();
            
            if (!schema || !table) {
                swal('Error', 'Por favor seleccione un esquema y una tabla', 'error');
                return;
            }

            $('<form>')
                .attr('method', 'POST')
                .append($('<input>').attr('type', 'hidden').attr('name', 'action').val('disable_audit'))
                .append($('<input>').attr('type', 'hidden').attr('name', 'schema').val(schema))
                .append($('<input>').attr('type', 'hidden').attr('name', 'table').val(table))
                .appendTo('body')
                .submit();
        }
    </script>
</body>
</html>