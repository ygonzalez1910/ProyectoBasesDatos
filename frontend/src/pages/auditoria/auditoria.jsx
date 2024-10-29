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
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const [actionType, setActionType] = useState('');
  const [auditResults, setAuditResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);
  
  const fetchTables = async () => {
    try {
      const response = await AuditoriaService.obtenerListaTablas();
      console.log("Response de listar tablas:", response);
      if (response.tablas && response.tablas.length > 0) {
        setTables(response.tablas);
      } else {
        setError('No se encontraron tablas.');
      }
    } catch (error) {
      console.error('Error al obtener la lista de tablas:', error);
      setError('Error al cargar las tablas');
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const validateDates = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Por favor seleccione ambas fechas');
      return false;
    }
    
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    
    if (end < start) {
      setError('La fecha final no puede ser anterior a la fecha inicial');
      return false;
    }
    
    return true;
  };
  const handleActionTypeChange = (e) => {
    setActionType(e.target.value);
  };

  const consultarAuditoria = async () => {
    if (!validateDates()) return;
    
    try {
      setLoading(true);
      setError(null);
      setShowResults(false);

      const formattedStartDate = new Date(dateRange.startDate).toISOString();
      const formattedEndDate = new Date(dateRange.endDate).toISOString();

      const response = await AuditoriaService.obtenerAuditoria({
        nombreTabla: selectedTable,
        fechaInicio: formattedStartDate,
        fechaFin: formattedEndDate,
        tipoAccion: actionType || null
      });

      if (response.resultado) {
        setAuditResults(response.registros);
        setShowResults(true);
      } else {
        setError(response.errores?.join(', ') || 'Error al obtener los resultados');
      }
    } catch (error) {
      console.error('Error al consultar auditoría:', error);
      setError('Error al consultar los registros de auditoría. Por favor intente nuevamente.');
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

      if (response.resultado) {
        setMessage('Auditoría activada exitosamente');
      } else {
        setError(response.errores.join(', '));
      }
    } catch (error) {
      console.error('Error al activar auditoría:', error);
      const errorMessage = error.response ? error.response.data.errores.join(', ') : 'Error desconocido';
      setError(errorMessage);
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
                <Label for="table-select">Seleccionar tabla:</Label>
                <Input
                  type="select"
                  id="table-select"
                  value={selectedTable}
                  onChange={e => setSelectedTable(e.target.value)}
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
              {error && <Alert color="danger" className="mt-2">{error}</Alert>}
              {message && <Alert color="success" className="mt-2">{message}</Alert>}
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
              <Label htmlFor="start-date">Fecha inicio:</Label>
              <Input
                type="datetime-local"
                id="start-date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="w-full"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="end-date">Fecha fin:</Label>
              <Input
                type="datetime-local"
                id="end-date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="w-full"
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="action-type">Tipo de acción:</Label>
              <Input
                type="select"
                id="action-type"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
                className="w-full"
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

      {showResults && auditResults && (
        <Card className="mt-4">
          <CardHeader className="text-white bg-primary">
            <h3 className="m-0">Resultados de Auditoría - {selectedTable}</h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover bordered striped className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="text-center">ID</th>
                    <th className="text-center">Fecha y Hora</th>
                    <th className="text-center">Acción</th>
                    <th className="text-center">Usuario</th>
                    <th className="text-center">Sesión</th>
                    <th className="text-center">Esquema</th>
                    <th className="text-center">SQL</th>
                  </tr>
                </thead>
                <tbody>
                  {auditResults.map((audit) => (
                    <tr key={audit.auditoriaId}>
                      <td className="text-center">{audit.auditoriaId}</td>
                      <td className="text-center">{formatDateTime(audit.fechaHora)}</td>
                      <td className="text-center">
                        <span className={`badge bg-${
                          audit.tipoAccion === 'INSERT' ? 'success' :
                          audit.tipoAccion === 'UPDATE' ? 'warning' :
                          audit.tipoAccion === 'DELETE' ? 'danger' : 'info'
                        }`}>
                          {audit.tipoAccion}
                        </span>
                      </td>
                      <td className="text-center">{audit.usuario}</td>
                      <td className="text-center">{audit.sesionId}</td>
                      <td className="text-center">{audit.esquema}</td>
                      <td className="text-center">
                        {audit.consultaSQL ? (
                          <div className="position-relative">
                            <span title={audit.consultaSQL}>
                              {truncateText(audit.consultaSQL)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      )}

      {showResults && (!auditResults || auditResults.length === 0) && (
        <Alert color="info" className="mt-4">
          No se encontraron registros de auditoría para los criterios seleccionados
        </Alert>
      )}
    </Container>
  );
};

export default Auditoria;