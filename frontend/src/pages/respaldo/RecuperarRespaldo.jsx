import React, { useState, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Spinner, Alert } from 'reactstrap';
import { SchemasService, RespaldoService } from "../../services/api.service";
import Swal from 'sweetalert2'; // Importa SweetAlert2

const RecuperarRespaldo = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    tipoBackup: '',
    nombreBackup: '',
    contrasena: ''
  });
  const [nombresBackup, setNombresBackup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Llama a la API cuando se selecciona un nuevo tipo de respaldo
  useEffect(() => {
    const fetchNombresBackup = async () => {
      if (typeof formData.tipoBackup === 'string' && formData.tipoBackup.trim() !== '') {
        setLoading(true);
        try {
          // Llama al servicio para obtener los nombres de respaldo según el tipo
          const data = await SchemasService.getRespaldoByType(formData.tipoBackup);
          setNombresBackup(data.nombresBackup || []);
        } catch (err) {
          setError(`Error al cargar respaldos: ${err.message}`);
        } finally {
          setLoading(false);
        }
      } else {
        // Reinicia los nombres de respaldo si no se ha seleccionado un tipo
        setNombresBackup([]);
      }
    };

    fetchNombresBackup();
  }, [formData.tipoBackup]);

  // Función para manejar el envío del formulario
  const handleRecuperarRespaldo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await RespaldoService.recuperarRespaldo(formData);
      // Limpia el formulario tras el envío exitoso
      setFormData({
        tipoBackup: '',
        nombreBackup: '',
        contrasena: ''
      });
      
      // Muestra un mensaje de éxito con SweetAlert2
      await Swal.fire({
        title: 'Éxito!',
        text: 'Respaldo recuperado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

    } catch (err) {
      // Muestra un mensaje de error con SweetAlert2
      await Swal.fire({
        title: 'Error!',
        text: `Error al recuperar respaldo: ${err.message}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <h1>Gestión de Recuperar Respaldo</h1>
      <p>Sistema de gestión de respaldos</p>

      <Form onSubmit={handleRecuperarRespaldo}>
        {/* Selección del tipo de respaldo */}
        <FormGroup>
          <Label for="tipoBackup">Tipo de Respaldo</Label>
          <Input
            type="select"
            name="tipoBackup"
            id="tipoBackup"
            value={formData.tipoBackup}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un tipo</option>
            <option value="table">Table</option>
            <option value="schema">Schema</option>
            <option value="full">Full</option>
          </Input>
        </FormGroup>

        {/* Selección de nombre de respaldo */}
        {formData.tipoBackup && (
          <FormGroup>
            <Label for="nombreBackup">Nombre del Respaldo</Label>
            <Input
              type="select"
              name="nombreBackup"
              id="nombreBackup"
              value={formData.nombreBackup}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un respaldo</option>
              {nombresBackup.map((nombre, index) => (
                <option key={index} value={nombre}>{nombre}</option>
              ))}
            </Input>
          </FormGroup>
        )}

        {/* Campo de contraseña */}
        <FormGroup>
          <Label for="contrasena">Contraseña</Label>
          <Input
            type="password"
            name="contrasena"
            id="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {/* Mostrar mensajes de error */}
        {error && <Alert color="danger">{error}</Alert>}

        {/* Botón de envío */}
        <Button color="primary" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Recuperar Respaldo"}
        </Button>
      </Form>
    </Container>
  );
};

export default RecuperarRespaldo;
