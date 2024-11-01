import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Alert,
} from "reactstrap";
import { FaDatabase, FaSearch, FaHistory } from "react-icons/fa";
import {
  AuditoriaService,
  SchemasService,
  tunningService,
} from "../../services/api.service";

const Auditoria = () => {
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState("");
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [actionType, setActionType] = useState("");
  const [auditResults, setAuditResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

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
    fetchSchemas();
  }, []);

  useEffect(() => {
    if (selectedSchema) {
      fetchTables(selectedSchema);
    }
  }, [selectedSchema]);

  const fetchSchemas = async () => {
    try {
      const response = await SchemasService.getAllSchemas();
      if (response.schemas && response.schemas.length > 0) {
        setSchemas(response.schemas);
      } else {
        setError("No se encontraron esquemas.");
      }
    } catch (error) {
      console.error("Error al obtener la lista de esquemas:", error);
      setError("Error al cargar los esquemas");
    }
  };

  const fetchTables = async (schema) => {
    try {
      setLoading(true);
      setError(null);
      const response = await tunningService.obtenerTablasPorSchema(schema);
      if (response?.data?.resultado) {
        setTables(response.data.tablas || []);
      } else {
        setError(response.data.errores?.[0] || "Error al obtener las tablas");
        setTables([]);
      }
    } catch (error) {
      console.error("Error al obtener las tablas:", error);
      setError("Error al obtener las tablas del schema");
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const validateDates = () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Por favor seleccione ambas fechas");
      return false;
    }

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    if (end < start) {
      setError("La fecha final no puede ser anterior a la fecha inicial");
      return false;
    }

    return true;
  };

  const consultarAuditoria = async () => {
    if (!validateDates()) return;
  
    try {
      setLoading(true);
      setError(null);
      setShowResults(false);
  
      const formattedStartDate = new Date(dateRange.startDate).toISOString();
      const formattedEndDate = new Date(dateRange.endDate).toISOString();

      const response = await AuditoriaService.obtenerAuditoria({
        nombreTabla: selectedTable,
        esquema: selectedSchema,
        fechaInicio: formattedStartDate,
        fechaFin: formattedEndDate,
        tipoAccion: actionType || null,
      });
      console.log("response: ", response);
      if (response.resultado) {
        setAuditResults(response.registros);
        setShowResults(true);
        if (response.registros.length === 0) {
          setMessage("No se encontraron registros para los criterios seleccionados");
        }
      } else {
        setError(response.errores?.join(", ") || "Error al obtener los resultados");
      }
    } catch (error) {
      console.error("Error al consultar auditoría:", error);
      setError("Error al consultar los registros de auditoría. Por favor intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col className="text-center">
          <h2 className="display-4 mb-2">Módulo de Auditoría</h2>
          <p className="text-muted lead">
            Gestión y consulta de registros de auditoría del sistema
          </p>
          <hr style={styles.divider} className="my-4" />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Consulta de Auditoría */}
        <Col lg="12">
          <Card className="shadow-sm h-100 border-0" style={styles.card}>
            <CardHeader className="py-3" style={styles.gradient}>
              <div className="d-flex align-items-center">
                <FaHistory size={20} className="me-3" />
                <div>
                  <CardTitle tag="h5" className="mb-0">
                    Consulta de Auditoría
                  </CardTitle>
                  <small>Consultar registros de auditoría</small>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4">
              <FormGroup>
                <Label
                  for="schema-select-audit"
                  className="form-label text-muted"
                >
                  Seleccionar esquema:
                </Label>
                <Input
                  type="select"
                  id="schema-select-audit"
                  value={selectedSchema}
                  onChange={(e) => {
                    setSelectedSchema(e.target.value);
                    setSelectedTable("");
                  }}
                >
                  <option value="">Seleccione un esquema</option>
                  {schemas.map((schema) => (
                    <option key={schema.schemaName} value={schema.schemaName}>
                      {schema.schemaName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label
                  for="table-select-audit"
                  className="form-label text-muted"
                >
                  Seleccionar tabla:
                </Label>
                <Input
                  type="select"
                  id="table-select-audit"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  disabled={!selectedSchema}
                >
                  <option value="">Seleccione una tabla</option>
                  {tables.map((table) => (
                    <option key={table} value={table}>
                      {table}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="startDate" className="form-label text-muted">
                  Fecha inicio:
                </Label>
                <Input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="endDate" className="form-label text-muted">
                  Fecha fin:
                </Label>
                <Input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="actionType" className="form-label text-muted">
                  Tipo de acción:
                </Label>
                <Input
                  type="select"
                  id="actionType"
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                >
                  <option value="">TODAS</option>
                  <option value="INSERT">INSERT</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                  <option value="SELECT">SELECT</option>
                </Input>
              </FormGroup>
              <div className="text-end mt-4">
                <Button
                  color="primary"
                  onClick={consultarAuditoria}
                  disabled={loading || !selectedSchema || !selectedTable}
                  style={styles.button}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : null}
                  Consultar Auditoría
                </Button>
              </div>
              {error && (
                <Alert color="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              {showResults && auditResults && (
                <div className="mt-4">
                  <h5>Resultados de Auditoría</h5>
                  <div className="table-responsive">
                    <Table striped hover className="table-sm">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Fecha y Hora</th>
                          <th>Usuario</th>
                          <th>Tipo Acción</th>
                          <th>Tabla</th>
                          <th>Esquema</th>
                          <th>Sesión ID</th>
                          <th>Usuario OS</th>
                          <th>Host</th>
                          <th>Terminal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditResults.map((result) => (
                          <tr key={result.auditoriaId}>
                            <td>{result.auditoriaId}</td>
                            <td>{formatDateTime(result.fechaHora)}</td>
                            <td>{result.usuario}</td>
                            <td>{result.tipoAccion}</td>
                            <td>{result.nombreTabla}</td>
                            <td>{result.esquema}</td>
                            <td>{result.sesionId}</td>
                            <td>{result.usuarioOS}</td>
                            <td>{result.hostUsuario}</td>
                            <td>{result.terminal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Auditoria;
