import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { SchemasService, RespaldoService } from "../../services/api.service";

const TablaRespaldo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreSchema: "",
    contrasenaSchema: "",
    nombreTabla: "",
    nombreDirectorio: "", // Cambiado a nombreDirectorio
  });
  const [tables, setTables] = useState([]);
  const [directorios, setDirectorios] = useState([]); // Estado para los directorios

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      try {
        const result = await SchemasService.getAllTables();
        setTables(result.tables); // Suponiendo que esta es la estructura de la respuesta
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchDirectorios = async () => {
      setLoading(true); // Opcional
      try {
        const { directorios } = await RespaldoService.getAllRespaldos();
        setDirectorios(directorios); // Guardar directorios en el estado
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
    fetchDirectorios(); // Llamar a la función para obtener directorios
  }, []); // Dependencias vacías para que se ejecute solo una vez al montar

  const handleCreateRespaldo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Extraer solo el nombreDirectorio de formData
      const { nombreDirectorio } = directorios.find(dir => dir.direccionDirectorio === formData.nombreDirectorio) || {};

      // Enviar al API con la estructura correcta
      await RespaldoService.createRespaldoTable({
        nombreSchema: formData.nombreSchema,
        contrasenaSchema: formData.contrasenaSchema,
        nombreTabla: formData.nombreTabla,
        directorio: nombreDirectorio || "", // Solo se envía nombreDirectorio
      });
      
      // Limpiar el formulario después de un envío exitoso
      setFormData({
        nombreSchema: "",
        contrasenaSchema: "",
        nombreTabla: "",
        nombreDirectorio: "", // Limpiar también nombreDirectorio
      });
    } catch (err) {
      setError(err.message);
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
    <Container fluid className="p-4">
      <h1>Tabla de Respaldos</h1>
      {loading && <Spinner />}
      {error && <div className="alert alert-danger">{error}</div>}

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
    </Container>
  );
};

export default TablaRespaldo;
