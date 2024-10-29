import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormGroup, Label, Input, Button, Spinner, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
import { SchemasService, tunningService } from "../../services/api.service";

const Tunning = () => {
  const [schemas, setSchemas] = useState([]);
  const [formData, setFormData] = useState({
    tipoBackup: '',
    nombreBackup: '',
    contrasena: ''
  });
  const [selectedSchema, setSelectedSchema] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSchemaChange = (e) => {
    const selectedSchema = e.target.value;
    setSelectedSchema(selectedSchema);
    fetchTables(selectedSchema);
  };

  const fetchTables = async (schema) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tunningService.obtenerListaTablas(schema);
      setTables(response.data.tablas || []);
    } catch (error) {
      console.error('Error al obtener la lista de tablas:', error);
      setError("Error al obtener la lista de tablas.");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (e) => {
    const selectedTable = e.target.value;
    setSelectedTable(selectedTable);
  };

  const handleQueryChange = (e) => {
    setSqlQuery(e.target.value);
  };

  const analyzeQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tunningService.analizarConsulta(sqlQuery, selectedSchema);
      setAnalysisResult(response.data);
    } catch (error) {
      setError('Error al analizar la consulta.');
      console.error('Error al analizar la consulta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h1 className="mb-4">Administrador de base de datos - Módulo de Tunning</h1>

      <Row>
        <Col md="6">
          <Card>
            <CardHeader>
              <h3>Seleccionar Schema y Tabla</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
              <Label for="nombreSchema">Seleccionar Esquema</Label>
          <Input
            type="select"
            name="nombreSchema"
            id="nombreSchema"
            value={formData.nombreSchema}
            onChange={handleSchemaChange}
            required
          >
            <option value="" disabled>Select an option</option>
            {schemas.map((schema, index) => (
              <option key={index} value={schema.schemaName}>
                {schema.schemaName}
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

        <Col md="6">
          <Card>
            <CardHeader>
              <h3>Analizador de Consultas SQL</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
                <Label for="sql-query">Consulta SQL:</Label>
                <Input
                  type="textarea"
                  id="sql-query"
                  value={sqlQuery}
                  onChange={handleQueryChange}
                  placeholder="Ingrese la consulta SQL"
                />
              </FormGroup>
              <Button color="primary" onClick={analyzeQuery} disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Analizar consulta'}
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {analysisResult && (
        <Card className="mt-4">
          <CardHeader>
            <h3>Resultado del Análisis</h3>
          </CardHeader>
          <CardBody>
            <h4>Plan de Ejecución:</h4>
            <pre>{analysisResult.planEjecucion}</pre>
            <h4>Estadísticas:</h4>
            <ListGroup flush>
              {Object.entries(analysisResult.estadisticas).map(([key, value]) => (
                <ListGroupItem key={key}>
                  {key}: {value}
                </ListGroupItem>
              ))}
            </ListGroup>
            <h4>Recomendaciones de Optimización:</h4>
            <ListGroup flush>
              {analysisResult.recomendacionesOptimizacion.map((recommendation, index) => (
                <ListGroupItem key={index}>
                  {recommendation}
                </ListGroupItem>
              ))}
            </ListGroup>
          </CardBody>
        </Card>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
    </Container>
  );
};

export default Tunning;
