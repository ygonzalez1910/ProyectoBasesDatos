import React, { useState, useEffect, useCallback } from 'react';
import { SeguridadService } from "../../services/api.service";
import { Container, Row, Col, Card, CardHeader, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { FaUserPlus, FaTrash, FaKey, FaShieldAlt } from 'react-icons/fa';

const Seguridad = () => {
  // Estado para la creación de usuario
  const [createUserForm, setCreateUserForm] = useState({
    nombreUsuario: '',
    password: '',
    roles: [],
  });

  const [creatingUser, setCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState(null);

  // Estado para la eliminación de usuario
  const [deleteUserForm, setDeleteUserForm] = useState({
    nombreUsuario: '',
  });

  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState(null);

  // Estado para el cambio de contraseña
  const [changePasswordForm, setChangePasswordForm] = useState({
    nombreUsuario: '',
    nuevoPassword: '',
    bloquear: false
  });

  const [changingPassword, setChangingPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(null);

  // Estado para la creación de rol
  const [createRoleForm, setCreateRoleForm] = useState({
    nombreRol: '',
    esRolExterno: false,
    privilegios: [], // Nuevo campo de privilegios
});


  const [creatingRole, setCreatingRole] = useState(false);
  const [createRoleError, setCreateRoleError] = useState(null);

  const [roles, setRoles] = useState([]);


  const styles = {
    gradient: {
      background: 'linear-gradient(45deg, #2c3e50 0%, #3498db 100%)',
      color: 'white'
    },
    card: {
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important'
      }
    },
    button: {
      padding: '0.5rem 1.5rem',
      borderRadius: '4px',
      fontWeight: '500',
      textTransform: 'none',
      fontSize: '0.9rem',
      boxShadow: 'none',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }
    },
    divider: {
      width: '25%',
      margin: '0 auto',
      borderTop: '2px solid #e3e6f0'
    }
  };

  const cargarRoles = useCallback(async () => {
    try {
      const response = await SeguridadService.listarRoles();

      if (response.data && response.data.resultado) {
        const listaRoles = response.data.roles || [];
        setRoles(listaRoles);
      } else {
        setRoles([]);
      }
    } catch (error) {
      console.error('Error al cargar roles:', error);
      setRoles([]);
    }
  }, []);

  useEffect(() => {
    cargarRoles();
  }, [cargarRoles]);

  const handleInputChange = (event, setter) => {
    const { name, value, checked } = event.target;
    setter((prevState) => ({
      ...prevState,
      [name]: name === 'esRolExterno' ? checked : value,
    }));
  };

  const handleRoleChange = (roleName) => {
    setCreateUserForm(prev => ({
      ...prev,
      roles: prev.roles.includes(roleName)
        ? prev.roles.filter(role => role !== roleName)
        : [...prev.roles, roleName]
    }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setCreatingUser(true);
    setCreateUserError(null);

    try {
      await SeguridadService.crearUsuario(createUserForm);
      // Limpiar el formulario después de un envío exitoso
      setCreateUserForm({
        nombreUsuario: '',
        password: '',
        roles: [],
      });
    } catch (error) {
      setCreateUserError(error.message);
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteUser = async (event) => {
    event.preventDefault();
    setDeletingUser(true);
    setDeleteUserError(null);

    try {
      await SeguridadService.eliminarUsuario(deleteUserForm);
      // Limpiar el formulario después de un envío exitoso
      setDeleteUserForm({
        nombreUsuario: '',
      });
    } catch (error) {
      setDeleteUserError(error.message);
    } finally {
      setDeletingUser(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setChangePasswordError(null);
    try {
      await SeguridadService.cambiarContraseña({
        nombreUsuario: changePasswordForm.nombreUsuario,
        nuevoPassword: changePasswordForm.nuevoPassword,
        bloquear: true
      });
      // Limpiar el formulario después de un envío exitoso
      setChangePasswordForm({
        nombreUsuario: '',
        nuevoPassword: '',
        bloquear: true
      });
    } catch (error) {
      setChangePasswordError(error.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCreateRole = async (event) => {
    event.preventDefault();
    setCreatingRole(true);
    setCreateRoleError(null);

    try {
        await SeguridadService.crearRol({
            nombreRol: createRoleForm.nombreRol,
            privilegios: createRoleForm.privilegios,
        });
        // Limpiar el formulario después de un envío exitoso
        setCreateRoleForm({
            nombreRol: '',
            esRolExterno: false,
            privilegios: [],
        });
    } catch (error) {
        setCreateRoleError(error.message);
    } finally {
        setCreatingRole(false);
    }
};


  const [privilegioActual, setPrivilegioActual] = useState('');

const handleAddPrivilegio = () => {
    if (privilegioActual) {
        setCreateRoleForm((prevForm) => ({
            ...prevForm,
            privilegios: [...prevForm.privilegios, privilegioActual],
        }));
        setPrivilegioActual(''); // Limpiar el campo
    }
};

  const scrollableContainerStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #dee2e6',
    borderRadius: '0.25rem',
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    marginBottom: '0.5rem'
  };

  // Estilo para cada ítem en las listas
  const itemStyle = {
    borderBottom: '1px solid #eee',
    transition: 'background-color 0.2s'
  };

  // Estilo para el último ítem (sin borde inferior)
  const lastItemStyle = {
    ...itemStyle,
    borderBottom: 'none'
  };

  return (
    <Container className="py-5">

      {/* Header con estilo mejorado */}
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Seguridad</h2>
          <p className="text-muted lead">Gestión de usuarios y roles del sistema</p>
          <hr style={styles.divider} className="my-4" />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Crear Usuario */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaUserPlus size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Crear Usuario</CardTitle>
                  <small>Añadir nuevo usuario al sistema</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <Form onSubmit={handleCreateUser}>
                <FormGroup className="mb-3">
                  <Label for="nombreUsuario" className="form-label text-muted">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="nombreUsuario"
                    name="nombreUsuario"
                    placeholder="Ingrese nombre de usuario"
                    value={createUserForm.nombreUsuario}
                    onChange={(e) => handleInputChange(e, setCreateUserForm)}
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="password" className="form-label text-muted">
                    Password
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Ingrese contraseña"
                    value={createUserForm.password}
                    onChange={(e) => handleInputChange(e, setCreateUserForm)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="roles">Roles</Label>
                  <div style={scrollableContainerStyle}>
                    {roles.length === 0 ? (
                      <div className="text-muted">Cargando roles...</div>
                    ) : (
                      roles.map((rol, index) => (
                        <div
                          key={rol.nombreRol}
                          style={index === roles.length - 1 ? lastItemStyle : itemStyle}
                          className="form-check"
                        >
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id={`role-${rol.nombreRol}`}
                            checked={createUserForm.roles.includes(rol.nombreRol)}
                            onChange={() => handleRoleChange(rol.nombreRol)}
                          />
                          <Label
                            className="form-check-label"
                            for={`role-${rol.nombreRol}`}
                          >
                            {rol.nombreRol}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                  {createUserForm.roles.length > 0 && (
                    <small className="text-muted d-block mt-2">
                      Roles seleccionados: {createUserForm.roles.length}
                    </small>
                  )}
                </FormGroup>
                <div className="text-end">
                  <Button
                    type="submit"
                    color="primary"
                    style={styles.button}
                    disabled={creatingUser}
                  >
                    {creatingUser ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creando...
                      </>
                    ) : (
                      'Crear Usuario'
                    )}
                  </Button>
                </div>
                {createUserError && (
                  <Alert color="danger" className="mt-3 mb-0">
                    {createUserError}
                  </Alert>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* Eliminar Usuario */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaTrash size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Eliminar Usuario</CardTitle>
                  <small>Eliminar usuario existente</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <Form onSubmit={handleDeleteUser}>
                <FormGroup className="mb-4">
                  <Label for="deleteUsername" className="form-label text-muted">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="deleteUsername"
                    name="nombreUsuario"
                    placeholder="Ingrese usuario a eliminar"
                    value={deleteUserForm.nombreUsuario}
                    onChange={(e) => handleInputChange(e, setDeleteUserForm)}
                  />
                </FormGroup>
                <div className="text-end">
                  <Button
                    type="submit"
                    color="danger"
                    style={styles.button}
                    disabled={deletingUser}
                  >
                    {deletingUser ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Eliminando...
                      </>
                    ) : (
                      'Eliminar Usuario'
                    )}
                  </Button>
                </div>
                {deleteUserError && (
                  <Alert color="danger" className="mt-3 mb-0">
                    {deleteUserError}
                  </Alert>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* Modificar Usuario */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaKey size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Modificar Usuario</CardTitle>
                  <small>Actualizar contraseña de usuario</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <Form onSubmit={handleChangePassword}>
                <FormGroup className="mb-3">
                  <Label for="changeUsername" className="form-label text-muted">
                    Username
                  </Label>
                  <Input
                    type="text"
                    id="changeUsername"
                    name="nombreUsuario"
                    placeholder="Ingrese nombre de usuario"
                    value={changePasswordForm.nombreUsuario}
                    onChange={(e) => handleInputChange(e, setChangePasswordForm)}
                  />
                </FormGroup>
                <FormGroup className="mb-4">
                  <Label for="nuevoPassword" className="form-label text-muted">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    id="nuevoPassword"
                    name="nuevoPassword"
                    placeholder="Ingrese nueva contraseña"
                    value={changePasswordForm.nuevoPassword}
                    onChange={(e) => handleInputChange(e, setChangePasswordForm)}
                  />
                </FormGroup>
                <div className="text-end">
                  <Button
                    type="submit"
                    color="warning"
                    style={styles.button}
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Actualizando...
                      </>
                    ) : (
                      'Cambiar Contraseña'
                    )}
                  </Button>
                </div>
                {changePasswordError && (
                  <Alert color="danger" className="mt-3 mb-0">
                    {changePasswordError}
                  </Alert>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>

        {/* Crear Rol */}
        <Col lg="6">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaShieldAlt size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">Crear Rol</CardTitle>
                  <small>Añadir nuevo rol al sistema</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <Form onSubmit={handleCreateRole}>
                <FormGroup className="mb-3">
                  <Label for="nombreRol" className="form-label text-muted">
                    Role Name
                  </Label>
                  <Input
                    type="text"
                    id="nombreRol"
                    name="nombreRol"
                    placeholder="Ingrese nombre del rol"
                    value={createRoleForm.nombreRol}
                    onChange={(e) => handleInputChange(e, setCreateRoleForm)}
                  />
                </FormGroup>
                <FormGroup className="mb-3">
                  <Label for="privilegios" className="form-label text-muted">Privilegios</Label>
                  <Input
                      type="text"
                      id="privilegios"
                      name="privilegios"
                      placeholder="Añadir privilegio"
                      value={privilegioActual}
                      onChange={(e) => setPrivilegioActual(e.target.value)}
                  />
                  <Button onClick={handleAddPrivilegio}>Agregar Privilegio</Button>
                  <ul>
                      {createRoleForm.privilegios.map((privilegio, index) => (
                          <li key={index}>{privilegio}</li>
                      ))}
                  </ul>
              </FormGroup>

                <FormGroup check className="mb-4">
                  <Label check className="text-muted">
                    <Input
                      type="checkbox"
                      id="esRolExterno"
                      name="esRolExterno"
                      className="me-2"
                      checked={createRoleForm.esRolExterno}
                      onChange={(e) => handleInputChange(e, setCreateRoleForm)}
                    />
                    External Role
                  </Label>
                </FormGroup>
                <div className="text-end">
                  <Button
                    type="submit"
                    color="success"
                    style={styles.button}
                    disabled={creatingRole}
                  >
                    {creatingRole ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creando...
                      </>
                    ) : (
                      'Crear Rol'
                    )}
                  </Button>
                </div>
                {createRoleError && (
                  <Alert color="danger" className="mt-3 mb-0">
                    {createRoleError}
                  </Alert>
                )}
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );

};

export default Seguridad;