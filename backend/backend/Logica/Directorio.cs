using Oracle.ManagedDataAccess.Client;
using Microsoft.Extensions.Configuration;
using Logica.Request;
using Logica.Response;
using System.Collections.Generic;
using System;
using Models;
using Request;
using Response;
using Microsoft.Extensions.Logging;

namespace Logica
{
    public class Directorio
    {
        private readonly string _connectionString;
        private readonly ILogger<Directorio> _logger;

        public Directorio(string connectionString, ILogger<Directorio> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public CrearDirectorioResponse CrearDirectorio(ReqCrearDirectorio req)
        {
            _logger.LogInformation("Inicio para crear un directorio");
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();
                string sql = $"CREATE OR REPLACE DIRECTORY {req.nombreDirectorio} AS '{req.directorio}'";
                _logger.LogInformation("La consulta es {sql}", sql);
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    try
                    {
                        cmd.ExecuteNonQuery();
                        _logger.LogInformation($"Directorio '{req.nombreDirectorio}' creado exitosamente.");
                        return new CrearDirectorioResponse
                        {
                            Success = true,
                            Message = "Directorio creado exitosamente.",
                            NombreDirectorio = req.nombreDirectorio
                        };
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error al crear el directorio");
                        return new CrearDirectorioResponse
                        {
                            Success = false,
                            Message = "Error al crear el directorio."
                        };
                    }
                }
            }
        }

        public EliminarDirectorioResponse EliminarDirectorio(string nombreDirectorio)
        {
            _logger.LogInformation("Inicio de eliminado del directorio {nombreDirectorio}", nombreDirectorio);
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();
                string sql = $"DROP DIRECTORY {nombreDirectorio}"; // Eliminar el directorio
                _logger.LogInformation("La consulta es {sql}", sql);
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    var result = cmd.ExecuteNonQuery() > 0; // Retorna true si se elimina exitosamente
                    return new EliminarDirectorioResponse
                    {
                        Success = result,
                        Message = result ? "Directorio eliminado exitosamente." : "Error al eliminar el directorio.",
                        NombreDirectorio = nombreDirectorio
                    };
                }
            }
        }
    }
}
