import React, { useEffect, useState } from "react";
import { Container, Form, FormGroup, Label, Input, Button, Spinner, Alert } from "reactstrap";
import { SchemasService, RespaldoService } from "../../services/api.service";

const EsquemaRespaldo = () => {
  const [respaldos, setRespaldos] = useState([]);
  const [directorios, setDirectorios] = useState([]); // Nuevo estado para directorios
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreSchema: "",
    contrasenaSchema: "",
    directorio: "",
  });

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
        setDirectorios(directorios); // Guardar directorios en el estado
      } catch (err) {
        setError(err.message);
      }
    };

    // Ejecutar ambas funciones de fetch
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
            {directorios.map((dir, index) => (
              <option key={index} value={dir.nombreDirectorio}> {/* Cambiado aquí */}
                {dir.nombreDirectorio} {/* Mostrar el nombre del directorio */}
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
