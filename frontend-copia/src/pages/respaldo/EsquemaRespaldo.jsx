import React, { useEffect, useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, Spinner, Alert } from "reactstrap";
import { SchemasService, RespaldoService } from "../../services/api.service";

const EsquemaRespaldo = () => {
  const [respaldos, setRespaldos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreSchema: "",
    contrasenaSchema: "",
    directorio: "",
  });

  const directorios = [
    "C:\\ORACLE_FILES\\HD1",
    "C:\\ORACLE_FILES\\HD2",
    "C:\\ORACLE_FILES\\HD3"
  ];

  useEffect(() => {
    const fetchRespaldos = async () => {
      try {
        const { schemas } = await SchemasService.getAllSchemas();
        setRespaldos(schemas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRespaldos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateRespaldo = async (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario
    setLoading(true); // Mostrar spinner
    setError(null); // Reiniciar errores

    try {
      await RespaldoService.createRespaldoSchema(formData);
      // Limpiar formulario después de un envío exitoso (opcional)
      setFormData({
        nombreSchema: "",
        contrasenaSchema: "",
        directorio: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Ocultar spinner
    }
  };

  return (
    <Container fluid className="p-4">
      <h1>Gestión de Esquema Respaldos</h1>
      <p>Sistema de gestión de respaldos</p>
      {error && <Alert color="danger">{error}</Alert>} {/* Mostrar error si existe */}

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
            <option value="" disabled>Select an option</option>
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
            <option value="" disabled>Select an option</option>
            {directorios.map((directorio, index) => (
              <option key={index} value={directorio}>
                {directorio}
              </option>
            ))}
          </Input>
        </FormGroup>

        <Button type="submit" color="primary" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Enviar"}
        </Button>
      </Form>
    </Container>
  );
};

export default EsquemaRespaldo;
