﻿using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.IO;
using backend.Request;
using backend.Response;
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

        public ResCrearDirectorio CrearDirectorio(ReqCrearDirectorio req)
        {
            ResCrearDirectorio res = new ResCrearDirectorio();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    // Crear directorio
                    string sqlCrearDirectorio = $"CREATE OR REPLACE DIRECTORY {req.nombreDirectorio} AS '{req.directorio}'";
                    using (OracleCommand cmd = new OracleCommand(sqlCrearDirectorio, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    // Otorgar permisos
                    string sqlOtorgarPermisos = $"GRANT READ, WRITE ON DIRECTORY {req.nombreDirectorio} TO {req.nombreSchema}";
                    using (OracleCommand cmd = new OracleCommand(sqlOtorgarPermisos, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al crear directorio: {ex.Message}");
                res.resultado = false;
            }

            return res;
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

        private bool SaveInfoDirectorio(string nombre, string nombreDirectorio, string tipo)
        {
            using (OracleConnection conexion = new OracleConnection(_connectionString))
            {
                _logger.LogInformation("-----------------Ejecutando el saveInfoDirectorio");
                conexion.Open();
                string sql = $"INSERT INTO ADMINDB.BACKUPS (nombre_backup, directorio, tipo_backup) VALUES ('{nombre}', '{nombreDirectorio}', '{tipo}')";
                using (OracleCommand cmd = new OracleCommand(sql, conexion))
                {
                    return cmd.ExecuteNonQuery() > 0;
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

                // Verificar si el directorio base es uno de los permitidos
                string nombreDirectorio = null;
                if (req.directorio == @"C:\ORACLE_FILES\HD1")
                    nombreDirectorio = "HD1";
                else if (req.directorio == @"C:\ORACLE_FILES\HD2")
                    nombreDirectorio = "HD2";
                else if (req.directorio == @"C:\ORACLE_FILES\HD3")
                    nombreDirectorio = "HD3";

                if (nombreDirectorio == null)
                {
                    res.errores.Add("Directorio no permitido. Solo se permiten HD1, HD2, o HD3.");
                    return res;
                }

                // Generar el nombre de respaldo específico
                string nombreRespaldo = $"{req.nombreSchema}_BACKUP";

                // Verificar si el directorio ya existe
                if (!DirectorioExiste(nombreDirectorio))
                {
                    _logger.LogInformation("El directorio {NombreDirectorio} no existe, creando.", nombreDirectorio);
                    // Crear directorio
                    var crearDirectorioRes = CrearDirectorio(new ReqCrearDirectorio
                    {
                        directorio = req.directorio, // Usar el directorio base proporcionado
                        nombreDirectorio = nombreDirectorio,
                        nombreSchema = req.nombreSchema
                    });

                    if (!crearDirectorioRes.resultado)
                    {
                        res.errores.AddRange(crearDirectorioRes.errores);
                        return res;
                    }
                }

                // Ejecutar el respaldo con Data Pump
                string expdpCommand = $"expdp {req.nombreSchema}/{req.contrasenaSchema}@XE " +
                                      $"SCHEMAS={req.nombreSchema} " +
                                      $"DIRECTORY={nombreDirectorio} " +
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
                        if (!SaveInfoDirectorio(nombreRespaldo, nombreDirectorio, "schema"))
                        {
                            res.errores.Add("Error al guardar información del respaldo en la base de datos.");
                            res.resultado = false;
                        }
                        else
                        {
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
            _logger.LogInformation("Inicio del respaldo para la tabla {NombreTabla} en el esquema {NombreEsquema}", req.nombreTabla, req.nombreSchema);

            try
            {
                _logger.LogInformation("Comprobando si 1...");

                // Validar si el directorio base es uno de los permitidos
                string nombreDirectorio = null;
                if (req.directorio == @"C:\ORACLE_FILES\HD1")
                    nombreDirectorio = "HD1";
                else if (req.directorio == @"C:\ORACLE_FILES\HD2")
                    nombreDirectorio = "HD2";
                else if (req.directorio == @"C:\ORACLE_FILES\HD3")
                    nombreDirectorio = "HD3";

                if (nombreDirectorio == null)
                {
                    res.errores.Add("Directorio no permitido. Solo se permiten HD1, HD2, o HD3.");
                    return res;
                }

                // Generar el nombre de respaldo específico para la tabla
                string nombreRespaldo = $"{req.nombreSchema}_{req.nombreTabla}_BACKUP";
                _logger.LogInformation("Comprobando si 2...");
                // Verificar si el directorio ya existe
                if (!DirectorioExiste(nombreDirectorio))
                {
                    _logger.LogInformation("El directorio {NombreDirectorio} no existe, creando.", nombreDirectorio);

                    // Crear el directorio si no existe
                    var crearDirectorioRes = CrearDirectorio(new ReqCrearDirectorio
                    {
                        directorio = req.directorio, // Usar el directorio base proporcionado
                        nombreDirectorio = nombreDirectorio,
                        nombreSchema = req.nombreSchema
                    });

                    if (!crearDirectorioRes.resultado)
                    {
                        res.errores.AddRange(crearDirectorioRes.errores);
                        return res;
                    }
                }
                _logger.LogInformation("Comprobando si 3...");
                // Ejecutar el respaldo con Data Pump
                string expdpCommand = $"expdp {req.nombreSchema}/{req.contrasenaSchema}@XE " +
                                      $"TABLES={req.nombreSchema}.{req.nombreTabla} " +
                                      $"DIRECTORY={nombreDirectorio} " +
                                      $"DUMPFILE={nombreRespaldo}.DMP " +
                                      $"LOGFILE={nombreRespaldo}.LOG REUSE_DUMPFILES=Y" ;

                var startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C {expdpCommand}",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                _logger.LogInformation("Comprobando si 4...");
                using (var process = Process.Start(startInfo))
                {
                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();
                    _logger.LogInformation("Comprobando si 5...");
                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al realizar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        // Guardar la información del respaldo en la base de datos
                        _logger.LogInformation("Comprobando si 6...");
                        if (!SaveInfoDirectorio(nombreRespaldo, nombreDirectorio, "table"))
                        {
                            res.errores.Add("Error al guardar información del respaldo en la base de datos.");
                            res.resultado = false;
                            _logger.LogInformation("Comprobando si 7...");
                        }
                        else
                        {
                            res.resultado = true;
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
                // Validar si el directorio base es uno de los permitidos
                string nombreDirectorio = null;
                if (req.directorio == @"C:\ORACLE_FILES\HD1")
                    nombreDirectorio = "HD1";
                else if (req.directorio == @"C:\ORACLE_FILES\HD2")
                    nombreDirectorio = "HD2";
                else if (req.directorio == @"C:\ORACLE_FILES\HD3")
                    nombreDirectorio = "HD3";

                if (nombreDirectorio == null)
                {
                    res.errores.Add("Directorio no permitido. Solo se permiten HD1, HD2, o HD3.");
                    return res;
                }

                // Crear el directorio en Oracle si no existe
                if (!DirectorioExiste(nombreDirectorio))
                {
                    string crearDirectorioCommand = $"CREATE OR REPLACE DIRECTORY {nombreDirectorio} AS '{req.directorio}'";
                    EjecutarConsultaSQL(crearDirectorioCommand);
                }
                string nombreRespaldo = "XE_FULL_BACKUP";

                // Preparar el comando para el respaldo usando Data Pump
                string expdpCommand = $"expdp SYSTEM/{req.contrasena}@XE FULL=Y DIRECTORY={nombreDirectorio} DUMPFILE={nombreRespaldo}.DMP LOGFILE={nombreRespaldo}.LOG REUSE_DUMPFILES=Y";

                var startInfo = new ProcessStartInfo
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
                    string output = process.StandardOutput.ReadToEnd();
                    string error = process.StandardError.ReadToEnd();
                    process.WaitForExit();

                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al ejecutar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        // Guardar la información del respaldo en la base de datos
                        if (!SaveInfoDirectorio(nombreRespaldo, nombreDirectorio, "full"))
                        {
                            res.errores.Add("Error al guardar información del respaldo en la base de datos.");
                            res.resultado = false;
                        }
                        else
                        {
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
                                var directorio = new Directorio
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
    }
}
