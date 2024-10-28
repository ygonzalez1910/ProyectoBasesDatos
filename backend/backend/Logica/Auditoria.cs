using Oracle.ManagedDataAccess.Client;
using Microsoft.Extensions.Configuration;
using Logica.Request;
using Logica.Response;
using System.Collections.Generic;
using System;
using System.Linq;

namespace Logica
{
    public class Auditoria
    {
        private readonly string _connectionString;

        public Auditoria(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("OracleDb");
        }

        public ResEstadoAuditoria ObtenerEstadoAuditoria()
        {
            var res = new ResEstadoAuditoria();
            res.Exitoso = false;

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    string sqlAuditEnabled = @"
                    SELECT COUNT(*) 
                    FROM V$OPTION 
                    WHERE PARAMETER = 'Unified Auditing' 
                    AND VALUE = 'TRUE'";

                    using (OracleCommand cmd = new OracleCommand(sqlAuditEnabled, conexion))
                    {
                        int unifiedAuditEnabled = Convert.ToInt32(cmd.ExecuteScalar());

                        string sqlObjetosAuditados = @"
                        SELECT OWNER, OBJECT_NAME, OBJECT_TYPE,
                               ALT, AUD, COM, DEL, GRA, IND,
                               INS, LOC, REN, SEL, UPD
                        FROM DBA_OBJ_AUDIT_OPTS
                        WHERE OWNER = 'SYS'";

                        List<string> objetosAuditados = new List<string>();
                        using (OracleCommand cmdObjetos = new OracleCommand(sqlObjetosAuditados, conexion))
                        using (OracleDataReader reader = cmdObjetos.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                string objName = reader["OBJECT_NAME"].ToString();
                                List<string> opciones = new List<string>();

                                if (reader["SEL"].ToString() == "A/A") opciones.Add("SELECT");
                                if (reader["INS"].ToString() == "A/A") opciones.Add("INSERT");
                                if (reader["UPD"].ToString() == "A/A") opciones.Add("UPDATE");
                                if (reader["DEL"].ToString() == "A/A") opciones.Add("DELETE");

                                if (opciones.Count > 0)
                                {
                                    objetosAuditados.Add($"{reader["OWNER"]}.{objName} - {string.Join(", ", opciones)}");
                                }
                            }
                        }

                        string sqlRegistrosRecientes = @"
                        SELECT COUNT(*) 
                        FROM UNIFIED_AUDIT_TRAIL 
                        WHERE event_timestamp >= SYSTIMESTAMP - INTERVAL '24' HOUR";

                        int registrosRecientes = 0;
                        using (OracleCommand cmdRegistros = new OracleCommand(sqlRegistrosRecientes, conexion))
                        {
                            registrosRecientes = Convert.ToInt32(cmdRegistros.ExecuteScalar());
                        }

                        res.ValorAuditTrail = "DB";
                        res.AuditoriaHabilitada = unifiedAuditEnabled > 0 || objetosAuditados.Count > 0;
                        res.RequiereReinicio = false;
                        res.ObjetosAuditados = objetosAuditados;
                        res.RegistrosUltimas24Horas = registrosRecientes;

                        res.Exitoso = true;
                        res.Mensaje = $"Auditoría actualmente {(res.AuditoriaHabilitada ? "habilitada" : "deshabilitada")}";
                    }
                }
            }
            catch (Exception ex)
            {
                res.Mensaje = $"Error al obtener estado de auditoría: {ex.Message}";
            }

            return res;
        }

        public ResAuditoriaConexiones ConfigurarAuditoriaConexiones(ReqAuditoria req)
        {
            var res = new ResAuditoriaConexiones
            {
                Exitoso = false
            };

            try
            {
                if (req?.ConfigConexiones == null)
                {
                    res.Mensaje = "La configuración de conexiones es requerida";
                    return res;
                }

                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    if (req.ConfigConexiones.RegistrarExitosos || req.ConfigConexiones.RegistrarFallidos)
                    {
                        using (OracleCommand cmd = new OracleCommand("NOAUDIT SESSION", conexion))
                        {
                            cmd.ExecuteNonQuery();
                        }

                        string auditCommand = "AUDIT SESSION";
                        if (req.ConfigConexiones.RegistrarExitosos && !req.ConfigConexiones.RegistrarFallidos)
                        {
                            auditCommand += " WHENEVER SUCCESSFUL";
                        }
                        else if (!req.ConfigConexiones.RegistrarExitosos && req.ConfigConexiones.RegistrarFallidos)
                        {
                            auditCommand += " WHENEVER NOT SUCCESSFUL";
                        }

                        using (OracleCommand cmd = new OracleCommand(auditCommand, conexion))
                        {
                            cmd.ExecuteNonQuery();
                        }

                        res.AuditoriaHabilitada = true;
                        res.AuditandoExitosas = req.ConfigConexiones.RegistrarExitosos;
                        res.AuditandoFallidas = req.ConfigConexiones.RegistrarFallidos;
                        res.ObjetosAuditados.Add("SESSION");
                    }
                    else
                    {
                        using (OracleCommand cmd = new OracleCommand("NOAUDIT SESSION", conexion))
                        {
                            cmd.ExecuteNonQuery();
                        }
                    }

                    using (OracleCommand cmd = new OracleCommand(@"
                SELECT 
                    COUNT(*) as total,
                    COUNT(CASE WHEN returncode = 0 THEN 1 END) as exitosos,
                    COUNT(CASE WHEN returncode != 0 THEN 1 END) as fallidos,
                    MAX(CASE WHEN returncode = 0 THEN timestamp END) as ultima_exitosa,
                    MAX(CASE WHEN returncode != 0 THEN timestamp END) as ultima_fallida
                FROM DBA_AUDIT_TRAIL 
                WHERE action_name = 'LOGON'
                AND timestamp > SYSTIMESTAMP - INTERVAL '1' DAY", conexion))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                res.Estadisticas.TotalConexiones = reader.IsDBNull(reader.GetOrdinal("total")) ? 0 : Convert.ToInt32(reader["total"]);
                                res.Estadisticas.ConexionesExitosas = reader.IsDBNull(reader.GetOrdinal("exitosos")) ? 0 : Convert.ToInt32(reader["exitosos"]);
                                res.Estadisticas.ConexionesFallidas = reader.IsDBNull(reader.GetOrdinal("fallidos")) ? 0 : Convert.ToInt32(reader["fallidos"]);

                                if (!reader.IsDBNull(reader.GetOrdinal("ultima_exitosa")))
                                {
                                    res.Estadisticas.UltimaConexionExitosa = reader.GetDateTime(reader.GetOrdinal("ultima_exitosa"));
                                }

                                if (!reader.IsDBNull(reader.GetOrdinal("ultima_fallida")))
                                {
                                    res.Estadisticas.UltimaConexionFallida = reader.GetDateTime(reader.GetOrdinal("ultima_fallida"));
                                }
                            }
                        }
                    }

                    res.Exitoso = true;
                    res.Mensaje = $"Configuración de auditoría de conexiones actualizada exitosamente. " +
                                 $"Últimas 24h: {res.Estadisticas.ConexionesExitosas} conexiones exitosas, " +
                                 $"{res.Estadisticas.ConexionesFallidas} fallidas.";
                }

                return res;
            }
            catch (Exception ex)
            {
                res.Mensaje = $"Error general al configurar auditoría de conexiones: {ex.Message}";
                return res;
            }
        }

        public ResAuditoriaTablas ConfigurarAuditoriaTablas(List<ReqAuditoriaTablas> req)
        {
            var res = new ResAuditoriaTablas();

            try
            {
                if (req == null || !req.Any())
                {
                    res.Mensaje = "La configuración de tablas es requerida";
                    res.Exitoso = false;
                    return res;
                }

                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    foreach (var tabla in req)
                    {
                        if (string.IsNullOrEmpty(tabla.NombreTabla) || tabla.Configuraciones == null || !tabla.Configuraciones.Any())
                        {
                            continue;
                        }

                        var tablaAuditada = new ResAuditoriaTablas.TablaAuditada
                        {
                            NombreTabla = tabla.NombreTabla,
                            OperacionesAuditadas = new List<string>()
                        };

                        // Separar operaciones a auditar y no auditar
                        var operacionesAuditar = tabla.Configuraciones
                            .Where(c => c.Auditar)
                            .Select(c => c.Accion.ToUpper())
                            .ToList();

                        var operacionesNoAuditar = tabla.Configuraciones
                            .Where(c => !c.Auditar)
                            .Select(c => c.Accion.ToUpper())
                            .ToList();

                        // Aplicar AUDIT para operaciones activadas
                        if (operacionesAuditar.Any())
                        {
                            string auditCommand = $"AUDIT {string.Join(", ", operacionesAuditar)} ON {tabla.NombreTabla}";
                            using (OracleCommand cmd = new OracleCommand(auditCommand, conexion))
                            {
                                cmd.ExecuteNonQuery();
                            }
                            tablaAuditada.OperacionesAuditadas.AddRange(operacionesAuditar);
                        }

                        // Aplicar NOAUDIT para operaciones desactivadas
                        if (operacionesNoAuditar.Any())
                        {
                            string noAuditCommand = $"NOAUDIT {string.Join(", ", operacionesNoAuditar)} ON {tabla.NombreTabla}";
                            using (OracleCommand cmd = new OracleCommand(noAuditCommand, conexion))
                            {
                                cmd.ExecuteNonQuery();
                            }
                        }

                        res.TablasConfiguradas.Add(tablaAuditada);
                    }

                    res.Exitoso = true;
                    res.Mensaje = $"Se configuró la auditoría para {res.TablasConfiguradas.Count} tabla(s)";
                }
            }
            catch (Exception ex)
            {
                res.Exitoso = false;
                res.Mensaje = $"Error al configurar auditoría de tablas: {ex.Message}";
            }

            return res;
        }


        public ResAuditoriaAcciones ConfigurarAuditoriaAcciones(ReqAuditoriaAcciones req)
        {
            var res = new ResAuditoriaAcciones
            {
                Exitoso = false,
                AccionesConfiguradas = new List<ResAuditoriaAcciones.AccionAuditada>()
            };

            try
            {
                if (req?.Configuraciones == null || req.Configuraciones.Count == 0)
                {
                    res.Mensaje = "La configuración de acciones es requerida";
                    return res;
                }

                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    foreach (var config in req.Configuraciones)
                    {
                        var accionAuditada = new ResAuditoriaAcciones.AccionAuditada
                        {
                            Accion = config.Accion,
                            Auditada = config.Auditar
                        };

                        try
                        {
                            string comando = config.Auditar
                                ? $"AUDIT {config.Accion}"
                                : $"NOAUDIT {config.Accion}";

                            using (OracleCommand cmd = new OracleCommand(comando, conexion))
                            {
                                cmd.ExecuteNonQuery();
                            }

                            res.AccionesConfiguradas.Add(accionAuditada);
                        }
                        catch (Exception ex)
                        {
                            // Si falla una acción específica, la agregamos con el estado actual
                            // pero continuamos con las demás
                            res.Mensaje += $"\nError en {config.Accion}: {ex.Message}";
                        }
                    }

                    res.Exitoso = res.AccionesConfiguradas.Count > 0;
                    if (string.IsNullOrEmpty(res.Mensaje))
                    {
                        res.Mensaje = $"Se configuró la auditoría para {res.AccionesConfiguradas.Count} accion(es)";
                    }
                    else if (res.Exitoso)
                    {
                        res.Mensaje = $"Se configuraron {res.AccionesConfiguradas.Count} accion(es) con algunos errores: {res.Mensaje}";
                    }
                }
            }
            catch (Exception ex)
            {
                res.Mensaje = $"Error general al configurar auditoría de acciones: {ex.Message}";
            }

            return res;
        }


        public ResAuditoria ConsultarRegistrosAuditoria(ReqAuditoria req)
        {
            ResAuditoria res = new ResAuditoria();
            res.Exitoso = false;
            res.Registros = new List<ResAuditoria.RegistroAuditoria>();

            try
            {
                if (req?.Filtros == null)
                {
                    res.Mensaje = "Los filtros de consulta son requeridos";
                    return res;
                }

                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    string sql = @"
                SELECT 
                    TO_CHAR(TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS') as FECHA_HORA,
                    USERNAME,
                    ACTION_NAME,
                    OBJ_NAME,
                    RETURNCODE,
                    USERHOST,
                    OS_USERNAME,
                    TIMESTAMP as EXTENDED_TIMESTAMP,
                    COMMENT_TEXT,
                    SESSIONID,
                    ENTRYID,
                    STATEMENTID,
                    PRIV_USED
                FROM DBA_AUDIT_TRAIL
                WHERE 1=1";

                    if (req.Filtros.FechaInicio.HasValue)
                        sql += " AND TIMESTAMP >= :fechaInicio";
                    if (req.Filtros.FechaFin.HasValue)
                        sql += " AND TIMESTAMP <= :fechaFin";
                    if (!string.IsNullOrEmpty(req.Filtros.Usuario))
                        sql += " AND USERNAME = :usuario";
                    if (!string.IsNullOrEmpty(req.Filtros.ObjetoAccedido))
                        sql += " AND OBJ_NAME = :objeto";
                    if (!string.IsNullOrEmpty(req.Filtros.TipoAccion))
                        sql += " AND ACTION_NAME = :accion";

                    sql += " ORDER BY TIMESTAMP DESC";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        if (req.Filtros.FechaInicio.HasValue)
                            cmd.Parameters.Add(new OracleParameter("fechaInicio", req.Filtros.FechaInicio.Value));
                        if (req.Filtros.FechaFin.HasValue)
                            cmd.Parameters.Add(new OracleParameter("fechaFin", req.Filtros.FechaFin.Value));
                        if (!string.IsNullOrEmpty(req.Filtros.Usuario))
                            cmd.Parameters.Add(new OracleParameter("usuario", req.Filtros.Usuario));
                        if (!string.IsNullOrEmpty(req.Filtros.ObjetoAccedido))
                            cmd.Parameters.Add(new OracleParameter("objeto", req.Filtros.ObjetoAccedido));
                        if (!string.IsNullOrEmpty(req.Filtros.TipoAccion))
                            cmd.Parameters.Add(new OracleParameter("accion", req.Filtros.TipoAccion));

                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.Registros.Add(new ResAuditoria.RegistroAuditoria
                                {
                                    FechaHora = DateTime.Parse(reader.GetString(0)),
                                    Usuario = reader.GetString(1),
                                    TipoAccion = reader.GetString(2),
                                    ObjetoAccedido = reader.IsDBNull(3) ? null : reader.GetString(3),
                                    Exitoso = reader.GetInt32(4) == 0,
                                    Terminal = reader.GetString(5),
                                    Detalles = reader.GetString(7).ToString()
                                });
                            }
                        }
                    }

                    res.Exitoso = true;
                    res.Mensaje = $"Se encontraron {res.Registros.Count} registros";
                    res.Resumen = new ResAuditoria.ResumenAuditoria
                    {
                        TotalRegistros = res.Registros.Count,
                        IntentosExitosos = res.Registros.Count(r => r.Exitoso),
                        IntentosFallidos = res.Registros.Count(r => !r.Exitoso),
                        UltimaActividad = res.Registros.Any() ?
                            res.Registros.Max(r => r.FechaHora) :
                            DateTime.MinValue
                    };
                }
            }
            catch (Exception ex)
            {
                res.Mensaje = $"Error al consultar registros de auditoría: {ex.Message}";
            }

            return res;
        }
        public ResAuditoria ConsultarResumenAuditoria()
        {
            ResAuditoria res = new ResAuditoria();
            res.Exitoso = false;

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    string sql = @"
                SELECT 
                    USERNAME,
                    ACTION_NAME,
                    COUNT(*) as TOTAL_ACCIONES,
                    SUM(CASE WHEN RETURNCODE = 0 THEN 1 ELSE 0 END) as EXITOSOS,
                    SUM(CASE WHEN RETURNCODE != 0 THEN 1 ELSE 0 END) as FALLIDOS
                FROM DBA_AUDIT_TRAIL
                GROUP BY USERNAME, ACTION_NAME
                ORDER BY USERNAME, TOTAL_ACCIONES DESC";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    using (OracleDataReader reader = cmd.ExecuteReader())
                    {
                        int totalRegistros = 0;
                        int totalExitosos = 0;
                        int totalFallidos = 0;

                        while (reader.Read())
                        {
                            int acciones = reader.GetInt32(2);
                            int exitosos = reader.GetInt32(3);
                            int fallidos = reader.GetInt32(4);

                            totalRegistros += acciones;
                            totalExitosos += exitosos;
                            totalFallidos += fallidos;
                        }

                        res.Resumen = new ResAuditoria.ResumenAuditoria
                        {
                            TotalRegistros = totalRegistros,
                            IntentosExitosos = totalExitosos,
                            IntentosFallidos = totalFallidos,
                            UltimaActividad = DateTime.Now
                        };

                        res.Exitoso = true;
                        res.Mensaje = $"Se encontraron {totalRegistros} registros en total";
                    }
                }
            }
            catch (Exception ex)
            {
                res.Mensaje = $"Error al consultar resumen de auditoría: {ex.Message}";
            }

            return res;
        }
    }
}