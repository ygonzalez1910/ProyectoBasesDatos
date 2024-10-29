// components/Auditoria.js
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  Spinner, 
  Card, 
  CardBody, 
  CardHeader, 
  Table,
  Alert
} from 'reactstrap';
import { AuditoriaService } from "../../services/api.service";

const Auditoria = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [actionType, setActionType] = useState('');
  const [auditResults, setAuditResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSchemas = async () => {
      try {
        const response = await AuditoriaService.obtenerListaTablas('');
        setSchemas(response.data.tablas);
      } catch (error) {
        console.error('Error al obtener la lista de schemas:', error);
        setError('Error al cargar los schemas');
      }
    };
    fetchSchemas();
  }, []);

  const handleSchemaChange = (e) => {
    const selectedSchema = e.target.value;
    setSelectedSchema(selectedSchema);
    fetchTables(selectedSchema);
  };

  const fetchTables = async (schema) => {
    try {
      const response = await AuditoriaService.obtenerListaTablas(schema);
      setTables(response.data.tablas);
    } catch (error) {
      console.error('Error al obtener la lista de tablas:', error);
      setError('Error al cargar las tablas');
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleActionTypeChange = (e) => {
    setActionType(e.target.value);
  };

  const consultarAuditoria = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await AuditoriaService.obtenerAuditoria({
        nombreTabla: selectedTable,
        fechaInicio: dateRange.startDate || null,
        fechaFin: dateRange.endDate || null,
        tipoAccion: actionType || null
      });

      if (response.data.resultado) {
        setAuditResults(response.data.registros);
      } else {
        setError(response.data.errores.join(', '));
      }
    } catch (error) {
      console.error('Error al consultar auditoría:', error);
      setError('Error al consultar los registros de auditoría');
    } finally {
      setLoading(false);
    }
  };

  const activarAuditoria = async () => {
    if (!selectedTable) {
      setError('Debe seleccionar una tabla');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await AuditoriaService.activarAuditoria({
        nombreTabla: selectedTable,
        auditarInsert: true,
        auditarUpdate: true,
        auditarDelete: true,
        auditarSelect: true
      });

      if (response.data.resultado) {
        setMessage('Auditoría activada exitosamente');
      } else {
        setError(response.data.errores.join(', '));
      }
    } catch (error) {
      console.error('Error al activar auditoría:', error);
      setError('Error al activar la auditoría');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Administrador de base de datos - Módulo de Auditoría</h1>

      <Row>
        <Col md="6">
          <Card>
            <CardHeader>
              <h3>Configuración de Auditoría</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="schema-select">Seleccionar schema:</Label>
                <Input
                  type="select"
                  id="schema-select"
                  value={selectedSchema}
                  onChange={handleSchemaChange}
                >
                  <option value="">Seleccione un schema</option>
                  {schemas.map((schema) => (
                    <option key={schema} value={schema}>
                      {schema}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label for="table-select">Seleccionar tabla:</Label>
                <Input
                  type="select"
                  id="table-select"
                  value={selectedTable}
                  onChange={handleTableChange}
                  disabled={!selectedSchema}
                >
                  <option value="">Seleccione una tabla</option>
                  {tables.map((table) => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <Button 
                color="primary" 
                onClick={activarAuditoria} 
                disabled={loading || !selectedTable}
                className="mt-3"
              >
                {loading ? <Spinner size="sm" /> : 'Activar Auditoría'}
              </Button>
            </CardBody>
          </Card>
        </Col>

        <Col md="6">
          <Card>
            <CardHeader>
              <h3>Consulta de Auditoría</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="start-date">Fecha inicio:</Label>
                <Input
                  type="datetime-local"
                  id="start-date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="end-date">Fecha fin:</Label>
                <Input
                  type="datetime-local"
                  id="end-date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="action-type">Tipo de acción:</Label>
                <Input
                  type="select"
                  id="action-type"
                  value={actionType}
                  onChange={handleActionTypeChange}
                >
                  <option value="">Todas las acciones</option>
                  <option value="INSERT">INSERT</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                  <option value="SELECT">SELECT</option>
                </Input>
              </FormGroup>

              <Button 
                color="primary" 
                onClick={consultarAuditoria} 
                disabled={loading || !selectedTable}
              >
                {loading ? <Spinner size="sm" /> : 'Consultar Auditoría'}
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {error && <Alert color="danger" className="mt-4">{error}</Alert>}
      {message && <Alert color="success" className="mt-4">{message}</Alert>}

      {auditResults && auditResults.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <h3>Registros de Auditoría</h3>
          </CardHeader>
          <CardBody>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha/Hora</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Sesión ID</th>
                    <th>Consulta SQL</th>
                  </tr>
                </thead>
                <tbody>
                  {auditResults.map((registro) => (
                    <tr key={registro.auditoriaId}>
                      <td>{registro.auditoriaId}</td>
                      <td>{new Date(registro.fechaHora).toLocaleString()}</td>
                      <td>{registro.usuario}</td>
                      <td>{registro.tipoAccion}</td>
                      <td>{registro.sesionId}</td>
                      <td>
                        <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                          {registro.consultaSQL}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      )}

      {auditResults && auditResults.length === 0 && (
        <Alert color="info" className="mt-4">
          No se encontraron registros de auditoría para los criterios seleccionados
        </Alert>
      )}
    </Container>
  );
};

export default Auditoria;