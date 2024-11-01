import React from 'react';
import { Card, CardHeader, CardBody, CardTitle, Table, Spinner, Alert } from 'reactstrap';
import { FaUsers } from 'react-icons/fa';

const UserList = ({ users, loading, error }) => {
  const scrollContainerStyle = {
    maxHeight: 'calc(100vh - 200px)', // Altura ajustable según necesites
    overflowY: 'auto',
    position: 'sticky',
    top: '20px'
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <CardHeader className="py-3" style={{
          background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
          color: 'white'
        }}>
          <div className="d-flex align-items-center">
            <FaUsers size={20} className="me-3" />
            <div>
              <CardTitle tag="h5" className="mb-0">Lista de Usuarios</CardTitle>
              <small>Usuarios registrados</small>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-4 text-center">
          <Spinner color="primary" />
          <p className="text-muted mt-2">Cargando usuarios...</p>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border-0 h-100">
        <CardHeader className="py-3" style={{
          background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
          color: 'white'
        }}>
          <div className="d-flex align-items-center">
            <FaUsers size={20} className="me-3" />
            <div>
              <CardTitle tag="h5" className="mb-0">Lista de Usuarios</CardTitle>
              <small>Usuarios registrados</small>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-4">
          <Alert color="danger" className="mb-0">
            {error}
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-0 h-100">
      <CardHeader className="py-3" style={{
        background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
        color: 'white'
      }}>
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <FaUsers size={20} className="me-3" />
            <div>
              <CardTitle tag="h5" className="mb-0">Lista de Usuarios</CardTitle>
              <small>Total: {users.length}</small>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0" style={scrollContainerStyle}>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.nombreUsuario || index}>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center me-2">
                        {user.nombreUsuario?.charAt(0).toUpperCase()}
                      </div>
                      {user.nombreUsuario}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="text-center py-4 text-gray-500">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  );
};

export default UserList;