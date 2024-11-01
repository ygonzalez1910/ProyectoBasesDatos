import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { Container, Form, FormGroup, Label, Input, Button, Spinner, Row, Col, Card, CardTitle, CardHeader, CardBody, } from 'reactstrap';
import { FaDatabase } from "react-icons/fa";
import { RespaldoService } from "../../services/api.service";

const CompletoRespaldo = () => {
  const [formData, setFormData] = useState({
    contrasena: '',
    directorio: ''
  });
  const [directorios, setDirectorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
    const fetchDirectorios = async () => {
      setLoading(true);
      try {
        const response = await RespaldoService.getAllRespaldos();
        const directoriosList = response.directorios.map((dir) => dir.nombreDirectorio);
        setDirectorios(directoriosList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectorios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCreateRespaldo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await RespaldoService.createRespaldoFULL(formData);
      setFormData({
        contrasena: '',
        directorio: ''
      });

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: '¡Respaldo Completo Creado!',
        text: 'El respaldo se ha realizado correctamente.'
      });
    } catch (err) {
      setError(err.message);

      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo realizar el respaldo: ' + err.message
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
        <h2 className="display-4 mb-2">Respaldo Full</h2>
        <p className="text-muted lead">Creación de backup Completo</p>
        <hr style={styles.divider} className="my-4" />
      </Col>
    </Row>

      {loading && <Spinner />}
      {error && <div className="alert alert-danger">{error}</div>}

      <Card className="shadow-lg h-100" style={{ height: "400px" }}>
        <CardHeader className="py-3" style={styles.gradient}>
          <div className="d-flex align-items-center">
            <FaDatabase size={20} className="me-3" />
            <div>
              <CardTitle tag="h5" className="mb-0">
                Crear un Backup Full
              </CardTitle>
              <small>Complete los campos para crear un nuevo backup</small>
            </div>
          </div>
        </CardHeader>
        <CardBody>
      <Form onSubmit={handleCreateRespaldo}>
        <FormGroup>
          <Label for="contrasena">Contraseña de Administrador</Label>
          <Input
            type="password"
            name="contrasena"
            id="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="directorio">Selecciona el Directorio</Label>
          <Input
            type="select"
            name="directorio"
            id="directorio"
            value={formData.directorio}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un directorio</option>
            {directorios.map((dir, index) => (
              <option key={index} value={dir}>
                {dir}
              </option>
            ))}
          </Input>
        </FormGroup>

        <Button type="submit" color="primary" disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Crear Respaldo Completo'}
        </Button>
      </Form>
      </CardBody>
      </Card>
    </Container>
  );
};

export default CompletoRespaldo;
