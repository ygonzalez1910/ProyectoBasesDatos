import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { Database, Table2, BarChart3, AlertTriangle } from "lucide-react";
import {
  PerformanceService,
  SchemasService,
  tunningService,
} from "../../services/api.service";

const Performance = () => {
  const [indices, setIndices] = useState([]);
  const [filteredIndices, setFilteredIndices] = useState([]);
  const [selectedSchemaCrearIndice, setSelectedSchemaCrearIndice] = useState(""); // Esquema para crear índice
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
  const [schemas, setSchemas] = useState([]);
  const [nuevoIndice, setNuevoIndice] = useState({
    nombreIndice: "",
    nombreTabla: "",
    nombreSchema: "",
    columnas: "",
    esUnico: false,
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para la modal de estadísticas
  const [modalEstadisticas, setModalEstadisticas] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);

  // Cargar esquemas al iniciar
  useEffect(() => {
    fetchSchemas();
    fetchAllIndices();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await SchemasService.getAllSchemas();
      console.log("Schemas:", response.schemas);
      setSchemas(response.schemas);
    } catch (error) {
      console.error("Error al obtener la lista de schemas:", error);
    }
  };

  const fetchAllIndices = async () => {
    setLoading(true);
    try {
      const response = await PerformanceService.verTodosIndices();
      if (response.exito) {
        console.log("Índices:", response.indices);
        setIndices(response.indices);
        setFilteredIndices(response.indices); // Inicialmente, se muestra todos los índices
      } else {
        mostrarMensaje("Error al obtener índices: " + response.mensaje, "danger");
      }
    } catch (error) {
      console.error("Error al listar índices:", error);
      mostrarMensaje("Error al obtener índices: " + error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (text, type) => {
    setMensaje({ text, type });
    setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
  };

  const crearIndice = async (e) => {
    e.preventDefault();
    try {
      await PerformanceService.crearIndice({
        ...nuevoIndice,
        columnas: nuevoIndice.columnas.split(",").map((col) => col.trim()),
      });
      mostrarMensaje("Índice creado exitosamente", "success");
      fetchAllIndices(); // Refresca la lista de índices después de crear uno nuevo
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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filtrar índices según el término de búsqueda
    const filtered = indices.filter((indice) =>
      indice.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredIndices(filtered);
  };

  const handleShowStatistics = async (indice) => {
    console.log(`Mostrar estadísticas para el índice: ${indice}`);
    try {
      const response = await PerformanceService.obtenerEstadisticasIndice({ nombreIndice: indice });
      if (response.exito) {
        setEstadisticas(response.estadisticas);
        setModalEstadisticas(true);
      } else {
        mostrarMensaje("Error al obtener estadísticas: " + response.mensaje, "danger");
      }
    } catch (error) {
      mostrarMensaje("Error al obtener estadísticas: " + error.message, "danger");
    }
  };

  const toggleModal = () => {
    setModalEstadisticas(!modalEstadisticas);
  };

  return (
    <Container fluid className="p-4">
      {/* Header Section */}
      <Card className="mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Performance</h1>
              <p className="text-lg opacity-90">Administración de Índices de Base de Datos</p>
            </div>
            <Database className="h-16 w-16 opacity-80" />
          </div>
        </CardBody>
      </Card>

      {mensaje.text && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${mensaje.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          <AlertTriangle className="h-5 w-5" />
          {mensaje.text}
        </div>
      )}

      <Row className="mb-4">
        {/* Card para Crear Nuevo Índice */}
        <Col md="6">
          <Card className="shadow-lg h-100" style={{ height: '400px' }}>
            <CardBody className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-4">
                <Table2 className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Crear Nuevo Índice</h2>
              </div>
              <form onSubmit={crearIndice} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Schema</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.nombreSchema}
                    onChange={(e) => setSelectedSchemaCrearIndice(e.target.value)}
                    required
                  >
                    <option value="">Seleccione un schema</option>
                    {schemas.map((schema, idx) => (
                      <option key={idx} value={schema.schemaName}>
                        {schema.schemaName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Tabla</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.nombreTabla}
                    onChange={(e) => setNuevoIndice({ ...nuevoIndice, nombreTabla: e.target.value })}
                    required
                  >
                    <option value="">Seleccione una tabla</option>
                    {/* Aquí se deben agregar las tablas correspondientes */}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Nombre del Índice</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.nombreIndice}
                    onChange={(e) => setNuevoIndice({ ...nuevoIndice, nombreIndice: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Columnas (separadas por comas)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={nuevoIndice.columnas}
                    onChange={(e) => setNuevoIndice({ ...nuevoIndice, columnas: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={nuevoIndice.esUnico}
                    onChange={(e) => setNuevoIndice({ ...nuevoIndice, esUnico: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Índice Único</label>
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Crear Índice
                </button>
              </form>
            </CardBody>
          </Card>
        </Col>

        {/* Card para Ver Índices */}
        <Col md="6">
          <Card className="shadow-lg h-100" style={{ height: '400px' }}>
            <CardBody className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Índices</h2>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              {loading ? (
                <p>Cargando índices...</p>
              ) : (
                <table className="min-w-full table-auto border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2">Índice</th>
                      <th className="border border-gray-300 p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIndices.map((indice, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-100">
                        <td className="border border-gray-300 p-2">{indice}</td>
                        <td className="border border-gray-300 p-2">
                          <button
                            onClick={() => handleShowStatistics(indice)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                            Estadísticas
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Modal para mostrar estadísticas */}
      <Modal isOpen={modalEstadisticas} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Estadísticas del Índice</ModalHeader>
        <ModalBody>
          {estadisticas ? (
            <table className="min-w-full table-auto border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Campo</th>
                  <th className="border border-gray-300 p-2">Valor</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(estadisticas).map(([key, value]) => (
                  <tr key={key} className="border-b hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{key}</td>
                    <td className="border border-gray-300 p-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay estadísticas disponibles.</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default Performance;
