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
  CardTitle, 
  Table,
  Alert
} from 'reactstrap';
import { FaDatabase, FaSearch, FaHistory } from 'react-icons/fa';
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

  const styles = {
    gradient: {
      background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
      color: 'white'
    },
    card: {
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important'
      }
    },
    button: {
      padding: '0.5rem 1.5rem',
      borderRadius: '4px',
      fontWeight: '500',
      textTransform: 'none',
      fontSize: '0.9rem',
      boxShadow: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
    divider: {
      width: '25%',
      margin: '0 auto',
      borderTop: '2px solid #e3e6f0'
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);
  
  const fetchTables = async () => {
    try {
      const response = await AuditoriaService.obtenerListaTablas();
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

  return (
    <Container className="py-5">
      {/* Header mejorado */}
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Módulo de Auditoría</h2>
          <p className="text-muted lead">Gestión y consulta de registros de auditoría del sistema</p>
          <hr style={styles.divider} className="my-4" />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Configuración de Auditoría */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaDatabase size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Configuración de Auditoría</CardTitle>
                  <small>Activar auditoría para tablas del sistema</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <FormGroup>
                <Label for="table-select" className="form-label text-muted">Seleccionar tabla:</Label>
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
              <div className="text-end mt-4">
                <Button
                  color="primary"
                  onClick={activarAuditoria}
                  disabled={loading || !selectedTable}
                  style={styles.button}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Activando...
                    </>
                  ) : (
                    'Activar Auditoría'
                  )}
                </Button>
              </div>
              {error && <Alert color="danger" className="mt-3">{error}</Alert>}
              {message && <Alert color="success" className="mt-3">{message}</Alert>}
            </CardBody>
          </Card>
        </Col>

        {/* Consulta de Auditoría */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaSearch size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Consulta de Auditoría</CardTitle>
                  <small>Búsqueda de registros de auditoría</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <FormGroup className="mb-3">
                <Label htmlFor="start-date" className="form-label text-muted">Fecha inicio:</Label>
                <Input
                  type="datetime-local"
                  id="start-date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                />
              </FormGroup>

              <FormGroup className="mb-3">
                <Label htmlFor="end-date" className="form-label text-muted">Fecha fin:</Label>
                <Input
                  type="datetime-local"
                  id="end-date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </FormGroup>

              <FormGroup className="mb-4">
                <Label htmlFor="action-type" className="form-label text-muted">Tipo de acción:</Label>
                <Input
                  type="select"
                  id="action-type"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                >
                  <option value="">Todas las acciones</option>
                  <option value="INSERT">INSERT</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                  <option value="SELECT">SELECT</option>
                </Input>
              </FormGroup>

              <div className="text-end">
                <Button
                  color="primary"
                  onClick={consultarAuditoria}
                  disabled={loading || !selectedTable}
                  style={styles.button}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Consultando...
                    </>
                  ) : (
                    'Consultar Auditoría'
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Resultados de Auditoría */}
      {showResults && auditResults && (
        <Card className="shadow-sm mt-4 border-0">
          <CardHeader className="py-3" style={styles.gradient}>
            <div className="d-flex align-items-center">
              <FaHistory size={20} className="me-3" />
              <div>
                <CardTitle tag="h5" className="mb-0">Resultados de Auditoría - {selectedTable}</CardTitle>
                <small>Registros encontrados: {auditResults.length}</small>
              </div>
            </div>
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