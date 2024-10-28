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
                Log.Information($"Creando tablespace: {request.TableSpaceName}");

                using (OracleConnection connection = new OracleConnection(_connectionString))
                {
                    connection.Open();
                    Log.Information($"Conexión abierta a la base de datos.");

                    // Crear el comando SQL para crear el tablespace
                    string sql = $@"
                CREATE TABLESPACE {request.TableSpaceName}
                DATAFILE '{request.DataFileName}/{request.TableSpaceName}.dbf'
                SIZE {request.InitialSizeMB}M
                AUTOEXTEND ON NEXT {request.AutoExtendSizeMB}M
                MAXSIZE {request.MaxSizeMB}M";

                    using (OracleCommand cmd = new OracleCommand(sql, connection))
                    {
                        cmd.ExecuteNonQuery();
                        response.Mensaje = $"Tablespace {request.TableSpaceName} creado correctamente.";
                        response.Exito = true;
                        Log.Information(response.Mensaje);
                    }
                }
            }
            catch (Exception ex)
            {
                response.Mensaje = $"Error al crear el tablespace: {ex.Message}";
                response.Exito = false;
                Log.Error(ex, response.Mensaje);
            }

            return response;
        }
    }
}
