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

        public Performance(string connectionString)
        {
            _connectionString = connectionString;
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
                        res.Resultado = true; // Indica que la creación fue exitosa
                    }
                }
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
                
            }
            catch (Exception ex)
            {
                res.Exito = false;
                res.Mensaje = $"Error al obtener estadísticas del índice: {ex.Message}";
                
            }
            return res;
        }

        internal ResEstadisticasIndice ObtenerEstadisticasIndice(string nombreIndice)
        {
            throw new NotImplementedException();
        }
    }
}
