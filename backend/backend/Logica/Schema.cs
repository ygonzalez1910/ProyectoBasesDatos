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
        public ResGetTables GetTables()
        {
            var res = new ResGetTables();
            res.Tables = new List<TableModel>(); // Asegúrate de inicializar la lista

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
                        SELECT owner AS schema_name, table_name 
                        FROM dba_tables 
                        WHERE owner NOT LIKE '%SYS%' 
                        AND owner NOT IN ('ORDDATA', 'GSMADMIN_INTERNAL', 'DBSNMP', 'XDB', 'OUTLN', 'DBSFWUSER') 
                        ORDER BY owner, table_name";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.Tables.Add(new TableModel
                                {
                                    SchemaName = reader.GetString(0),
                                    TableName = reader.GetString(1)
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al recuperar las tablas: {ex.Message}");
            }

            return res;
        }
        public ResNombresBackup ObtenerNombresBackupPorTipo(ReqTipoBackup req)
        {
            ResNombresBackup res = new ResNombresBackup();
            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "SELECT NOMBRE_BACKUP FROM ADMINDB.BACKUPS WHERE TIPO_BACKUP = :tipo";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("tipo", req.TipoBackup));
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.NombresBackup.Add(reader.GetString(0));
                            }
                        }
                    }
                }
                res.Resultado = true;
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al obtener nombres de backup: {ex.Message}");
                res.Resultado = false;
            }
            return res;
        }
    }
}
