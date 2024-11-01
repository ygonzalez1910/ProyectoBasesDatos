import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  Table,
} from "reactstrap";
import { FaFolderPlus, FaTrash, FaSearch } from "react-icons/fa";
import { AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";
import { DirectorioService, RespaldoService } from "../../services/api.service";

const AdministrarDirectorio = () => {
  const [directorios, setDirectorios] = useState([]);
  const [nuevoDirectorio, setNuevoDirectorio] = useState({
    nombreDirectorio: "",
    directorio: "",
  });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ text: "", type: "" });
  const [filtro, setFiltro] = useState(""); // Estado para el filtro
  const styles = {
    gradient: {
      background: "linear-gradient(45deg, #2c3e50 0%, #3498db 100%)",
      color: "white",
    },
    card: {
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important",
      },
    },
    button: {
      padding: "0.5rem 1.5rem",
      borderRadius: "4px",
      fontWeight: "500",
      textTransform: "none",
      fontSize: "0.9rem",
      boxShadow: "none",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    },
    divider: {
      width: "25%",
      margin: "0 auto",
      borderTop: "2px solid #e3e6f0",
    },
  };
  // Cargar directorios al iniciar
  useEffect(() => {
    fetchDirectorios();
  }, []);

  const fetchDirectorios = async () => {
    setLoading(true);
    try {
      const response = await RespaldoService.getAllRespaldos();
      setDirectorios(response.directorios);
    } catch (error) {
      mostrarMensaje("Error al cargar directorios: " + error.message, "danger");
    } finally {
      setLoading(false);
    }
  };

  const crearDirectorio = async (e) => {
    e.preventDefault();
    try {
      await DirectorioService.crearDirectorio(nuevoDirectorio);
      mostrarMensaje("Directorio creado exitosamente", "success");
      fetchDirectorios(); // Refresca la lista
      setNuevoDirectorio({ nombreDirectorio: "", directorio: "" }); // Limpiar el formulario
    } catch (error) {
      mostrarMensaje("Error al crear directorio: " + error.message, "danger");
    }
  };

  const eliminarDirectorio = async (nombreDirectorio) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar el directorio "${nombreDirectorio}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminarlo",
    });

    if (result.isConfirmed) {
      try {
        console.log("Eliminando directorio: ", nombreDirectorio);
        await DirectorioService.eliminarDirectorio(nombreDirectorio);
        mostrarMensaje("Directorio eliminado exitosamente", "success");
        fetchDirectorios(); // Refresca la lista
      } catch (error) {
        mostrarMensaje(
          "Error al eliminar directorio: " + error.message,
          "danger"
        );
      }
    }
  };

  const mostrarMensaje = (text, type) => {
    setMensaje({ text, type });
    setTimeout(() => setMensaje({ text: "", type: "" }), 3000);
  };

  // Filtrar directorios basado en el valor del filtro
  const directoriosFiltrados = directorios.filter(
    (directorio) =>
      directorio.nombreDirectorio
        .toLowerCase()
        .includes(filtro.toLowerCase()) || // Filtra por nombre
      directorio.direccionDirectorio
        .toLowerCase()
        .includes(filtro.toLowerCase()) // Filtra por dirección
  );

  return (
    <Container className="py-5">
      {/* Header mejorado */}
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Gestión de Directorios</h2>
          <p className="text-muted lead">Sistema de gestión de directorios</p>
          <hr style={styles.divider} className="my-4" />
        </Col>
      </Row>
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

      <Row>
        <Col md="4">
          <Card className="shadow-lg h-100" style={{ height: "400px" }}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaFolderPlus size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">
                    Crear Nuevo Directorio
                  </CardTitle>
                  <small>Complete los campos para crear un nuevo Directorio</small>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={crearDirectorio}>
                <div className="mb-3">
                  <label className="form-label">Nombre del Directorio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoDirectorio.nombreDirectorio}
                    onChange={(e) =>
                      setNuevoDirectorio({
                        ...nuevoDirectorio,
                        nombreDirectorio: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dirección del Directorio</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nuevoDirectorio.directorio}
                    onChange={(e) =>
                      setNuevoDirectorio({
                        ...nuevoDirectorio,
                        directorio: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Crear Directorio
                </button>
              </form>
            </CardBody>
          </Card>
        </Col>

        <Col md="8">
          <Card className="shadow-lg h-100" style={{ height: "400px" }}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaSearch size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">
                    Directorios
                  </CardTitle>
                  <small>Visualizar directorios</small>
                </div>
              </div>
            </CardHeader>
            <CardBody>
              {/* Campo de filtro sobre la tabla */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar directorio..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)} // Actualiza el estado del filtro
                />
              </div>
              {loading ? (
                <p>Cargando directorios...</p>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <Table striped className="table-sm" responsive>
                    <thead>
                      <tr>
                        <th>Nombre del Directorio</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
    {directoriosFiltrados.map((directorio, index) => (
      <tr 
        key={index}
        className="hover:bg-gray-50 transition-colors"
      >
        <td 
          className="px-3 py-2 text-center border-b border-gray-100"
          style={{ 
            
            color: '#4B5563'
          }}
        >
          {directorio.nombreDirectorio}
        </td>
        <td 
          className="px-3 py-2 text-center border-b border-gray-100"
          style={{ 
            fontSize: '0.75rem',
            color: '#4B5563'
          }}
        >
          {directorio.direccionDirectorio}
        </td>
        <td className="px-3 py-2 text-center border-b border-gray-100">
          <Button
            color="danger"
            onClick={() => eliminarDirectorio(directorio.nombreDirectorio)}
            className="p-1 rounded-lg shadow-sm border-0 text-white position-relative overflow-hidden transition-all hover:brightness-110 active:scale-95"
            style={{
              backgroundColor: '#FF4757',
              transition: 'all 0.2s ease',
              width: '24px',
              height: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
                  </Table>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdministrarDirectorio;
