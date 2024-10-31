using Oracle.ManagedDataAccess.Client;
using Microsoft.Extensions.Configuration;
using Logica.Request;
using Logica.Response;
using System.Collections.Generic;
using System;
using System.Linq;
using Models;
using Request;
using Response;

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

        public bool CrearDirectorio(ReqCrearDirectorio req)
        {
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();
                string sql = $"CREATE OR REPLACE DIRECTORY {req.nombreDirectorio} AS '{req.directorio}'";
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }
        public bool EliminarDirectorio(string nombreDirectorio)
        {
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();
                string sql = $"DROP DIRECTORY {nombreDirectorio}"; // Eliminar el directorio
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    return cmd.ExecuteNonQuery() > 0; // Retorna true si se elimina exitosamente
                }
            }
        }
    }
}
