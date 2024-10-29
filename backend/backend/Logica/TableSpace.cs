using System;
using System.Collections.Generic;
using Oracle.ManagedDataAccess.Client;
using Request;
using Response;
using Models;
using Serilog;

namespace Logica
{
    public class TableSpace
    {
        private readonly string _connectionString;

        public TableSpace(string connectionString)
        {
            _connectionString = connectionString;
        }

        public ResGetTableSpaces GetTableSpaces()
        {
            var response = new ResGetTableSpaces();

            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    connection.Open();
                    string sql = @"
                        SELECT 
                            TABLESPACE_NAME,
                            FILE_NAME,
                            BYTES / 1024 / 1024 AS SIZE_MB,
                            AUTOEXTENSIBLE,
                            MAXBYTES / 1024 / 1024 AS MAX_SIZE_MB
                        FROM 
                            DBA_DATA_FILES";

                    using (OracleCommand cmd = new OracleCommand(sql, connection))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                response.TableSpaces.Add(new TableSpaceModel
                                {
                                    TableSpaceName = reader.GetString(0),
                                    FileName = reader.GetString(1),
                                    SizeMB = reader.GetDecimal(2),
                                    AutoExtensible = reader.GetString(3),
                                    MaxSizeMB = reader.GetDecimal(4)
                                });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Errores.Add($"Error al recuperar tablespaces: {ex.Message}");
            }

