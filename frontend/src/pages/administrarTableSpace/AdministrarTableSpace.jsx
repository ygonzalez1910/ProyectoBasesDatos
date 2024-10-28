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
} from "reactstrap";
import { TableSpaceService } from "../../services/api.service";
import Swal from "sweetalert2"; // Importar SweetAlert2
import { Spinner } from "reactstrap"; // Importar Spinner de reactstrap

const AdministrarTableSpace = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
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

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const result = await TableSpaceService.getAllTableSpaces();
        setTables(result.tableSpaces);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
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
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el tablespace ${table.tableSpaceName}?`
    );
    if (confirmDelete) {
      try {
        await TableSpaceService.deleteTableSpace(table.tableSpaceName);
        setTables(
          tables.filter((t) => t.tableSpaceName !== table.tableSpaceName)
        );
      } catch (error) {
        console.error("Error al eliminar el tablespace:", error);
        setError(error.message);
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
    } catch (error) {
      console.error("Error al modificar el tamaño del tablespace:", error);
      setError(error.message);
    }
  };

  const handleCreateTableSpace = async () => {
    // Inicia el spinner de carga
    setLoading(true);

    const data = {
      tableSpaceName: newTableSpaceName,
      dataFileName: newDataFileName,
      initialSizeMB: newInitialSize,
      autoExtendSizeMB: newAutoExtendSize,
      maxSizeMB: newMaxSize,
    };

    try {
      console.log("data: ", data);
      const result = await TableSpaceService.createTableSpace(data);
      console.log("Respuesta de la API:", result);
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
    } catch (error) {
      console.error("Error al crear el tablespace:", error);
      setError(error.message);
      Swal.fire({
        icon: "error",
        title: "¡Error!",
        text: error.message || "Ocurrió un error al crear el tablespace.",
      });
    } finally {
      // Detiene el spinner de carga
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <h1>Gestión de Table Spaces</h1>
      <p>Sistema de gestión de respaldos</p>
      <Button color="success" onClick={toggleCreateModal} className="mb-3">
        Crear Tablespace
      </Button>
      {loading && <Spinner color="primary" />}
      {error && <p>Error: {error}</p>}
      <Table striped>
        <thead>
          <tr>
            <th>Nombre de Tablespace</th>
            <th>Nombre de Archivo</th>
            <th>Tamaño (MB)</th>
            <th>Autoextensible</th>
            <th>Tamaño Máximo (MB)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <tr key={index}>
              <td>{table.tableSpaceName}</td>
              <td>{table.fileName}</td>
              <td>{table.sizeMB}</td>
              <td>{table.autoExtensible ? "Sí" : "No"}</td>
              <td>{table.maxSizeMB}</td>
              <td className="d-flex justify-content-start">
                <Button
                  color="warning"
                  className="me-1 btn-sm"
                  onClick={() => handleEditClick(table)}
                >
                  Modificar Tamaño
                </Button>
                <Button
                  color="danger"
                  className="btn-sm"
                  onClick={() => handleDeleteClick(table)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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
            <Label for="autoExtendSize">Tamaño de Autoextensión (MB)</Label>
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
