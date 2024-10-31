import React, { useState, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import { RespaldoService } from "../../services/api.service";

const CompletoRespaldo = () => {
  const [formData, setFormData] = useState({
    contrasena: '',
    directorio: ''
  });
  const [directorios, setDirectorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch directorios al montar el componente
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
      // Limpiar el formulario después de un envío exitoso
      setFormData({
        contrasena: '',
        directorio: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <h1>Gestión de Full Respaldos</h1>
      <p>Sistema de gestión de respaldos</p>

      {loading && <Spinner />}
      {error && <div className="alert alert-danger">{error}</div>}

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
    </Container>
  );
};

export default CompletoRespaldo;
