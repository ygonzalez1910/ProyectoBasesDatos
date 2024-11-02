import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "reactstrap";
import { FaDatabase } from "react-icons/fa";
import { TableSpaceService } from "../../services/api.service";
import Swal from "sweetalert2"; // Importar SweetAlert2
import { Spinner } from "reactstrap"; // Importar Spinner de reactstrap

const AdministrarTableSpace = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [results, setResults] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newSize, setNewSize] = useState("");
  const [newTableSpaceName, setNewTableSpaceName] = useState("");
  const [newDataFileName, setNewDataFileName] = useState(
    "C:\\ORACLE_FILES\\HD1"
  );
  const [newInitialSize, setNewInitialSize] = useState(0);
  const [newAutoExtendSize, setNewAutoExtendSize] = useState(0);
  const [newMaxSize, setNewMaxSize] = useState(0);
  const [userPassword, setUserPassword] = useState(""); // Nuevo estado para la contraseña

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

  useEffect(() => {
    fetchTables();
  }, []);

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleCreateModal = () => {
    setCreateModal(!createModal);
  };

  const handleEditClick = (table) => {
    setSelectedTable(table);
    setNewSize(table.sizeMB);
    toggleModal();
  };

  const handleDeleteClick = async (table) => {
    const confirmDelete = await Swal.fire({
      title: `¿Estás seguro de que deseas eliminar el tablespace ${table.tableSpaceName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await TableSpaceService.deleteTableSpace(table.tableSpaceName);
        setTables(
          tables.filter((t) => t.tableSpaceName !== table.tableSpaceName)
        );
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: `El tablespace ${table.tableSpaceName} ha sido eliminado.`,
        });
      } catch (error) {
        console.error("Error al eliminar el tablespace:", error);
        setError(error.message);
        Swal.fire({
          icon: "error",
          title: "¡Error!",
          text: error.message || "Ocurrió un error al eliminar el tablespace.",
        });
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedTable) return;

    const data = {
      tableSpaceName: selectedTable.tableSpaceName,
      newSizeMB: Number(newSize),
    };

    try {
      const result = await TableSpaceService.updateSizeTableSpace(data);
      setTables(
        tables.map((t) =>
          t.tableSpaceName === selectedTable.tableSpaceName
            ? { ...t, sizeMB: newSize }
            : t
        )
      );
      toggleModal();
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: `El tamaño del tablespace ${selectedTable.tableSpaceName} ha sido modificado.`,
      });
    } catch (error) {
      console.error("Error al modificar el tamaño del tablespace:", error);
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text:
          error.message ||
          "Ocurrió un error al modificar el tamaño del tablespace.",
      });
    }
  };

  const fetchTables = async () => {
    setLoading(true);
    try {
      const result = await TableSpaceService.getAllTableSpaces();
      setTables(result.tableSpaces);
      setResults(result.tableSpaces);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTableSpace = async () => {
    setLoading(true);

    const data = {
      tableSpaceName: newTableSpaceName,
      dataFileName: newDataFileName,
      initialSizeMB: newInitialSize,
      autoExtendSizeMB: newAutoExtendSize,
      maxSizeMB: newMaxSize,
      userPassword: userPassword, // Agregar la contraseña al objeto de datos
    };

    try {
      console.log("data: ", data);
      const result = await TableSpaceService.createTableSpace(data);
      console.log("Respuesta de la API:", result);

      // Llama nuevamente a fetchTables para actualizar la lista
      await fetchTables();

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Tablespace creado correctamente.",
      });

      toggleCreateModal();
      // Reinicia los valores del formulario
      setNewTableSpaceName("");
      setNewDataFileName("C:\\ORACLE_FILES\\HD1");
      setNewInitialSize(0);
      setNewAutoExtendSize(0);
      setNewMaxSize(0);
      setUserPassword(""); // Reiniciar la contraseña
    } catch (error) {
      console.error("Error al crear el tablespace:", error);
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: error.message || "Ocurrió un error al crear el tablespace.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      {/* Header mejorado */}
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Gestión de Table Spaces</h2>
          <p className="text-muted lead">
            Sistema de gestión de Almacenaje de Schemas
          </p>
        </Col>
      </Row>
      <Button
        color="success"
        onClick={toggleCreateModal}
        className="mb-3 px-3 py-2 rounded-2 shadow-sm border-0 text-white position-relative overflow-hidden transition-all hover:brightness-110 active:scale-95"
        style={{
          backgroundColor: "#28C76F",
          transition: "all 0.2s ease",
          fontSize: "0.875rem",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="me-1"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Crear Tablespace
        </div>
      </Button>
      {loading && <Spinner color="primary" />}
      {error && <p>Error: {error}</p>}
      <Card className="shadow-sm h-100 border-0" style={styles.card}>
        <CardHeader className="py-3" style={styles.gradient}>
          <div className="d-flex align-items-center">
            <FaDatabase size={20} className="me-3" />
            <div>
              <CardTitle tag="h5" className="mb-0">
                Tabla de Tablespaces
              </CardTitle>
              <small>Registros encontrados: {results.length}</small>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="table-responsive">
            <Table hover bordered striped className="mb-0">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-x border-gray-100"
                    style={{
                      backgroundColor: "#F8F9FA",
                      fontSize: "0.8rem",
                      letterSpacing: "0.03em",
                      lineHeight: "1.2",
                      maxWidth: "120px",
                      wordWrap: "break-word",
                    }}
                  >
                    Nombre de Tablespace
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-x border-gray-100"
                    style={{
                      backgroundColor: "#F8F9FA",
                      fontSize: "0.8rem",
                      letterSpacing: "0.03em",
                      lineHeight: "1.2",
                      maxWidth: "120px",
                      wordWrap: "break-word",
                    }}
                  >
                    Nombre de Archivo
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-x border-gray-100"
                    style={{
                      backgroundColor: "#F8F9FA",
                      fontSize: "0.8rem",
                      letterSpacing: "0.03em",
                      lineHeight: "1.2",
                      minWidth: "80px",
                      wordWrap: "break-word",
                    }}
                  >
                    Tamaño (MB)
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-x border-gray-100"
                    style={{
                      backgroundColor: "#F8F9FA",
                      fontSize: "0.8rem",
                      letterSpacing: "0.03em",
                      lineHeight: "1.2",
                      maxWidth: "100px",
                      wordWrap: "break-word",
                    }}
                  >
                    Auto extensible
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-x border-gray-100"
                    style={{
                      backgroundColor: "#F8F9FA",
                      fontSize: "0.8rem",
                      letterSpacing: "0.03em",
                      lineHeight: "1.2",
                      maxWidth: "100px",
                      wordWrap: "break-word",
                    }}
                  >
                    Tamaño Máximo (MB)
                  </th>
                  <th
                    className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-x border-gray-100"
                    style={{
                      backgroundColor: "#F8F9FA",
                      fontSize: "0.8rem",
                      letterSpacing: "0.03em",
                      lineHeight: "1.2",
                      minWidth: "100px",
                      wordWrap: "break-word",
                    }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table, index) => (
                  <tr key={index}>
                    <td className="text-center">{table.tableSpaceName}</td>
                    <td className="text-center">{table.fileName}</td>
                    <td className="text-center">{table.sizeMB}</td>
                    <td className="text-center">
                      {table.autoExtensible ? "Sí" : "No"}
                    </td>
                    <td className="text-center">{table.maxSizeMB}</td>
                    <td className="d-flex justify-content-center gap-1">
                      <Button
                        color="warning"
                        className="btn-sm px-2 py-1 rounded-2 shadow-sm border-0 text-white position-relative overflow-hidden transition-all hover:brightness-110 active:scale-95"
                        style={{
                          backgroundColor: "#FF9F43",
                          transition: "all 0.2s ease",
                          fontSize: "0.75rem",
                        }}
                        onClick={() => handleEditClick(table)} // Añade esta línea
                      >
                        <div className="d-flex align-items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="me-1"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Modificar
                        </div>
                      </Button>

                      <Button
                        color="danger"
                        className="btn-sm px-2 py-1 rounded-2 shadow-sm border-0 text-white position-relative overflow-hidden transition-all hover:brightness-110 active:scale-95"
                        onClick={() => handleDeleteClick(table)}
                        style={{
                          backgroundColor: "#FF4757",
                          transition: "all 0.2s ease",
                          fontSize: "0.75rem",
                        }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="me-1"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Eliminar
                        </div>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
      {/* Modal para modificar tamaño */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Modificar Tamaño de {selectedTable?.tableSpaceName}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="newSize">Nuevo Tamaño (MB)</Label>
            <Input
              type="number"
              id="newSize"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              min="1"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal para crear tablespace */}
      <Modal isOpen={createModal} toggle={toggleCreateModal}>
        <ModalHeader toggle={toggleCreateModal}>
          Crear nuevo Tablespace
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="tableSpaceName">Nombre de Tablespace</Label>
            <Input
              type="text"
              id="tableSpaceName"
              value={newTableSpaceName}
              onChange={(e) => setNewTableSpaceName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="userPassword">Contraseña</Label>{" "}
            {/* Nuevo campo de contraseña */}
            <Input
              type="password"
              id="userPassword"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              required // Puedes agregar required si quieres que sea obligatorio
            />
          </FormGroup>
          <FormGroup>
            <Label for="dataFileName">Nombre del Archivo de Datos</Label>
            <Input
              type="select"
              id="dataFileName"
              value={newDataFileName}
              onChange={(e) => setNewDataFileName(e.target.value)}
            >
              <option value="C:\\ORACLE_FILES\\HD1">C:\ORACLE_FILES\HD1</option>
              <option value="C:\\ORACLE_FILES\\HD2">C:\ORACLE_FILES\HD2</option>
              <option value="C:\\ORACLE_FILES\\HD3">C:\ORACLE_FILES\HD3</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="initialSize">Tamaño Inicial (MB)</Label>
            <Input
              type="number"
              id="initialSize"
              value={newInitialSize}
              onChange={(e) => setNewInitialSize(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <Label for="autoExtendSize">Tamaño Autoextensión (MB)</Label>
            <Input
              type="number"
              id="autoExtendSize"
              value={newAutoExtendSize}
              onChange={(e) => setNewAutoExtendSize(Number(e.target.value))}
            />
          </FormGroup>
          <FormGroup>
            <Label for="maxSize">Tamaño Máximo (MB)</Label>
            <Input
              type="number"
              id="maxSize"
              value={newMaxSize}
              onChange={(e) => setNewMaxSize(Number(e.target.value))}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCreateTableSpace}>
            Crear Tablespace
          </Button>
          <Button color="secondary" onClick={toggleCreateModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdministrarTableSpace;
