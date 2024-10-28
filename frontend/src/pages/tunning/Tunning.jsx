import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardText, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { FiSearch, FiBarChart2 } from 'react-icons/fi';
import { tunningService } from '../../services/api.service';
import Swal from 'sweetalert2';

const Tunning = () => {
  const [loading, setLoading] = useState({
    analysis: false,
    statistics: false
  });

  const [formData, setFormData] = useState({
    sqlQuery: '',
    schema: '',
    nombreTabla: '' // Cambié 'tabla' a 'nombreTabla' para mantener la consistencia
  });

  const [results, setResults] = useState({
    planEjecucion: '',
    estadisticas: null,
    recomendaciones: []
  });

  const [tables, setTables] = useState([]); // Estado para almacenar las tablas

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: '¡Éxito!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6'
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#3085d6'
    });
  };

  const showWarningAlert = (message) => {
    Swal.fire({
      title: 'Advertencia',
      text: message,
      icon: 'warning',
      confirmButtonColor: '#3085d6'
    });
  };

  const handleAnalyzeQuery = async (e) => {
    e.preventDefault();
    if (!formData.sqlQuery.trim()) {
      showWarningAlert('Por favor, ingrese una consulta SQL');
      return;
    }

    try {
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: "Va a analizar la consulta SQL especificada",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, analizar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setLoading(prev => ({ ...prev, analysis: true }));
        const response = await tunningService.analizarConsulta(
          formData.sqlQuery.trim(),
          formData.schema.trim()
        );

        if (response.data.resultado) {
          setResults({
            planEjecucion: response.data.planEjecucion,
            estadisticas: response.data.estadisticas,
            recomendaciones: response.data.recomendacionesOptimizacion
          });
          showSuccessAlert('Análisis completado exitosamente');
        } else {
          showErrorAlert(`Error: ${response.data.errores.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Error al analizar consulta:', error);
      showErrorAlert(`Error en el análisis: ${error.response?.data?.errores?.join(', ') || error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombreTabla") {
      const [schema, table] = value.split("|");
      setFormData((prevData) => ({
        ...prevData,
        schema,
        nombreTabla: table,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleGetStatistics = async (e) => {
    e.preventDefault();
    if (!formData.schema.trim() || !formData.nombreTabla.trim()) {
      showWarningAlert('Por favor, ingrese el nombre del schema y la tabla');
      return;
    }

    try {
      const result = await Swal.fire({
        title: '¿Está seguro?',
        text: `Va a obtener las estadísticas de la tabla ${formData.nombreTabla} del schema ${formData.schema}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, obtener estadísticas',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setLoading(prev => ({ ...prev, statistics: true }));
        const response = await tunningService.obtenerEstadisticasTabla(
          formData.schema.trim(),
          formData.nombreTabla.trim()
        );

        if (response.data.resultado) {
          setResults(prev => ({
            ...prev,
            estadisticas: response.data.estadisticas
          }));
          showSuccessAlert('Estadísticas obtenidas exitosamente');
        } else {
          showErrorAlert(`Error: ${response.data.errores.join(', ')}`);
        }
      }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      showErrorAlert(`Error al obtener estadísticas: ${error.response?.data?.errores?.join(', ') || error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, statistics: false }));
    }
  };

  // Cargar la lista de tablas al montar el componente
useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await tunningService.obtenerListaTablas(formData.schema); // Pasamos schema desde formData
        if (response.data.resultado) {
          setTables(response.data.tablas); // Asumiendo que 'tablas' es la propiedad que contiene la lista
        } else {
          showErrorAlert(`Error: ${response.data.errores.join(', ')}`);
        }
      } catch (error) {
        console.error('Error al obtener tablas:', error);
        showErrorAlert(`Error al obtener tablas: ${error.message}`);
      }
    };
  
    fetchTables();
  }, [formData.schema]); // Ahora depende de formData.schema
  


  return (
    <>
      <h2 className="mb-4">Análisis y Tunning de Consultas</h2>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5">
                <FiSearch className="me-2" />
                Análisis de Consulta SQL
              </CardTitle>
              <CardText>
                Analiza el plan de ejecución y obtén recomendaciones de optimización.
              </CardText>
              <Form onSubmit={handleAnalyzeQuery}>
                <FormGroup>
                  <Label for="sqlQuery">Consulta SQL</Label>
                  <Input
                    type="textarea"
                    id="sqlQuery"
                    value={formData.sqlQuery}
                    onChange={(e) => setFormData(prev => ({ ...prev, sqlQuery: e.target.value }))}
                    placeholder="Ingrese su consulta SQL"
                    rows="4"
                    className="mb-3"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="schemaName">Schema</Label>
                  <Input
                    type="select"
                    name="schema"
                    id="schemaName"
                    value={formData.schema}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un schema</option>
                    {/* Agrega opciones de schema aquí */}
                  </Input>
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  disabled={loading.analysis}
                >
                  <FiSearch className="me-2" />
                  {loading.analysis ? 'Analizando...' : 'Analizar Consulta'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5">
                <FiBarChart2 className="me-2" />
                Estadísticas de Tabla
              </CardTitle>
              <CardText>
                Obtén estadísticas detalladas de una tabla específica.
              </CardText>
              <Form onSubmit={handleGetStatistics}>
                <FormGroup>
                  <Label for="statsSchemaName">Schema</Label>
                  <Input
                    type="select"
                    name="schema"
                    id="statsSchemaName"
                    value={formData.schema}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un schema</option>
                    {/* Agrega opciones de schema aquí */}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="tableName">Tabla</Label>
                  <Input
                    type="select"
                    name="nombreTabla"
                    id="nombreTabla"
                    value={`${formData.schema}|${formData.nombreTabla}`}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una tabla</option>
                    {tables.map((table, index) => (
                      <option
                        key={index}
                        value={`${table.schemaName}|${table.tableName}`}
                      >
                        {table.schemaName}.{table.tableName}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  disabled={loading.statistics}
                >
                  <FiBarChart2 className="me-2" />
                  {loading.statistics ? 'Obteniendo...' : 'Obtener Estadísticas'}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Aquí podrías renderizar los resultados y estadísticas si existen */}
      <Row>
        <Col>
          {/* Renderiza resultados y estadísticas aquí */}
        </Col>
      </Row>
    </>
  );
};

export default Tunning;
