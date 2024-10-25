using System;
using System.Collections.Generic;
using System.Diagnostics; 
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Request;
using Response;
using Models;
using Response;
using Request;

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

        public ResRespaldoSchema RespaldarSchema(ReqRespaldoSchema req)
        {
            ResRespaldoSchema res = new ResRespaldoSchema();
            res.errores = new List<string>();

            try
            {
                // Preparar el comando para el respaldo usando Data Pump
                string expdpCommand = $"expdp {req.nombreSchema}/{req.contrasenaSchema}@XE " +
                                      $"TABLES={req.nombreSchema} " +
                                      $"DIRECTORY={req.nombreDirectorio} " +
                                      $"DUMPFILE={req.nombreDirectorio}.DMP " +
                                      $"LOGFILE={req.nombreDirectorio}.LOG";

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
    }
}
