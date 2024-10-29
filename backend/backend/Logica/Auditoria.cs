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
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
                    SELECT 
                        AUDIT_ID as AuditoriaId,
                        TABLE_NAME as NombreTabla,
                        ACTION_NAME as TipoAccion,
                        TIMESTAMP as FechaHora,
                        DB_USER as Usuario,
                        SESSIONID as SesionId,
                        OBJ_SCHEMA as Esquema,
                        SQL_TEXT as ConsultaSQL
                    FROM sys.dba_audit_trail 
                    WHERE TABLE_NAME = :nombreTabla";

                    if (req.FechaInicio.HasValue)
                        sql += " AND TIMESTAMP >= :fechaInicio";
                    if (req.FechaFin.HasValue)
                        sql += " AND TIMESTAMP <= :fechaFin";
                    if (!string.IsNullOrEmpty(req.TipoAccion))
                        sql += " AND ACTION_NAME = :tipoAccion";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("nombreTabla", req.NombreTabla));

                        if (req.FechaInicio.HasValue)
                            cmd.Parameters.Add(new OracleParameter("fechaInicio", req.FechaInicio.Value));
                        if (req.FechaFin.HasValue)
                            cmd.Parameters.Add(new OracleParameter("fechaFin", req.FechaFin.Value));
                        if (!string.IsNullOrEmpty(req.TipoAccion))
                            cmd.Parameters.Add(new OracleParameter("tipoAccion", req.TipoAccion));

                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.Registros.Add(new AuditoriaInfo
                                {
                                    AuditoriaId = Convert.ToInt32(reader["AuditoriaId"]),
                                    NombreTabla = reader["NombreTabla"].ToString(),
                                    TipoAccion = reader["TipoAccion"].ToString(),
                                    FechaHora = Convert.ToDateTime(reader["FechaHora"]),
                                    Usuario = reader["Usuario"].ToString(),
                                    SesionId = reader["SesionId"].ToString(),
                                    Esquema = reader["Esquema"].ToString(),
                                    ConsultaSQL = reader["ConsultaSQL"].ToString()
                                });
                            }
                        }
                    }
                    res.Resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al obtener auditoría: {ex.Message}");
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

                    string accionesConcatenadas = string.Join(", ", acciones);
                    string sql = $"AUDIT {accionesConcatenadas} ON {req.NombreTabla} BY ACCESS";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    res.Resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al activar auditoría: {ex.Message}");
                res.Resultado = false;
            }

            return res;
        }
    }
}