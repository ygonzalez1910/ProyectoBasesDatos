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
using System.Text;


namespace Logica
{
    public class Auditoria
    {
        private readonly string _connectionString;
        private readonly ILogger<Auditoria> _logger;
        public Auditoria(string connectionString, ILogger<Auditoria> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        public ResObtenerAuditoria ObtenerAuditoria(ReqObtenerAuditoria req)
        {
            _logger.LogInformation("Iniciando consulta de auditoría");

            var res = new ResObtenerAuditoria
            {
                Errores = new List<string>(),
                Registros = new List<AuditoriaInfo>()
            };

            try
            {
                using var conexion = new OracleConnection(_connectionString);
                conexion.Open();

                var sql = @"
            SELECT 
                SESSIONID as AuditoriaId,
                TO_CHAR(TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS') as FechaHora,
                USERNAME as Usuario,
                ACTION_NAME as TipoAccion,
                OBJ_NAME as NombreTabla,
                OWNER as Esquema,
                SQL_TEXT as ConsultaSQL,
                SESSIONID as SesionId,
                OS_USERNAME as UsuarioOS,
                USERHOST as HostUsuario,
                TERMINAL as Terminal
            FROM DBA_AUDIT_TRAIL 
            WHERE obj_name = :nombreTabla 
            AND owner = :esquema";

                if (req.FechaInicio.HasValue)
                {
                    sql += " AND TRUNC(TIMESTAMP) >= TRUNC(:fechaInicio)";
                }
                if (req.FechaFin.HasValue)
                {
                    sql += " AND TRUNC(TIMESTAMP) <= TRUNC(:fechaFin)";
                }
                if (!string.IsNullOrEmpty(req.TipoAccion))
                {
                    sql += " AND UPPER(ACTION_NAME) = UPPER(:tipoAccion)";
                }

                sql += " ORDER BY TIMESTAMP DESC";

                using var cmd = new OracleCommand(sql, conexion);
                cmd.Parameters.Add("nombreTabla", OracleDbType.Varchar2).Value = req.NombreTabla.ToUpper();
                cmd.Parameters.Add("esquema", OracleDbType.Varchar2).Value = req.Esquema.ToUpper();

                if (req.FechaInicio.HasValue)
                {
                    cmd.Parameters.Add("fechaInicio", OracleDbType.Date).Value = req.FechaInicio.Value;
                }
                if (req.FechaFin.HasValue)
                {
                    cmd.Parameters.Add("fechaFin", OracleDbType.Date).Value = req.FechaFin.Value;
                }
                if (!string.IsNullOrEmpty(req.TipoAccion))
                {
                    cmd.Parameters.Add("tipoAccion", OracleDbType.Varchar2).Value = req.TipoAccion.ToUpper();
                }

                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    res.Registros.Add(new AuditoriaInfo
                    {
                        AuditoriaId = Convert.ToInt64(reader["AuditoriaId"]),
                        FechaHora = DateTime.Parse(reader["FechaHora"].ToString()),
                        Usuario = reader["Usuario"]?.ToString(),
                        TipoAccion = reader["TipoAccion"]?.ToString(),
                        NombreTabla = reader["NombreTabla"]?.ToString(),
                        Esquema = reader["Esquema"]?.ToString(),
                        ConsultaSQL = reader["ConsultaSQL"]?.ToString(),
                        SesionId = reader["SesionId"]?.ToString(),
                        UsuarioOS = reader["UsuarioOS"]?.ToString(),
                        HostUsuario = reader["HostUsuario"]?.ToString(),
                        Terminal = reader["Terminal"]?.ToString()
                    });
                }

                res.Resultado = true;
                _logger.LogInformation($"Se encontraron {res.Registros.Count} registros");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
                res.Errores.Add(ex.Message);
                res.Resultado = false;
            }

            return res;
        }

        public ResActivarAuditoria ActivarAuditoria(ReqActivarAuditoria req)
        {
            ResActivarAuditoria res = new ResActivarAuditoria();
            res.Errores = new List<string>();

            try
            {
                if (string.IsNullOrEmpty(req.NombreTabla))
                {
                    res.Errores.Add("El nombre de la tabla es requerido");
                    res.Resultado = false;
                    return res;
                }

                if (string.IsNullOrEmpty(req.Esquema))
                {
                    res.Errores.Add("El esquema es requerido");
                    res.Resultado = false;
                    return res;
                }

                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    // Verificar si la auditoría está habilitada a nivel de base de datos
                    string sqlAuditCheck = @"SELECT VALUE FROM V$PARAMETER WHERE NAME = 'audit_trail'";
                    using (OracleCommand cmdCheck = new OracleCommand(sqlAuditCheck, conexion))
                    {
                        string auditValue = cmdCheck.ExecuteScalar()?.ToString();
                        if (string.IsNullOrEmpty(auditValue) || auditValue.ToUpper() == "NONE")
                        {
                            res.Errores.Add("La auditoría no está habilitada en la base de datos");
                            res.Resultado = false;
                            return res;
                        }
                    }

                    // Activar auditoría para la tabla específica
                    string[] auditActions = { "INSERT", "UPDATE", "DELETE", "SELECT" };
                    foreach (string action in auditActions)
                    {
                        string sqlAudit = $"AUDIT {action} ON {req.Esquema}.{req.NombreTabla} BY ACCESS";
                        using (OracleCommand cmd = new OracleCommand(sqlAudit, conexion))
                        {
                            cmd.ExecuteNonQuery();
                        }
                    }

                    res.Resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al activar auditoría: {ex.Message}");
                if (ex.InnerException != null)
                {
                    res.Errores.Add($"Error interno: {ex.InnerException.Message}");
                }
                res.Resultado = false;
            }
            return res;
        }

        public ResListarTablas ListarTablas()
        {
            ResListarTablas res = new ResListarTablas
            {
                Resultado = false
            };

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    string query = @"
                        SELECT TABLE_NAME 
                        FROM ALL_TABLES
                        ORDER BY TABLE_NAME";

                    using (OracleCommand cmd = new OracleCommand(query, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.Tablas.Add(reader.GetString(0));
                            }
                        }
                    }

                    res.Resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al listar las tablas: {ex.Message}");
                res.Resultado = false;
            }

            return res;
        }
    }
}