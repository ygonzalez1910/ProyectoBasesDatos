using System;
using System.Collections.Generic;
using Oracle.ManagedDataAccess.Client;
using Request;
using Response;
using Models;

namespace Logica
{
    public class Schema
    {
        private readonly string _connectionString;

        public Schema(string connectionString)
        {
            _connectionString = connectionString;
        }

        public ResGetSchemas GetSchemas()
        {
            var res = new ResGetSchemas();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "SELECT username AS schema_name FROM all_users WHERE username NOT LIKE '%SYS%'";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.Schemas.Add(new SchemaModel
                                {
                                    SchemaName = reader.GetString(0)
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al recuperar los esquemas: {ex.Message}");
            }

            return res;
        }
    }
}