            return response;
        }
        public ResDeleteTableSpace DeleteTableSpace(ReqDeleteTableSpace request)
        {
            var response = new ResDeleteTableSpace();

            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    connection.Open();

                    string sql = $"DROP TABLESPACE {request.TableSpaceName} INCLUDING CONTENTS AND DATAFILES";

                    using (OracleCommand cmd = new OracleCommand(sql, connection))
                    {
                        cmd.ExecuteNonQuery();
                        response.Mensaje = $"Tablespace {request.TableSpaceName} eliminado correctamente.";
                        response.Exito = true;
                    }
                }
            }
            catch (Exception ex)
            {
                response.Mensaje = $"Error al eliminar tablespace: {ex.Message}";
                response.Exito = false;
            }

            return response;
        }

        // Método para modificar el tamaño de un tablespace específico
        public ResModifyTableSpaceSize ModifyTableSpaceSize(ReqModifyTableSpaceSize request)
        {
            var response = new ResModifyTableSpaceSize();

            try
            {
                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    connection.Open();

                    // Consultar la ruta del archivo del tablespace
                    string getFileSql = "SELECT FILE_NAME FROM DBA_DATA_FILES WHERE TABLESPACE_NAME = :tablespaceName";
                    string fileName = "";

                    using (OracleCommand getFileCmd = new OracleCommand(getFileSql, connection))
                    {
                        getFileCmd.Parameters.Add(":tablespaceName", request.TableSpaceName);
                        using (OracleDataReader reader = getFileCmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                fileName = reader.GetString(0);
                            }
                            else
                            {
                                response.Mensaje = $"Tablespace {request.TableSpaceName} no encontrado.";
                                response.Exito = false;
                                return response;
                            }
                        }
                    }

                    // Modificar el tamaño del archivo de datos
                    string alterSql = $"ALTER DATABASE DATAFILE '{fileName}' RESIZE {request.NewSizeMB}M";
                    using (OracleCommand alterCmd = new OracleCommand(alterSql, connection))
                    {
                        alterCmd.ExecuteNonQuery();
                        response.Exito = true;
                        response.Mensaje = $"El tamaño del tablespace {request.TableSpaceName} ha sido modificado a {request.NewSizeMB} MB.";
                    }
                }
            }
            catch (Exception ex)
            {
                response.Mensaje = $"Error al modificar el tamaño del tablespace: {ex.Message}";
                response.Exito = false;
            }

            return response;
        }

        public ResCreateTableSpace CreateTableSpace(ReqCreateTableSpace request)
        {
            var response = new ResCreateTableSpace();

            try
            {
                // Log para verificar los datos de entrada
                Log.Information($"Iniciando proceso de creación de tablespace con los siguientes datos: " +
                                $"Nombre: {request.TableSpaceName}, " +
                                $"Ruta del archivo de datos: {request.DataFileName}, " +
                                $"Tamaño inicial: {request.InitialSizeMB} MB, " +
                                $"Autoextend: {request.AutoExtendSizeMB} MB, " +
                                $"Tamaño máximo: {request.MaxSizeMB} MB");

                // Validaciones iniciales de los datos
                if (string.IsNullOrEmpty(request.TableSpaceName) ||
                    string.IsNullOrEmpty(request.DataFileName) ||
                    request.InitialSizeMB <= 0 ||
                    request.AutoExtendSizeMB <= 0 ||
                    request.MaxSizeMB <= 0 ||
                    string.IsNullOrEmpty(request.UserPassword))
                {
                    response.Mensaje = "Error: uno o más datos de entrada son inválidos o están ausentes.";
                    response.Exito = false;
                    Log.Warning(response.Mensaje);
                    return response;
                }

                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    connection.Open();
                    Log.Information("Conexión abierta a la base de datos.");

                    // Iniciar la transacción
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Crear el comando SQL para crear el tablespace
                            string createTablespaceSql = $@"
                        CREATE TABLESPACE ""{request.TableSpaceName}""
                        DATAFILE '{request.DataFileName}/{request.TableSpaceName}.dbf'
                        SIZE {request.InitialSizeMB}M
                        AUTOEXTEND ON NEXT {request.AutoExtendSizeMB}M
                        MAXSIZE {request.MaxSizeMB}M";

                            Log.Information($"Ejecutando SQL: {createTablespaceSql}");

                            using (OracleCommand cmd = new OracleCommand(createTablespaceSql, connection))
                            {
                                cmd.ExecuteNonQuery();
                                Log.Information($"Tablespace {request.TableSpaceName} creado correctamente en la base de datos.");
                            }

                            // Habilitar el script de creación de usuario
                            string enableScriptSql = "ALTER SESSION SET \"_ORACLE_SCRIPT\" = true";
                            using (OracleCommand cmd = new OracleCommand(enableScriptSql, connection))
                            {
                                cmd.ExecuteNonQuery();
                                Log.Information("Script de usuario habilitado para la sesión.");
                            }

                            // Crear el usuario
                            string createUserSql = $@"
                        CREATE USER ""{request.TableSpaceName}"" IDENTIFIED BY ""{request.UserPassword}""
                        DEFAULT TABLESPACE ""{request.TableSpaceName}""";

                            using (OracleCommand cmd = new OracleCommand(createUserSql, connection))
                            {
                                cmd.ExecuteNonQuery();
                                Log.Information($"Usuario {request.TableSpaceName} creado con éxito.");
                            }

                            // Asignar permisos al usuario
                            string[] grantPrivileges = new[]
                            {
                        $@"GRANT RESOURCE TO ""{request.TableSpaceName}""",
                        $@"GRANT CONNECT TO ""{request.TableSpaceName}""",
                        $@"GRANT ALL PRIVILEGES TO ""{request.TableSpaceName}"""
                    };

                            foreach (string grantSql in grantPrivileges)
                            {
                                using (OracleCommand cmd = new OracleCommand(grantSql, connection))
                                {
                                    cmd.ExecuteNonQuery();
                                }
                            }
                            Log.Information($"Permisos asignados al usuario {request.TableSpaceName}.");

                            // Si todo fue exitoso, confirmar la transacción
                            transaction.Commit();
                            response.Mensaje = $"Tablespace {request.TableSpaceName} y usuario creados correctamente.";
                            response.Exito = true;
                            Log.Information($"Proceso finalizado con éxito: {response.Mensaje}");
                        }
                        catch (Exception ex)
                        {
                            // Si ocurre un error, revertir la transacción
                            transaction.Rollback();
                            response.Mensaje = $"Error al crear el tablespace y usuario: {ex.Message}";
                            response.Exito = false;
                            Log.Error(ex, response.Mensaje);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                response.Mensaje = $"Error al establecer conexión con la base de datos: {ex.Message}";
                response.Exito = false;
                Log.Error(ex, response.Mensaje);
            }
            finally
            {
                Log.Information("Proceso de creación de tablespace finalizado.");
            }

            return response;
        }
    }
}
