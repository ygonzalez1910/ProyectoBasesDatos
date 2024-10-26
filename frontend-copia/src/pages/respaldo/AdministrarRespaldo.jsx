import React, { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
import { RespaldoService } from "../../services/api.service";

const AdministrarRespaldo = () => {
  const [respaldos, setRespaldos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRespaldos = async () => {
      try {
        const data = await RespaldoService.getAllRespaldos();
        setRespaldos(data.directorios); // Ajusta aquí para acceder al array de directorios
        console.log(data.directorios);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRespaldos();
  }, []);

  return (
    <Container fluid className="p-4">
      <h1>Gestión de Admin Respaldos</h1>
      <p>Sistema de gestión de respaldods</p>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <Table striped>
          <thead>
            <tr>
              <th>Directorio</th>
              <th>Dirección</th>
            </tr>
          </thead>
          <tbody>
            {respaldos.map((respaldo, index) => (
              <tr key={index}>
                <td>{respaldo.nombreDirectorio}</td>
                <td>{respaldo.direccionDirectorio}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdministrarRespaldo;
