import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Database, Table2, BarChart3, AlertTriangle } from "lucide-react";
import {
  PerformanceService,
  SchemasService,
  tunningService,
} from "../../services/api.service";

const Performance = () => {
  const [indices, setIndices] = useState([]);
  const [tablas, setTablas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [estadisticas, setEstadisticas] = useState(null);
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
  const [schemas, setSchemas] = useState([]); // Inicializa como un array vacío
  const [error, setError] = useState(null); // Para manejar errores
  const [nuevoIndice, setNuevoIndice] = useState({
    nombreIndice: "",
    nombreTabla: "",
    nombreSchema: "",
    columnas: "",
    esUnico: false,
  });
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga

  // Cargar esquemas al iniciar
  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await SchemasService.getAllSchemas();
      console.log(response.schemas); // Verifica que esto esté dando la respuesta esperada
      setSchemas(response.schemas); // Aquí se establecen los schemas
    } catch (error) {
      console.error("Error al obtener la lista de schemas:", error);
      setError("Error al obtener la lista de schemas");
    }
  };

  // Cargar tablas cuando se selecciona un schema
  useEffect(() => {
    if (selectedSchema) {
      fetchTables(selectedSchema);
    }
  }, [selectedSchema]);

  const fetchTables = async (schema) => {
    try {
      setLoading(true);
      const response = await tunningService.obtenerTablasPorSchema(schema);
      if (response.data && response.data.tablas) {
        setTablas(response.data.tablas);
      } else {
        setError("No se encontraron tablas para este schema");
        setTablas([]);
      }
    } catch (error) {
      console.error("Error al obtener las tablas:", error);
      setError("Error al obtener las tablas del schema");
      setTablas([]);
    } finally {
      setLoading(false);
    }
  };

  const listarIndices = async (tabla, schema) => {
    try {
      const response = await PerformanceService.listarIndices({
        nombreTabla: tabla,
        nombreSchema: schema,
      });
      setIndices(response.data || []);
    } catch (error) {
      console.error("Error al listar índices:", error);
      mostrarMensaje("Error al listar índices: " + error.message, "danger");
    }
  };

  const mostrarMensaje = (text, type) => {
    setMensaje({ text, type });
    setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
  };

  const obtenerEstadisticas = async (tabla, indice, schema) => {
    try {
      const response = await PerformanceService.obtenerEstadisticasIndice({
        nombreTabla: tabla,
        nombreIndice: indice,
        nombreSchema: schema,
      });
      setEstadisticas(response.data);
    } catch (error) {
      mostrarMensaje(
        "Error al obtener estadísticas: " + error.message,
        "danger"
      );
    }
  };

  const crearIndice = async (e) => {
    e.preventDefault();
    try {
      await PerformanceService.crearIndice({
        ...nuevoIndice,
        columnas: nuevoIndice.columnas.split(",").map((col) => col.trim()),
      });
      mostrarMensaje("Índice creado exitosamente", "success");
      listarIndices(nuevoIndice.nombreTabla, nuevoIndice.nombreSchema);
      setNuevoIndice({
        nombreIndice: "",
        nombreTabla: "",
        nombreSchema: "",
        columnas: "",
        esUnico: false,
      });
    } catch (error) {
      mostrarMensaje("Error al crear índice: " + error.message, "danger");
    }
  };

  const eliminarIndice = async (tabla, indice, schema) => {
    if (window.confirm(`¿Está seguro de eliminar el índice ${indice}?`)) {
      try {
        await PerformanceService.eliminarIndice({
          nombreTabla: tabla,
          nombreIndice: indice,
          nombreSchema: schema,
        });
        mostrarMensaje("Índice eliminado exitosamente", "success");
        listarIndices(tabla, schema);
      } catch (error) {
        mostrarMensaje("Error al eliminar índice: " + error.message, "danger");
      }
    }
  };

  const handleSchemaChange = (e) => {
    const schema = e.target.value;
    setSelectedSchema(schema);
    setSelectedTable(''); // Resetea la tabla seleccionada al cambiar el schema
    setTablas([]); // Resetea las tablas al cambiar el schema
    setNuevoIndice(prev => ({
      ...prev,
      nombreSchema: schema,
      nombreTabla: ''
    }));
  };
  

  const handleTableChange = (e) => {
    const tabla = e.target.value;
    setSelectedTable(tabla);
    setNuevoIndice((prev) => ({
      ...prev,
      nombreTabla: tabla,
    }));
    listarIndices(tabla, selectedSchema);
  };

  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Card className="mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Gestión de Performance
              </h1>
              <p className="text-lg opacity-90">
                Administración de Índices de Base de Datos
              </p>
            </div>
            <Database className="h-16 w-16 opacity-80" />
          </div>
        </CardBody>
      </Card>

      {mensaje.text && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            mensaje.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <AlertTriangle className="h-5 w-5" />
          {mensaje.text}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
          <AlertTriangle className="h-5 w-5 inline-block" />
          {error}
        </div>
      )}

      <Row className="mb-4">
        <Col md="6">
          <Card className="shadow-lg h-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Table2 className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Crear Nuevo Índice
                </h2>
              </div>
              <form onSubmit={crearIndice} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Schema
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.nombreSchema}
                    onChange={handleSchemaChange}
                    required
                  >
                    <option value="">Seleccione un schema</option>
                    {schemas.map((schema, idx) => (
                      <option key={idx} value={schema.schemaName}> {/* Acceder al schemaName */}
                        {schema.schemaName} {/* Mostrar el schemaName */}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tabla
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.nombreSchema} // Este debe ser el estado que se está usando
                    onChange={handleSchemaChange}
                    required
                  >
                    <option value="">Seleccione un schema</option>
                    {schemas.map((schema, idx) => (
                      <option key={idx} value={schema.schemaName}> {/* Cambiado aquí */}
                        {schema.schemaName} {/* Cambiado aquí */}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre del Índice
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.nombreIndice}
                    onChange={(e) =>
                      setNuevoIndice({
                        ...nuevoIndice,
                        nombreIndice: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Columnas (separadas por comas)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.columnas}
                    onChange={(e) =>
                      setNuevoIndice({
                        ...nuevoIndice,
                        columnas: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nuevoIndice.esUnico}
                    onChange={(e) =>
                      setNuevoIndice({
                        ...nuevoIndice,
                        esUnico: e.target.checked,
                      })
                    }
                  />
                  <span className="ml-2 text-gray-700">¿Es único?</span>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Índice
                </button>
              </form>
            </CardBody>
          </Card>
        </Col>

        {/* Section to show existing indices */}
        <Col md="6">
          <Card className="shadow-lg h-100">
            <CardBody className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">
                  Índices de la Tabla
                </h2>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Seleccione una tabla para ver índices
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={selectedTable}
                  onChange={(e) => handleTableChange(e)}
                >
                  <option value="">Seleccione una tabla</option>
                  {tablas.map((tabla, idx) => (
                    <option key={idx} value={tabla}>
                      {tabla}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                {loading ? (
                  <p>Cargando índices...</p>
                ) : (
                  <ul className="space-y-2">
                    {indices.length > 0 ? (
                      indices.map((indice, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center border-b pb-2"
                        >
                          <span className="text-gray-700">{indice.nombre}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                obtenerEstadisticas(
                                  selectedTable,
                                  indice.nombre,
                                  selectedSchema
                                )
                              }
                              className="text-blue-500 hover:underline"
                            >
                              Ver Estadísticas
                            </button>
                            <button
                              onClick={() =>
                                eliminarIndice(
                                  selectedTable,
                                  indice.nombre,
                                  selectedSchema
                                )
                              }
                              className="text-red-500 hover:underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No hay índices para mostrar.</p>
                    )}
                  </ul>
                )}
              </div>
              {estadisticas && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">
                    Estadísticas del Índice
                  </h3>
                  <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(estadisticas, null, 2)}
                  </pre>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Performance;
