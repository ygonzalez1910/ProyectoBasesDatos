using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Oracle.ManagedDataAccess.Client;
using Request;
using Response;

namespace Logica
{
    public class Performance
    {
        private readonly string _connectionString;
        private readonly ILogger<Performance> _logger;

        public Performance(string connectionString, ILogger<Performance> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        // Crear índice
        public ResCrearIndice CrearIndice(ReqCrearIndice req)
        {
            _logger.LogInformation("--Ejecutando el crear indice");
            _logger.LogInformation($"Nombre del índice: {req.NombreIndice}");
            _logger.LogInformation($"Nombre de la tabla: {req.NombreTabla}");
            _logger.LogInformation($"Nombre del esquema: {req.NombreSchema}");
            _logger.LogInformation($"Columnas: {string.Join(", ", req.Columnas)}");
            _logger.LogInformation($"Es único: {req.EsUnico}");

            var res = new ResCrearIndice();
            try
            {
                _logger.LogInformation("--1");
                using (var conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string columnas = string.Join(", ", req.Columnas);
                    string sql = $"CREATE {(req.EsUnico ? "UNIQUE " : "")}INDEX {req.NombreIndice} ON {req.NombreSchema}.{req.NombreTabla} ({columnas})";
                    using (var cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                        res.Exito = true;
                        res.Mensaje = $"Índice {req.NombreIndice} creado exitosamente en la tabla {req.NombreTabla}.";
                        res.Resultado = true; // Indica que la creación fue exitosa
                    }
                }
                _logger.LogInformation("--");
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = ex.Message.Contains("ORA-01408")
                    ? "Error al crear índice: El índice ya existe para esta lista de columnas."
                    : $"Error al crear índice: {ex.Message}";
                res.Errores.Add(ex.Message);
                res.Resultado = false; // Indica que la creación falló
            }
            return res;
        }



        // Eliminar índice
        public ResEliminarIndice EliminarIndice(ReqEliminarIndice req)
        {
            var res = new ResEliminarIndice();
            try
            {
                using (var conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = $"DROP INDEX {req.NombreIndice}";
                    using (var cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                        res.Exito = true;
                        res.resultado = true; // Establecer resultado como true
                        res.Mensaje = $"Índice {req.NombreIndice} eliminado exitosamente.";
                    }
                }
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.resultado = false; // Establecer resultado como false en caso de error
                res.Mensaje = $"Error al eliminar índice: {ex.Message}";
            }
            return res;
        }


        // Listar índices de una tabla
        public ResListarIndices ListarIndices(ReqListarIndices req)
        {
            var res = new ResListarIndices { Indices = new List<string>() };
            try
            {
                using (var conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = $"SELECT index_name FROM all_indexes WHERE table_name = '{req.NombreTabla.ToUpper()}'";
                    using (var cmd = new OracleCommand(sql, conexion))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            res.Indices.Add(reader.GetString(0));
                        }
                    }
                }
                res.resultado = true; // Agregar esta línea
                res.Exito = true;
                res.Mensaje = $"Índices listados correctamente para la tabla {req.NombreTabla}.";
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = $"Error al listar índices: {ex.Message}";
            }
            return res;
        }

        // Obtener estadísticas de un índice
        public ResEstadisticasIndice ObtenerEstadisticasIndice(ReqEstadisticasIndice req)
        {
            var res = new ResEstadisticasIndice { Estadisticas = new EstadisticasIndice() };
            try
            {
                using (var conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
                SELECT 
                    i.INDEX_NAME,
                    i.BLEVEL,
                    i.LEAF_BLOCKS,
                    i.DISTINCT_KEYS,
                    i.CLUSTERING_FACTOR,
                    i.NUM_ROWS,
                    i.TABLE_NAME
                FROM ALL_INDEXES i 
                WHERE i.INDEX_NAME = :nombreIndice";

                    using (var cmd = new OracleCommand(sql, conexion))
                    {
                        // Usar parámetros para prevenir SQL injection
                        cmd.Parameters.Add(new OracleParameter("nombreIndice", OracleDbType.Varchar2)
                        {
                            Value = req.NombreIndice.ToUpper()
                        });

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                // El nombre del índice siempre estará presente
                                res.Estadisticas.NombreIndice = reader.GetString(0);

                                // BLEVEL es el número de niveles por encima de los bloques hoja
                                // La altura real es BLEVEL + 1 (incluyendo el nivel hoja)
                                res.Estadisticas.Altura = reader.IsDBNull(1) ? 0 : reader.GetInt32(1) + 1;

                                // Obtener bloques hoja
                                res.Estadisticas.BloquesHoja = reader.IsDBNull(2) ? 0 : reader.GetInt32(2);

                                // Obtener claves distintas
                                res.Estadisticas.ClavesDistintas = reader.IsDBNull(3) ? 0 : reader.GetInt32(3);

                                // Calcular promedios solo si tenemos datos válidos
                                if (!reader.IsDBNull(3) && !reader.IsDBNull(2) && reader.GetInt32(3) > 0)
                                {
                                    res.Estadisticas.PromBloquesHojaPorClave =
                                        (double)res.Estadisticas.BloquesHoja / res.Estadisticas.ClavesDistintas;
                                }

                                // Calcular promedio de bloques de datos por clave
                                int clusteringFactor = reader.IsDBNull(4) ? 0 : reader.GetInt32(4);
                                int numRows = reader.IsDBNull(5) ? 0 : reader.GetInt32(5);

                                if (numRows > 0)
                                {
                                    res.Estadisticas.PromBloquesDatosPorClave = (double)clusteringFactor / numRows;
                                }

                                res.resultado = true;
                                res.Exito = true;
                                res.Mensaje = $"Estadísticas del índice {req.NombreIndice} obtenidas correctamente para la tabla {reader.GetString(6)}";
                            }
                            else
                            {
                                res.resultado = false;
                                res.Exito = false;
                                res.Mensaje = $"No se encontró el índice {req.NombreIndice}";
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.resultado = false;
                res.Exito = false;
                res.Mensaje = $"Error al obtener estadísticas del índice: {ex.Message}";
                res.Errores = new List<string> { ex.ToString() };
            }
            return res;
        }

        // Método para obtener todos los índices de la base de datos
        public ResVerTodosLosIndices VerTodosLosIndices()
        {
            var res = new ResVerTodosLosIndices();
            try
            {
                using (var conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    // Consulta para obtener todos los nombres de los índices
                    string sql = "SELECT index_name FROM all_indexes";

                    using (var cmd = new OracleCommand(sql, conexion))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            res.Indices.Add(reader.GetString(0));
                        }
                    }
                }
                res.Exito = true;
                res.Resultado = true;
                res.Mensaje = "Índices obtenidos correctamente de la base de datos.";
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Resultado = false;
                res.Mensaje = $"Error al obtener índices: {ex.Message}";
                res.Errores.Add(ex.ToString());
            }
            return res;
        }
    }

}
