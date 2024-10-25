using System;
using System.Collections.Generic;
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

        public Respaldo(string connectionString)
        {
            _connectionString = connectionString;
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

        public ResRespaldoSchema RespaldarSchema(ReqRespaldoSchema req)
        {
            ResRespaldoSchema res = new ResRespaldoSchema();
            res.errores = new List<string>();

            try
            {
                // Generar el nombre del directorio automáticamente
                string nombreDirectorio = $"{req.nombreSchema}_BACKUP";

                // Crear directorio si no existe
                CrearDirectorio(new ReqCrearDirectorio
                {
                    directorio = req.directorio, // Usar el directorio base proporcionado
                    nombreDirectorio = nombreDirectorio,
                    nombreSchema = req.nombreSchema
                });

                // Preparar el comando para el respaldo usando Data Pump
                string expdpCommand = $"expdp {req.nombreSchema}/{req.contrasenaSchema}@XE " +
                                      $"TABLES={req.nombreSchema} " +
                                      $"DIRECTORY={nombreDirectorio} " +
                                      $"DUMPFILE={nombreDirectorio}.DMP " +
                                      $"LOGFILE={nombreDirectorio}.LOG";

                // Ejecutar el comando en el shell
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

                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al ejecutar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        res.resultado = true;
                    }
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al respaldar el esquema: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        public ResRespaldoTabla RespaldarTabla(ReqRespaldoTabla req)
        {
            ResRespaldoTabla res = new ResRespaldoTabla();
            res.errores = new List<string>();

            try
            {
                // Generar el nombre del directorio automáticamente
                string nombreDirectorio = $"{req.nombreSchema}_{req.nombreTabla}_BACKUP";

                // Crear directorio si no existe
                CrearDirectorio(new ReqCrearDirectorio
                {
                    directorio = req.directorio, // Usar el directorio base proporcionado
                    nombreDirectorio = nombreDirectorio,
                    nombreSchema = req.nombreSchema
                });

                // Comando para realizar el respaldo usando Data Pump
                var startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C expdp {req.nombreSchema}/{req.contrasenaSchema}@XE TABLES={req.nombreSchema}.{req.nombreTabla} DIRECTORY={nombreDirectorio} DUMPFILE={nombreDirectorio}.DMP LOGFILE={nombreDirectorio}.LOG",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(startInfo))
                {
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
                        res.resultado = true;
                    }
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Excepción: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }
        public ResRespaldoCompleto RespaldarBaseDeDatos(ReqRespaldoCompleto req)
        {
            ResRespaldoCompleto res = new ResRespaldoCompleto();

            try
            {
                // Crear el directorio en Oracle
                string crearDirectorioCommand = $"CREATE OR REPLACE DIRECTORY XE_BACKUP AS '{req.directorio}'";

                // Aquí deberías ejecutar la consulta SQL para crear el directorio, asumiendo que tienes un método para esto
                EjecutarConsultaSQL(crearDirectorioCommand);

                // Preparar el comando para el respaldo usando Data Pump
                string expdpCommand = $"expdp SYSTEM/{req.contrasena}@XE FULL=Y DIRECTORY=XE_BACKUP DUMPFILE=XE.DMP LOGFILE=XE.LOG";

                // Ejecutar el comando en el shell
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

                    if (process.ExitCode != 0)
                    {
                        res.errores.Add($"Error al ejecutar el respaldo: {error}");
                        res.resultado = false;
                    }
                    else
                    {
                        res.resultado = true;
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
            using (var connection = new OracleConnection("User Id=SYSTEM;Password=tu_contraseña;Data Source=XE"))
            {
                connection.Open();
                using (var command = new OracleCommand(consulta, connection))
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
                                    DirectorioNombre = reader["DIRECTORY_NAME"].ToString(),
                                    Pseudonimo = reader["DIRECTORY_PATH"].ToString(),
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
