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

        public Auditoria(string connectionString)
        {
            _connectionString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XEPDB1)));User Id=SYSTEM;Password=rootroot;";
        }
        public ResObtenerAuditoria ObtenerAuditoria(ReqObtenerAuditoria req)
        {
            ResObtenerAuditoria res = new ResObtenerAuditoria();
            res.Errores = new List<string>();
            res.Registros = new List<AuditoriaInfo>();
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

                    // Verificar si la auditoría está habilitada para la tabla
                    string sqlAuditCheck = @"
                SELECT COUNT(*) 
                FROM DBA_OBJ_AUDIT_OPTS 
                WHERE OWNER = :esquema 
                AND OBJECT_NAME = :nombreTabla";

                    using (OracleCommand cmdAuditCheck = new OracleCommand(sqlAuditCheck, conexion))
                    {
                        cmdAuditCheck.Parameters.Add(new OracleParameter("esquema", OracleDbType.Varchar2) { Value = req.Esquema.ToUpper() });
                        cmdAuditCheck.Parameters.Add(new OracleParameter("nombreTabla", OracleDbType.Varchar2) { Value = req.NombreTabla.ToUpper() });

                        int auditEnabled = Convert.ToInt32(cmdAuditCheck.ExecuteScalar());
                        res.Errores.Add($"Debug: Auditoría habilitada para la tabla: {auditEnabled > 0}");

                        if (auditEnabled == 0)
                        {
                            res.Errores.Add("Advertencia: La auditoría no está habilitada para esta tabla");
                        }
                    }

                    // Construir la consulta SQL base
                    var sqlBuilder = new StringBuilder(@"
                SELECT 
                    NVL(TO_CHAR(TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'), '') as FechaHora,
                    NVL(USERNAME, '') as Usuario,
                    NVL(ACTION_NAME, '') as TipoAccion,
                    NVL(OBJ_NAME, '') as NombreTabla,
                    NVL(OWNER, '') as Esquema,
                    NVL(SQL_TEXT, '') as ConsultaSQL,
                    NVL(ENTRYID, 0) as AuditoriaId,
                    NVL(SESSIONID, '') as SesionId,
                    NVL(OS_USERNAME, '') as UsuarioOS,
                    NVL(USERHOST, '') as HostUsuario,
                    NVL(TERMINAL, '') as Terminal
                FROM sys.dba_audit_trail 
                WHERE 1=1");

                    using (OracleCommand cmd = new OracleCommand())
                    {
                        cmd.Connection = conexion;

                        // Agregar condiciones y parámetros de manera dinámica
                        sqlBuilder.Append(" AND ((UPPER(OBJ_NAME) = UPPER(:nombreTabla) AND UPPER(OWNER) = UPPER(:esquema))");
                        sqlBuilder.Append(" OR (UPPER(SQL_TEXT) LIKE '%' || UPPER(:nombreTabla) || '%' AND UPPER(OWNER) = UPPER(:esquema)))");

                        cmd.Parameters.Add(new OracleParameter("nombreTabla", OracleDbType.Varchar2) { Value = req.NombreTabla.ToUpper() });
                        cmd.Parameters.Add(new OracleParameter("esquema", OracleDbType.Varchar2) { Value = req.Esquema.ToUpper() });

                        if (req.FechaInicio.HasValue)
                        {
                            sqlBuilder.Append(" AND TIMESTAMP >= :fechaInicio");
                            cmd.Parameters.Add(new OracleParameter("fechaInicio", OracleDbType.Date) { Value = req.FechaInicio.Value });
                        }

                        if (req.FechaFin.HasValue)
                        {
                            sqlBuilder.Append(" AND TIMESTAMP <= :fechaFin");
                            cmd.Parameters.Add(new OracleParameter("fechaFin", OracleDbType.Date) { Value = req.FechaFin.Value });
                        }

                        if (!string.IsNullOrEmpty(req.TipoAccion))
                        {
                            sqlBuilder.Append(" AND UPPER(ACTION_NAME) LIKE '%' || UPPER(:tipoAccion) || '%'");
                            cmd.Parameters.Add(new OracleParameter("tipoAccion", OracleDbType.Varchar2) { Value = req.TipoAccion.ToUpper() });
                        }

                        sqlBuilder.Append(" ORDER BY TIMESTAMP DESC");
                        cmd.CommandText = sqlBuilder.ToString();

                        // Debug información
                        res.Errores.Add($"Debug: SQL generado: {cmd.CommandText}");
                        res.Errores.Add($"Debug: Parámetros: {string.Join(", ", cmd.Parameters.Cast<OracleParameter>().Select(p => $"{p.ParameterName}={p.Value}"))}");

                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var registro = new AuditoriaInfo
                                {
                                    AuditoriaId = Convert.ToInt32(reader["AuditoriaId"]),
                                    NombreTabla = reader["NombreTabla"].ToString().Trim(),
                                    TipoAccion = reader["TipoAccion"].ToString().Trim(),
                                    FechaHora = DateTime.Parse(reader["FechaHora"].ToString()),
                                    Usuario = reader["Usuario"].ToString().Trim(),
                                    SesionId = reader["SesionId"].ToString().Trim(),
                                    Esquema = reader["Esquema"].ToString().Trim(),
                                    ConsultaSQL = reader["ConsultaSQL"].ToString().Trim()
                                };
                                res.Registros.Add(registro);
                            }
                        }
                    }

                    res.Errores.Add($"Debug: Total registros encontrados: {res.Registros.Count}");
                    res.Resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al obtener auditoría: {ex.Message}");
                if (ex.InnerException != null)
                {
                    res.Errores.Add($"Error interno: {ex.InnerException.Message}");
                }
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