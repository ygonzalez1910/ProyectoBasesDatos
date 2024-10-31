import React, { useState, useEffect } from 'react';
import { FaLightbulb } from 'react-icons/fa';
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Alert
} from 'reactstrap';
import { FaDatabase, FaSearch, FaChartLine } from 'react-icons/fa';
import { SchemasService, tunningService } from "../../services/api.service";

const Tunning = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    const fetchSchemas = async () => {
      try {
        const { schemas } = await SchemasService.getAllSchemas();
        setSchemas(schemas);
      } catch (error) {
        console.error('Error al obtener la lista de schemas:', error);
        setError("Error al obtener la lista de schemas.");
      }
    };
    fetchSchemas();
  }, []);

  const handleSchemaChange = async (e) => {
    const schema = e.target.value;
    setSelectedSchema(schema);
    setSelectedTable('');
    await fetchTables(schema);
  };

  const fetchTables = async (schema) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tunningService.obtenerTablasPorSchema(schema);
      if (response?.data?.resultado) {
        setTables(response.data.tablas || []);
      } else {
        setError(response.data.errores?.[0] || 'Error al obtener las tablas');
        setTables([]);
      }
    } catch (error) {
      console.error('Error al obtener las tablas:', error);
      setError('Error al obtener las tablas del schema');
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (e) => {
    setSelectedTable(e.target.value);
  };

  const handleQueryChange = (e) => {
    setSqlQuery(e.target.value);
  };

  const analyzeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Crear el objeto con la estructura esperada por el backend
      const payload = {
        sqlQuery: sqlQuery,
        schema: selectedSchema
      };

      // Enviar el payload al servicio
      const response = await tunningService.analizarConsulta(payload);
      setAnalysisResult(response.data);
      
    } catch (error) {
      setError('Error al analizar la consulta.');
      console.error('Error al analizar la consulta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {/* Header mejorado */}
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Módulo de Tunning</h2>
          <p className="text-muted lead">Análisis y optimización de consultas SQL</p>
          <hr style={styles.divider} className="my-4" />
        </Col>
      </Row>
  
      <Row className="g-4">
        {/* Selector de Schema y Tabla */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaDatabase size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Selección de Base de Datos</CardTitle>
                  <small>Seleccione el schema y la tabla a analizar</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <FormGroup className="mb-3">
                <Label for="schema-select" className="form-label text-muted">Schema:</Label>
                <Input
                  type="select"
                  id="schema-select"
                  value={selectedSchema}
                  onChange={handleSchemaChange}
                  disabled={loading}
                >
                  <option value="">Seleccione un schema</option>
                  {schemas.map((schema, index) => (
                    <option key={index} value={schema.schemaName}>
                      {schema.schemaName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
  
              <FormGroup>
                <Label for="table-select" className="form-label text-muted">Tabla:</Label>
                <Input
                  type="select"
                  id="table-select"
                  value={selectedTable}
                  onChange={handleTableChange}
                  disabled={loading || !selectedSchema}
                >
                  <option value="">Seleccione una tabla</option>
                  {tables.map((table, index) => (
                    <option key={index} value={table}>
                      {table}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </CardBody>
          </Card>
        </Col>
  
        {/* Analizador de Consultas */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaSearch size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Analizador de Consultas SQL</CardTitle>
                  <small>Ingrese y analice su consulta SQL</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <FormGroup>
                <Label for="sql-query" className="form-label text-muted">Consulta SQL:</Label>
                <Input
                  type="textarea"
                  id="sql-query"
                  value={sqlQuery}
                  onChange={handleQueryChange}
                  placeholder="Ingrese la consulta SQL a analizar"
                  rows="5"
                  className="mb-3"
                />
              </FormGroup>
              <div className="text-end">
                <Button
                  color="primary"
                  onClick={analyzeQuery}
                  disabled={loading || !selectedSchema || !sqlQuery}
                  style={styles.button}
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Analizando...
                    </>
                  ) : (
                    'Analizar Consulta'
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
  
      {/* Resultados del Análisis */}
      {analysisResult && (
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm border-0" style={styles.card}>
              <CardHeader className="py-3" style={styles.gradient}>
                <div className="d-flex align-items-center">
                  <FaChartLine size={20} className="me-3" />
                  <div>
                    <CardTitle tag="h5" className="mb-0">Resultados del Análisis</CardTitle>
                    <small>Plan de ejecución y recomendaciones</small>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-4">
                {/* Plan de Ejecución */}
                <Card className="mb-4" style={styles.statsCard}>
                  <CardBody>
                    <h6 className="text-primary mb-3">Plan de Ejecución</h6>
                    <pre className="bg-light p-3 rounded mb-0">
                      {analysisResult.planEjecucion}
                    </pre>
                  </CardBody>
                </Card>
  
                {/* Estadísticas */}
                <Card className="mb-4" style={styles.statsCard}>
                  <CardBody>
                    <h6 className="text-primary mb-3">Estadísticas de Ejecución</h6>
                    <ListGroup flush>
                      <ListGroupItem className="d-flex justify-content-between align-items-center">
                        Tiempo de Ejecución
                        <span className="text-muted">{analysisResult.estadisticas.TiempoEjecucion.toFixed(6)} seg</span>
                      </ListGroupItem>
                      <ListGroupItem className="d-flex justify-content-between align-items-center">
                        Buffer Gets
                        <span className="text-muted">{analysisResult.estadisticas.BufferGets}</span>
                      </ListGroupItem>
                      <ListGroupItem className="d-flex justify-content-between align-items-center">
                        Lecturas de Disco
                        <span className="text-muted">{analysisResult.estadisticas.LecturasDisco}</span>
                      </ListGroupItem>
                      <ListGroupItem className="d-flex justify-content-between align-items-center">
                        Filas Procesadas
                        <span className="text-muted">{analysisResult.estadisticas.FilasProcesadas}</span>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
  
                {/* Recomendaciones */}
                {analysisResult.recomendacionesOptimizacion.length > 0 && (
                  <Card style={styles.statsCard}>
                    <CardBody>
                      <h6 className="text-primary mb-3">Recomendaciones de Optimización</h6>
                      <ListGroup flush>
                        {analysisResult.recomendacionesOptimizacion.map((recomendacion, index) => (
                          <ListGroupItem key={index}>
                            <FaLightbulb className="text-warning me-2" />
                            {recomendacion}
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
  
      {error && (
        <Alert color="danger" className="mt-4">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default Tunning;