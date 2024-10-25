using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Request;
using Response;
using Models;

namespace Logica
{
    public class Seguridad
    {
        private readonly string _connectionString;

        public Seguridad(string connectionString)
        {
            _connectionString = connectionString;
        }

        public ResCrearUsuario CrearUsuario(ReqCrearUsuarios req)
        {
            ResCrearUsuario res = new ResCrearUsuario();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    // Crear usuario
                    string sqlCrearUsuario = "CREATE USER :usuario IDENTIFIED BY :password";
                    using (OracleCommand cmd = new OracleCommand(sqlCrearUsuario, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("usuario", req.nombreUsuario));
                        cmd.Parameters.Add(new OracleParameter("password", req.password));
                        cmd.ExecuteNonQuery();
                    }

                    // Asignar CONNECT
                    string sqlConnect = "GRANT CONNECT TO :usuario";
                    using (OracleCommand cmd = new OracleCommand(sqlConnect, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("usuario", req.nombreUsuario));
                        cmd.ExecuteNonQuery();
                    }

                    // Asignar roles
                    if (req.roles != null && req.roles.Count > 0)
                    {
                        foreach (string rol in req.roles)
                        {
                            string sqlRol = "GRANT :rol TO :usuario";
                            using (OracleCommand cmd = new OracleCommand(sqlRol, conexion))
                            {
                                cmd.Parameters.Add(new OracleParameter("rol", rol));
                                cmd.Parameters.Add(new OracleParameter("usuario", req.nombreUsuario));
                                cmd.ExecuteNonQuery();
                            }
                        }
                    }

                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al crear usuario: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        public ResEliminarUsuario EliminarUsuario(ReqEliminarUsuario req)
        {
            ResEliminarUsuario res = new ResEliminarUsuario();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "DROP USER :usuario CASCADE";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("usuario", req.nombreUsuario));
                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al eliminar usuario: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        public ResCambiarPassword CambiarPassword(ReqCambiarPassword req)
        {
            ResCambiarPassword res = new ResCambiarPassword();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "ALTER USER :usuario IDENTIFIED BY :password";
                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("usuario", req.nombreUsuario));
                        cmd.Parameters.Add(new OracleParameter("password", req.nuevoPassword));
                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al cambiar contraseña: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        public ResCrearRol CrearRol(ReqCrearRol req)
        {
            ResCrearRol res = new ResCrearRol();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = "";

                    if (req.esRolExterno)
                        sql = "CREATE ROLE :rol IDENTIFIED EXTERNALLY";
                    else if (!string.IsNullOrEmpty(req.package))
                        sql = "CREATE ROLE :rol IDENTIFIED USING :schema.:package";
                    else if (!string.IsNullOrEmpty(req.password))
                        sql = "CREATE ROLE :rol IDENTIFIED BY :password";
                    else
                        sql = "CREATE ROLE :rol";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("rol", req.nombreRol));

                        if (!string.IsNullOrEmpty(req.password))
                            cmd.Parameters.Add(new OracleParameter("password", req.password));

                        if (!string.IsNullOrEmpty(req.package))
                        {
                            cmd.Parameters.Add(new OracleParameter("schema", req.schema));
                            cmd.Parameters.Add(new OracleParameter("package", req.package));
                        }

                        cmd.ExecuteNonQuery();
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al crear rol: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }

        public ResListarPrivilegios ListarPrivilegios(ReqListarPrivilegios req)
        {
            ResListarPrivilegios res = new ResListarPrivilegios();
            res.errores = new List<string>();
            res.privilegios = new List<PrivilegioInfo>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
                        SELECT PRIVILEGE, ADMIN_OPTION 
                        FROM DBA_SYS_PRIVS 
                        WHERE GRANTEE = :usuario
                        UNION ALL
                        SELECT GRANTED_ROLE, ADMIN_OPTION 
                        FROM DBA_ROLE_PRIVS 
                        WHERE GRANTEE = :usuario";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        cmd.Parameters.Add(new OracleParameter("usuario", req.nombreUsuario.ToUpper()));
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.privilegios.Add(new PrivilegioInfo
                                {
                                    nombrePrivilegio = reader["PRIVILEGE"].ToString(),
                                    conAdmin = Convert.ToString(reader["ADMIN_OPTION"]) == "YES"
                                });
                            }
                        }
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al listar privilegios: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }
    }
}