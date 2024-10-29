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
    public class Auditoria
    {
        private readonly string _connectionString;

        public Auditoria(string connectionString)
        {
            _connectionString = connectionString;
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

                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
    SELECT 
        NVL(ENTRYID, 0) as AuditoriaId,
        NVL(OBJ_NAME, '') as NombreTabla,
        NVL(ACTION_NAME, '') as TipoAccion,
        NVL(TIMESTAMP, SYSDATE) as FechaHora,
        NVL(USERNAME, '') as Usuario,
        NVL(SESSIONID, '') as SesionId,
        NVL(OWNER, '') as Esquema,
        NVL(SQL_TEXT, '') as ConsultaSQL
    FROM sys.dba_audit_trail 
    WHERE OBJ_NAME = :nombreTabla";

                    if (req.FechaInicio.HasValue)
                        sql += " AND CAST(TIMESTAMP AS DATE) >= CAST(:fechaInicio AS DATE)";
                    if (req.FechaFin.HasValue)
                        sql += " AND CAST(TIMESTAMP AS DATE) <= CAST(:fechaFin AS DATE)";
                    if (!string.IsNullOrEmpty(req.TipoAccion))
                        sql += " AND UPPER(ACTION_NAME) = UPPER(:tipoAccion)";

                    sql += " ORDER BY TIMESTAMP DESC";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        // Configurar parámetros con tipo de datos específico
                        cmd.Parameters.Add(new OracleParameter("nombreTabla", OracleDbType.Varchar2)
                        {
                            Value = req.NombreTabla.ToUpper()
                        });

                        if (req.FechaInicio.HasValue)
                            cmd.Parameters.Add(new OracleParameter("fechaInicio", OracleDbType.Date)
                            {
                                Value = req.FechaInicio.Value
                            });

                        if (req.FechaFin.HasValue)
                            cmd.Parameters.Add(new OracleParameter("fechaFin", OracleDbType.Date)
                            {
                                Value = req.FechaFin.Value
                            });

                        if (!string.IsNullOrEmpty(req.TipoAccion))
                            cmd.Parameters.Add(new OracleParameter("tipoAccion", OracleDbType.Varchar2)
                            {
                                Value = req.TipoAccion.ToUpper()
                            });

                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var registro = new AuditoriaInfo
                                {
                                    AuditoriaId = Convert.ToInt32(reader["AuditoriaId"]),
                                    NombreTabla = reader["NombreTabla"].ToString().Trim(),
                                    TipoAccion = reader["TipoAccion"].ToString().Trim(),
                                    FechaHora = Convert.ToDateTime(reader["FechaHora"]),
                                    Usuario = reader["Usuario"].ToString().Trim(),
                                    SesionId = reader["SesionId"].ToString().Trim(),
                                    Esquema = reader["Esquema"].ToString().Trim(),
                                    ConsultaSQL = reader["ConsultaSQL"].ToString().Trim()
                                };
                                res.Registros.Add(registro);
                            }
                        }
                    }
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
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    List<string> acciones = new List<string>();

                    if (req.AuditarInsert) acciones.Add("INSERT");
                    if (req.AuditarUpdate) acciones.Add("UPDATE");
                    if (req.AuditarDelete) acciones.Add("DELETE");
                    if (req.AuditarSelect) acciones.Add("SELECT");

                    // Construcción de la sentencia SQL para activar la auditoría
                    string accionesConcatenadas = string.Join(", ", acciones);
                    string sql = $"AUDIT {accionesConcatenadas} ON {req.NombreTabla} BY ACCESS";

                    try
                    {
                        using (OracleCommand cmd = new OracleCommand(sql, conexion))
                        {
                            cmd.ExecuteNonQuery();
                        }

                        res.Resultado = true;
                    }
                    catch (OracleException ex) when (ex.Number == 942) // ORA-00942: Table or view does not exist
                    {
                        res.Errores.Add($"Error al activar auditoría: La tabla o vista '{req.NombreTabla}' no existe o no se puede acceder.");
                        res.Errores.Add("Verifique que el nombre de la tabla esté correcto y que el usuario tenga permisos de auditoría para esta tabla.");
                        res.Resultado = false;
                    }
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al activar auditoría: {ex.Message}");
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