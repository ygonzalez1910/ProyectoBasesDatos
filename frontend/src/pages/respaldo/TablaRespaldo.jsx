import React from 'react';
import { Container, Table } from 'reactstrap';

const TablaRespaldo = () => {
  return (
    <Container fluid className="p-4">
      <h1>Tabla de Respaldos</h1>
      <Table striped>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Respaldo_001</td>
            <td>2024-10-24</td>
            <td>Completado</td>
          </tr>
          {/* Agrega más filas según necesites */}
        </tbody>
      </Table>
    </Container>
  );
};

export default TablaRespaldo;