import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Importar SweetAlert2
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
} from "reactstrap";
import { FaDatabase } from "react-icons/fa";
import { SchemasService, RespaldoService } from "../../services/api.service";

const EsquemaRespaldo = () => {
  const [respaldos, setRespaldos] = useState([]);
  const [directorios, setDirectorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreSchema: "",
    contrasenaSchema: "",
    directorio: "",
  });
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
    const fetchRespaldos = async () => {
      try {
        const { schemas } = await SchemasService.getAllSchemas();
        setRespaldos(schemas);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchDirectorios = async () => {
      try {
        const { directorios } = await RespaldoService.getAllRespaldos();
        setDirectorios(directorios);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchRespaldos();
      await fetchDirectorios();
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateRespaldo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await RespaldoService.createRespaldoSchema(formData);
      setFormData({
        nombreSchema: "",
        contrasenaSchema: "",
        directorio: "",
      });

      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: "success",
        title: "¡Respaldo creado!",
        text: "El respaldo se ha realizado correctamente.",
      });
    } catch (err) {
      setError(err.message);

      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo realizar el respaldo: " + err.message,
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
          <h2 className="display-4 mb-2">Respaldo de Schema</h2>
          <p className="text-muted lead">Creación de backups por Schemas</p>
          <hr style={styles.divider} className="my-4" />
        </Col>
      </Row>
      {error && <Alert color="danger">{error}</Alert>}

      <Card className="shadow-lg h-100" style={{ height: "400px" }}>
        <CardHeader className="py-3" style={styles.gradient}>
          <div className="d-flex align-items-center">
            <FaDatabase size={20} className="me-3" />
            <div>
              <CardTitle tag="h5" className="mb-0">
                Crear un Backup de Schema
              </CardTitle>
              <small>Complete los campos para crear un nuevo backup</small>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleCreateRespaldo}>
            <FormGroup>
              <Label for="nombreSchema">Seleccionar Esquema</Label>
              <Input
                type="select"
                name="nombreSchema"
                id="nombreSchema"
                value={formData.nombreSchema}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                {respaldos.map((schema, index) => (
                  <option key={index} value={schema.schemaName}>
                    {schema.schemaName}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="contrasenaSchema">Contraseña del Esquema</Label>
              <Input
                type="password"
                name="contrasenaSchema"
                id="contrasenaSchema"
                value={formData.contrasenaSchema}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="directorio">Seleccionar Directorio</Label>
              <Input
                type="select"
                name="directorio"
                id="directorio"
                value={formData.directorio}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select an option
                </option>
                {directorios.map((dir, index) => (
                  <option key={index} value={dir.nombreDirectorio}>
                    {dir.nombreDirectorio}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Enviar"}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default EsquemaRespaldo;
