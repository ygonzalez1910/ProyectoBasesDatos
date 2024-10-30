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
            var res = new ResCrearIndice();
            try
            {
                using (var conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string columnas = string.Join(", ", req.Columnas);
                    string sql = $"CREATE {(req.EsUnico ? "UNIQUE " : "")}INDEX {req.NombreIndice} ON {req.NombreTabla} ({columnas})";
                    using (var cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                        res.Exito = true;
                        res.Mensaje = $"Índice {req.NombreIndice} creado exitosamente en la tabla {req.NombreTabla}.";
                        _logger.LogInformation("Índice {NombreIndice} creado en la tabla {NombreTabla}.", req.NombreIndice, req.NombreTabla);
                    }
                }
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = $"Error al crear índice: {ex.Message}";
                _logger.LogError(ex, "Error al crear el índice {NombreIndice} en la tabla {NombreTabla}", req.NombreIndice, req.NombreTabla);
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
                        res.Mensaje = $"Índice {req.NombreIndice} eliminado exitosamente.";
                        _logger.LogInformation("Índice {NombreIndice} eliminado.", req.NombreIndice);
                    }
                }
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = $"Error al eliminar índice: {ex.Message}";
                _logger.LogError(ex, "Error al eliminar el índice {NombreIndice}", req.NombreIndice);
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
                res.Exito = true;
                res.Mensaje = $"Índices listados correctamente para la tabla {req.NombreTabla}.";
                _logger.LogInformation("Índices listados correctamente para la tabla {NombreTabla}.", req.NombreTabla);
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = $"Error al listar índices: {ex.Message}";
                _logger.LogError(ex, "Error al listar índices para la tabla {NombreTabla}", req.NombreTabla);
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
                    string sql = $@"
                        SELECT 
                            INDEX_NAME, HEIGHT, BLOCKS, LEAF_BLOCKS, DISTINCT_KEYS,
                            AVG_LEAF_BLOCKS_PER_KEY, AVG_DATA_BLOCKS_PER_KEY 
                        FROM ALL_INDEXES 
                        WHERE INDEX_NAME = '{req.NombreIndice.ToUpper()}'";
                    using (var cmd = new OracleCommand(sql, conexion))
                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            res.Estadisticas.NombreIndice = reader.GetString(0);
                            res.Estadisticas.Altura = reader.GetInt32(1);
                            res.Estadisticas.Bloques = reader.GetInt32(2);
                            res.Estadisticas.BloquesHoja = reader.GetInt32(3);
                            res.Estadisticas.ClavesDistintas = reader.GetInt32(4);
                            res.Estadisticas.PromBloquesHojaPorClave = reader.GetDecimal(5);
                            res.Estadisticas.PromBloquesDatosPorClave = reader.GetDecimal(6);
                        }
                    }
                }
                res.Exito = true;
                res.Mensaje = $"Estadísticas del índice {req.NombreIndice} obtenidas correctamente.";
                _logger.LogInformation("Estadísticas del índice {NombreIndice} obtenidas correctamente.", req.NombreIndice);
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = $"Error al obtener estadísticas del índice: {ex.Message}";
                _logger.LogError(ex, "Error al obtener estadísticas del índice {NombreIndice}", req.NombreIndice);
            }
            return res;
        }

        internal ResEstadisticasIndice ObtenerEstadisticasIndice(string nombreIndice)
        {
            throw new NotImplementedException();
        }
    }
}
