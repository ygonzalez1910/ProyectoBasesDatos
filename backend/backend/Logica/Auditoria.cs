using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Request;
using Response;
using Models;

namespace Logica
{
    public class Auditoria
    {
        private readonly string _connectionString;

        public Auditoria(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Método para auditar inserciones
        public ResAuditoria AuditarInsert(ReqConfigurarAuditoria req)
        {
            ResAuditoria res = new ResAuditoria();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "INSERT INTO AUDITORIA (OPERACION, SCHEMA, NOMBRE_TABLA, MODO_AUDITORIA) VALUES ('INSERT', :schema, :tabla, :modo)";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("schema", req.Schema));
                        cmd.Parameters.Add(new OracleParameter("tabla", req.NombreTabla));
                        cmd.Parameters.Add(new OracleParameter("modo", req.ModoAuditoria));
                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al auditar inserción: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        // Método para auditar actualizaciones
        public ResAuditoria AuditarUpdate(ReqConfigurarAuditoria req)
        {
            ResAuditoria res = new ResAuditoria();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "INSERT INTO AUDITORIA (OPERACION, SCHEMA, NOMBRE_TABLA, MODO_AUDITORIA) VALUES ('UPDATE', :schema, :tabla, :modo)";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("schema", req.Schema));
                        cmd.Parameters.Add(new OracleParameter("tabla", req.NombreTabla));
                        cmd.Parameters.Add(new OracleParameter("modo", req.ModoAuditoria));
                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al auditar actualización: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        // Método para auditar eliminaciones
        public ResAuditoria AuditarDelete(ReqConfigurarAuditoria req)
        {
            ResAuditoria res = new ResAuditoria();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "INSERT INTO AUDITORIA (OPERACION, SCHEMA, NOMBRE_TABLA, MODO_AUDITORIA) VALUES ('DELETE', :schema, :tabla, :modo)";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("schema", req.Schema));
                        cmd.Parameters.Add(new OracleParameter("tabla", req.NombreTabla));
                        cmd.Parameters.Add(new OracleParameter("modo", req.ModoAuditoria));
                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al auditar eliminación: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        // Método para auditar consultas (SELECT)
        public ResAuditoria AuditarSelect(ReqConfigurarAuditoria req)
        {
            ResAuditoria res = new ResAuditoria();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "INSERT INTO AUDITORIA (OPERACION, SCHEMA, NOMBRE_TABLA, MODO_AUDITORIA) VALUES ('SELECT', :schema, :tabla, :modo)";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("schema", req.Schema));
                        cmd.Parameters.Add(new OracleParameter("tabla", req.NombreTabla));
                        cmd.Parameters.Add(new OracleParameter("modo", req.ModoAuditoria));
                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al auditar consulta: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }
    }
}
