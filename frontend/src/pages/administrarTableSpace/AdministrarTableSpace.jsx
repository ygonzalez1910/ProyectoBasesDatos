import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';
import { TableSpaceService } from "../../services/api.service";

const AdministrarTableSpace = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [newSize, setNewSize] = useState('');

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const result = await TableSpaceService.getAllTableSpaces();
        setTables(result.tableSpaces); // Suponiendo que esta es la estructura de la respuesta
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

  const handleEditClick = (table) => {
    setSelectedTable(table);
    setNewSize(table.sizeMB); // Inicializa el nuevo tamaño con el tamaño actual
    toggleModal();
  };

  const handleDeleteClick = async (table) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el tablespace ${table.tableSpaceName}?`);
    if (confirmDelete) {
      try {
        await TableSpaceService.deleteTableSpace(table.tableSpaceName);
        // Actualiza la lista de tablespaces
        setTables(tables.filter(t => t.tableSpaceName !== table.tableSpaceName));
        console.log(`Eliminar: ${table.tableSpaceName}`);
      } catch (error) {
        console.error("Error al eliminar el tablespace:", error);
        setError(error.message);
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedTable) return; // Asegúrate de que haya una tabla seleccionada

    const data = {
      tableSpaceName: selectedTable.tableSpaceName,
      newSizeMB: Number(newSize), // Asegúrate de convertir a número
    };

    try {
      const result = await TableSpaceService.updateSizeTableSpace(data);
      console.log("Respuesta de la API:", result);
      // Actualiza la lista de tablespaces con el nuevo tamaño
      setTables(tables.map(t => 
        t.tableSpaceName === selectedTable.tableSpaceName 
          ? { ...t, sizeMB: newSize } 
          : t
      ));
      toggleModal();
    } catch (error) {
      console.error("Error al modificar el tamaño del tablespace:", error);
      setError(error.message);
    }
  };

  return (
    <Container fluid className="p-4">
      <h1>Gestión de Table Spaces</h1>
      <p>Sistema de gestión de respaldos</p>
      {loading && <p>Cargando...</p>}
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
              <td>{table.autoExtensible}</td>
              <td>{table.maxSizeMB}</td>
              <td>
                <Button color="warning" onClick={() => handleEditClick(table)}>Modificar Tamaño</Button>
                <Button color="danger" onClick={() => handleDeleteClick(table)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal para modificar tamaño */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Modificar Tamaño de {selectedTable?.tableSpaceName}</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="newSize">Nuevo Tamaño (MB)</Label>
            <Input 
              type="number" 
              id="newSize" 
              value={newSize} 
              onChange={(e) => setNewSize(e.target.value)} 
              min="1" // Establecer un mínimo para el tamaño
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveChanges}>Guardar Cambios</Button>
          <Button color="secondary" onClick={toggleModal}>Cancelar</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AdministrarTableSpace;
