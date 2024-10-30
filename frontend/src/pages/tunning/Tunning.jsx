import React, { useState, useEffect } from 'react';
import { Container, Row, Col, FormGroup, Label, Input, Button, Spinner, Card, CardBody, CardHeader, ListGroup, ListGroupItem } from 'reactstrap';
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
    setSelectedTable(''); // Resetea la tabla seleccionada
    await fetchTables(schema);
  };
  
  const fetchTables = async (schema) => {
    console.log("Schema seleccionado:", schema);
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
                <Label for="schema-select">Seleccionar Schema</Label>
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
                <Label for="table-select">Seleccionar Tabla</Label>
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
