using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.IO;
using Oracle.ManagedDataAccess.Client;
using Request;
using Models;
using Response;
using Microsoft.AspNetCore.Mvc;

namespace Logica
{
    public class Respaldo


    {
        private readonly string _connectionString;
        private readonly ILogger<Respaldo> _logger;

        public Respaldo(string connectionString, ILogger<Respaldo> logger)
        {
            _connectionString = connectionString;
            _logger = logger;
        }

        // Verificar si el directorio ya existe
        private bool DirectorioExiste(string nombreDirectorio)
        {
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();
                string sql = $"SELECT COUNT(*) FROM all_directories WHERE directory_name = '{nombreDirectorio.ToUpper()}'";
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    return Convert.ToInt32(cmd.ExecuteScalar()) > 0;
                }
            }
        }

        private bool SaveInfoDirectorio(string nombre, string nombreDirectorio, string tipo, string nombreSchema, string nombreTable)
        {
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                _logger.LogInformation("-----------------Ejecutando el saveInfoDirectorio");
                conexion.Open();
                string sql = $"INSERT INTO ADMINDB.BACKUPS (nombre_backup, directorio, tipo_backup, name_schema, name_table) VALUES ('{nombre}', '{nombreDirectorio}', '{tipo}', '{nombreSchema}', '{nombreTable}')";
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    return cmd.ExecuteNonQuery() > 0;
                }
            }
        }

        private bool OtorgarPermisos(String nombreDirectorio, String nombreSchema)
        {
            // Otorgar permisos
            _logger.LogInformation("Otorgando permisos");
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();  // Asegúrate de abrir la conexión
                string sqlOtorgarPermisos = $"GRANT READ, WRITE ON DIRECTORY {nombreDirectorio} TO {nombreSchema}";
                using (OracleCommand cmd = new OracleCommand(sqlOtorgarPermisos, conexion))
                {
                    _logger.LogInformation("Permisos otrogados exitosamente?");
                    cmd.ExecuteNonQuery();
                    _logger.LogInformation("Permisos otorgados exitosamente efectivamenete");
                    return true;
                }
            }
        }


        public ResRespaldoSchema RespaldarSchema(ReqRespaldoSchema req)
        {
            ResRespaldoSchema res = new ResRespaldoSchema();
            res.errores = new List<string>();

            try
            {
                _logger.LogInformation("Iniciando respaldo para el esquema: {NombreEsquema}", req.nombreSchema);

                if (string.IsNullOrWhiteSpace(req.directorio))
                {
                    res.errores.Add("Directorio no permitido.");
                    return res;
                }

                // Generar el nombre de respaldo específico
                string nombreRespaldo = $"{req.nombreSchema}_BACKUP";

                // Verificar si el directorio ya existe
                if (!DirectorioExiste(req.directorio))
                {
                    _logger.LogInformation("El directorio {NombreDirectorio} no existe, creando.", req.directorio);
                    // Crear directorio
                    res.errores.Add($"No se encontro el directorio {req.directorio}.");
                }
                if (!OtorgarPermisos(req.directorio, req.nombreSchema))
                {
                    res.errores.Add($"No se pudieron otorgar permisos para el directorio {req.directorio}.");
                    return res;
                }
                // Ejecutar el respaldo con Data Pump
                string expdpCommand = $"expdp {req.nombreSchema}/{req.contrasenaSchema}@XE " +
                                      $"SCHEMAS={req.nombreSchema} " +
                                      $"DIRECTORY={req.directorio} " +
                                      $"DUMPFILE={nombreRespaldo}.DMP " +
                                      $"LOGFILE={nombreRespaldo}.LOG REUSE_DUMPFILES=Y";

                _logger.LogInformation("Ejecutando el comando de respaldo: {Comando}", expdpCommand);

                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {expdpCommand}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                };

                using (Process process = Process.Start(startInfo))
                {
                    if (process == null)
                    {
                        res.errores.Add("No se pudo iniciar el proceso de respaldo.");
                        return res;
                    }

                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();

                    _logger.LogInformation("Salida del comando: {Salida}", output);
                    _logger.LogError("Error del comando: {Error}", error);

                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al ejecutar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        // Guardar la información del respaldo en la base de datos
                        if (!SaveInfoDirectorio(nombreRespaldo, req.directorio, "schema", req.nombreSchema, "N/A"))
                        {
                            res.errores.Add("Error al guardar información del respaldo en la base de datos.");
                            res.resultado = false;
                        }
                        else
                        {
                            _logger.LogInformation("Todo salió bien.");
                            res.resultado = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al respaldar el esquema {NombreEsquema}", req.nombreSchema);
                res.errores.Add($"Error al respaldar el esquema: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        public ResRespaldoTabla RespaldarTabla(ReqRespaldoTabla req)
        {
            ResRespaldoTabla res = new ResRespaldoTabla();
            res.errores = new List<string>();
            _logger.LogInformation("Inicio del respaldo para la tabla {NombreTabla} en el esquema {NombreEsquema} en el directorio {directoreio}", req.nombreTabla, req.nombreSchema, req.directorio);

            try
            {
                // Validar si el directorio base es uno de los permitidos
          
                if (req.directorio == null)
                {
                    res.errores.Add("Directorio no permitido.");
                    return res;
                }

                // Generar el nombre de respaldo específico para la tabla
                string nombreRespaldo = $"{req.nombreSchema}_{req.nombreTabla}_BACKUP";
                _logger.LogInformation("--1");
                // Verificar si el directorio ya existe
                if (!DirectorioExiste(req.directorio))
                {
                    _logger.LogInformation("El directorio {NombreDirectorio} no existe", req.directorio);
                    // Crear directorio
                    res.errores.Add($"No se encontro el directorio {req.directorio}.");
                }
                if (!OtorgarPermisos(req.directorio, req.nombreSchema))
                {
                    res.errores.Add($"No se pudieron otorgar permisos para el directorio {req.directorio}.");
                    return res;
                }
                _logger.LogInformation("--2");
                // Ejecutar el respaldo con Data Pump
                string expdpCommand = $"expdp {req.nombreSchema}/{req.contrasenaSchema}@XE " +
                                      $"TABLES={req.nombreSchema}.{req.nombreTabla} " +
                                      $"DIRECTORY={req.directorio} " +
                                      $"DUMPFILE={nombreRespaldo}.DMP " +
                                      $"LOGFILE={nombreRespaldo}.LOG REUSE_DUMPFILES=Y";
                _logger.LogInformation("El comando es {comando}", expdpCommand);
                var startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {expdpCommand}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                _logger.LogInformation("--3");
                using (var process = Process.Start(startInfo))
                {
                    if (process == null)
                    {
                        res.errores.Add("No se pudo iniciar el proceso de respaldo.");
                        return res;
                    }
                    _logger.LogInformation("--4");
                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();

                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al realizar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        _logger.LogInformation("--5");
                        // Guardar la información del respaldo en la base de datos
                        if (!SaveInfoDirectorio(nombreRespaldo, req.directorio, "table", req.nombreSchema, req.nombreTabla))
                        {
                            res.errores.Add("Error al guardar información del respaldo en la base de datos.");
                            res.resultado = false;
                        }
                        else
                        {
                            res.resultado = true;
                            _logger.LogInformation("--6");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error al guardar el respaldo en la base de datos: {Message}", ex.Message);
                res.errores.Add($"Excepción: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }


        public ResRespaldoCompleto RespaldarBaseDeDatos(ReqRespaldoCompleto req)
        {
            ResRespaldoCompleto res = new ResRespaldoCompleto();
            res.errores = new List<string>();

            try
            {
                if (req.directorio == null)
                {
                    res.errores.Add("Directorio no permitido.");
                    return res;
                }

                // Crear el directorio en Oracle si no existe
                if (!DirectorioExiste(req.directorio))
                {
                    _logger.LogInformation("El directorio {NombreDirectorio} no existe", req.directorio);
                    res.errores.Add($"No se encontro el directorio {req.directorio}.");
                }
                _logger.LogInformation("--1");
                string nombreRespaldo = "XE_FULL_BACKUP";

                // Preparar el comando para el respaldo usando Data Pump
                string expdpCommand = $"expdp SYSTEM/{req.contrasena}@XE FULL=Y DIRECTORY={req.directorio} DUMPFILE={nombreRespaldo}.DMP LOGFILE={nombreRespaldo}.LOG REUSE_DUMPFILES=Y";
                _logger.LogInformation("Comando expdp {comando}", expdpCommand);
                _logger.LogInformation("--2");
                var startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {expdpCommand}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                };
                _logger.LogInformation("--3");
                using (Process process = Process.Start(startInfo))
                {
                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();
                    _logger.LogInformation("--4");
                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al ejecutar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        _logger.LogInformation("--5");
                        // Guardar la información del respaldo en la base de datos
                        if (!SaveInfoDirectorio(nombreRespaldo, req.directorio, "full", "N/A", "N/A"))
                        {
                            res.errores.Add("Error al guardar información del respaldo en la base de datos.");
                            res.resultado = false;
                        }
                        else
                        {
                            _logger.LogInformation("Todo perfecto");
                            res.resultado = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al respaldar la base de datos: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        private void EjecutarConsultaSQL(string consulta)
        {
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                conexion.Open();
                using (var command = new OracleCommand(consulta, conexion))
                {
                    command.ExecuteNonQuery();
                }
            }
        }

        public RespuestaDirectorios ObtenerDirectorios()
        {
            RespuestaDirectorios respuesta = new RespuestaDirectorios();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "SELECT * FROM ALL_DIRECTORIES";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var directorio = new ModelDirectorio
                                {
                                    NombreDirectorio = reader["DIRECTORY_NAME"].ToString(),
                                    DireccionDirectorio = reader["DIRECTORY_PATH"].ToString(),
                                };
                                respuesta.Directorios.Add(directorio);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                respuesta.Errores.Add($"Error al obtener directorios: {ex.Message}");
            }

            return respuesta;
        }
        public ResRecuperarRespaldo RecuperarRespaldo(ReqRecuperarRespaldo req)
        {
            ResRecuperarRespaldo res = new ResRecuperarRespaldo();
            _logger.LogInformation("--1");
            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string directorio = null;
                    string nombreSchema = null;
                    string nombreTabla = null;

                    // Definir la consulta SQL según el tipo de respaldo
                    string sql = req.TipoBackup switch
                    {
                        "table" => $"SELECT directorio, name_schema, name_table FROM ADMINDB.BACKUPS WHERE nombre_backup = '{req.NombreBackup}' AND tipo_backup = '{req.TipoBackup}' AND ROWNUM = 1",
                        "schema" => $"SELECT directorio, name_schema FROM ADMINDB.BACKUPS WHERE nombre_backup = '{req.NombreBackup}' AND tipo_backup = '{req.TipoBackup}' AND ROWNUM = 1",
                        "full" => $"SELECT directorio FROM ADMINDB.BACKUPS WHERE nombre_backup = '{req.NombreBackup}' AND tipo_backup = '{req.TipoBackup}' AND ROWNUM = 1",
                        _ => throw new ArgumentException("Tipo de respaldo no válido.")
                    };
                    _logger.LogInformation("Consulta SQL {consulta}", sql);
                    _logger.LogInformation("--2");
                    // Ejecutar la consulta y obtener los valores necesarios
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        _logger.LogInformation("--2.5");
                        _logger.LogInformation("EL nombre del backup es {backup} y el nombde del tipo es {tipo}", req.NombreBackup, req.TipoBackup);
                        _logger.LogInformation("--2.7");
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            _logger.LogInformation("--3");
                            if (reader.Read())
                            {
                                directorio = reader.GetString(0);
                                if (req.TipoBackup != "full") nombreSchema = reader.GetString(1);
                                if (req.TipoBackup == "table") nombreTabla = reader.GetString(2);
                                _logger.LogInformation("--4");
                            }
                            else
                            {
                                _logger.LogInformation("No se encontró el respaldo especificado.");
                                res.Errores.Add("No se encontró el respaldo especificado.");
                                return res;
                            }
                        }
                    }
                    _logger.LogInformation("--5");
                    // Construir el comando IMPDP según el tipo de respaldo
                    string impdpCommand = req.TipoBackup switch
                    {
                        "table" => $"IMPDP {nombreSchema}/{req.Contrasena}@XE TABLES={nombreSchema}.{nombreTabla} DIRECTORY={directorio} DUMPFILE={req.NombreBackup}.DMP LOGFILE={req.NombreBackup}.LOG",
                        "schema" => $"IMPDP {nombreSchema}/{req.Contrasena}@XE SCHEMAS={nombreSchema} DIRECTORY={directorio} DUMPFILE={req.NombreBackup}.DMP LOGFILE={req.NombreBackup}.LOG",
                        "full" => $"IMPDP SYSTEM/{req.Contrasena}@XE FULL=Y DIRECTORY={directorio} DUMPFILE={req.NombreBackup}.DMP LOGFILE={req.NombreBackup}.LOG",
                        _ => throw new ArgumentException("Tipo de respaldo no válido.")
                    };
                    _logger.LogInformation("--Comando IMPDP {comando}", impdpCommand);
                    // Ejecutar el comando en el sistema
                    var startInfo = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = $"/C {impdpCommand}",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                    };
                    _logger.LogInformation("--6");

                    using (Process process = Process.Start(startInfo))
                    {
                        string output = process.StandardOutput.ReadToEnd();
                        string error = process.StandardError.ReadToEnd();
                        process.WaitForExit();
                        _logger.LogInformation("--7");
                        if (process.ExitCode != 0)
                        {
                            _logger.LogInformation("--Error al ejecutar la recuperación : {error}", error);
                            res.Errores.Add($"Error al ejecutar la recuperación: {error}");
                            res.Resultado = false;
                        }
                        else
                        {
                            _logger.LogInformation("--Todo super bien");
                            res.Resultado = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Errores.Add($"Error al recuperar el respaldo: {ex.Message}");
                res.Resultado = false;
            }

            return res;
        }
    }
}
