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
  Row,
  Col,
  Card,
  CardTitle,
  CardHeader,
  CardBody,
} from "reactstrap";
import { FaDatabase } from "react-icons/fa";
import { SchemasService, RespaldoService } from "../../services/api.service";

const TablaRespaldo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreSchema: "",
    contrasenaSchema: "",
    nombreTabla: "",
    nombreDirectorio: "",
  });
  const [tables, setTables] = useState([]);
  const [directorios, setDirectorios] = useState([]);
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
    const fetchTables = async () => {
      setLoading(true);
      try {
        const result = await SchemasService.getAllTables();
        setTables(result.tables);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDirectorios = async () => {
      setLoading(true);
      try {
        const { directorios } = await RespaldoService.getAllRespaldos();
        setDirectorios(directorios);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
    fetchDirectorios();
  }, []);

  const handleCreateRespaldo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { nombreDirectorio } =
        directorios.find(
          (dir) => dir.direccionDirectorio === formData.nombreDirectorio
        ) || {};

      await RespaldoService.createRespaldoTable({
        nombreSchema: formData.nombreSchema,
        contrasenaSchema: formData.contrasenaSchema,
        nombreTabla: formData.nombreTabla,
        directorio: nombreDirectorio || "",
      });

      setFormData({
        nombreSchema: "",
        contrasenaSchema: "",
        nombreTabla: "",
        nombreDirectorio: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombreTabla") {
      const [schema, table] = value.split("|");
      setFormData((prevData) => ({
        ...prevData,
        nombreSchema: schema,
        nombreTabla: table,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <Container className="py-5">
      {/* Header mejorado */}
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Respaldo Tabla</h2>
          <p className="text-muted lead">Creación de backups por Tablas</p>
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
                Crear un Backup de una Tabla
              </CardTitle>
              <small>Complete los campos para crear un nuevo backup</small>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Form onSubmit={handleCreateRespaldo}>
            <FormGroup>
              <Label for="nombreTabla">Selecciona la Tabla</Label>
              <Input
                type="select"
                name="nombreTabla"
                id="nombreTabla"
                value={`${formData.nombreSchema}|${formData.nombreTabla}`}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una tabla</option>
                {tables.map((table, index) => (
                  <option
                    key={index}
                    value={`${table.schemaName}|${table.tableName}`}
                  >
                    {table.schemaName}.{table.tableName}
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
              <Label for="nombreDirectorio">Selecciona el Directorio</Label>
              <Input
                type="select"
                name="nombreDirectorio"
                id="nombreDirectorio"
                value={formData.nombreDirectorio}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un directorio</option>
                {directorios.map((dir, index) => (
                  <option key={index} value={dir.direccionDirectorio}>
                    {dir.nombreDirectorio}
                  </option>
                ))}
              </Input>
            </FormGroup>

            <Button type="submit" color="primary" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Crear Respaldo"}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default TablaRespaldo;
