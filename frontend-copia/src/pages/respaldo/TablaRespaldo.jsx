import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
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
    directorio: "",
  });
  const [tables, setTables] = useState([]);
  const directorios = [
    "C:\\ORACLE_FILES\\HD1",
    "C:\\ORACLE_FILES\\HD2",
    "C:\\ORACLE_FILES\\HD3",
  ];

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

    fetchTables();
  }, []);


  const handleCreateRespaldo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await RespaldoService.createRespaldoSchema(formData);
      // Limpiar el formulario después de un envío exitoso
      setFormData({
        nombreSchema: "",
        contrasenaSchema: "",
        nombreTabla: "",
        directorio: "",
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
          {loading ? <Spinner size="sm" /> : "Crear Respaldo"}
        </Button>
      </Form>
    </Container>
  );
};

export default TablaRespaldo;
