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
            _connectionString = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=XEPDB1)));User Id=SYSTEM;Password=rootroot;";
        }

        public ResCrearUsuario CrearUsuario(ReqCrearUsuario req)
        {
            ResCrearUsuario res = new ResCrearUsuario();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    // Añadir prefijo si no existe
                    string usuario = req.nombreUsuario.StartsWith("C##") ? req.nombreUsuario : "C##" + req.nombreUsuario;

                    conexion.Open();

                    // Crear el usuario
                    string createUserSql = $"CREATE USER {req.nombreUsuario} IDENTIFIED BY {req.password}";
                    using (OracleCommand cmd = new OracleCommand(createUserSql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    // Asignar privilegios básicos
                    string grantPrivilegesSql = $"GRANT CREATE SESSION TO {req.nombreUsuario}";
                    using (OracleCommand cmd = new OracleCommand(grantPrivilegesSql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    // Asignar roles si se especificaron
                    if (req.roles != null && req.roles.Count > 0)
                    {
                        foreach (string rol in req.roles)
                        {
                            string grantRoleSql = $"GRANT {rol} TO {req.nombreUsuario}";
                            using (OracleCommand cmd = new OracleCommand(grantRoleSql, conexion))
                            {
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

                    string dropUserSql = req.includeCascade ?
                        $"DROP USER {req.nombreUsuario} CASCADE" :
                        $"DROP USER {req.nombreUsuario}";

                    using (OracleCommand cmd = new OracleCommand(dropUserSql, conexion))
                    {
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

        public ResModificarUsuario ModificarUsuario(ReqModificarUsuario req)
        {
            ResModificarUsuario res = new ResModificarUsuario();
            res.errores = new List<string>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();

                    // Modificar contraseña si se especificó
                    if (!string.IsNullOrEmpty(req.nuevoPassword))
                    {
                        string alterUserSql = $"ALTER USER {req.nombreUsuario} IDENTIFIED BY {req.nuevoPassword}";
                        using (OracleCommand cmd = new OracleCommand(alterUserSql, conexion))
                        {
                            cmd.ExecuteNonQuery();
                        }
                    }

                    // Bloquear o desbloquear cuenta
                    string lockUnlockSql = req.bloquear ?
                        $"ALTER USER {req.nombreUsuario} ACCOUNT LOCK" :
                        $"ALTER USER {req.nombreUsuario} ACCOUNT UNLOCK";
                    using (OracleCommand cmd = new OracleCommand(lockUnlockSql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al modificar usuario: {ex.Message}");
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

                    // Crear el rol
                    string createRoleSql = $"CREATE ROLE {req.nombreRol}";
                    using (OracleCommand cmd = new OracleCommand(createRoleSql, conexion))
                    {
                        cmd.ExecuteNonQuery();
                    }

                    // Asignar privilegios si se especificaron
                    if (req.privilegios != null && req.privilegios.Count > 0)
                    {
                        foreach (string privilegio in req.privilegios)
                        {
                            string grantPrivilegeSql = $"GRANT {privilegio} TO {req.nombreRol}";
                            using (OracleCommand cmd = new OracleCommand(grantPrivilegeSql, conexion))
                            {
                                cmd.ExecuteNonQuery();
                            }
                        }
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
                    // Cambiar la consulta para obtener todos los privilegios del sistema
                    string sql = @"
                SELECT PRIVILEGE, NAME 
                FROM SYSTEM_PRIVILEGE_MAP";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.privilegios.Add(new PrivilegioInfo
                                {
                                    nombrePrivilegio = reader["NAME"].ToString(),
                                    conAdmin = false // No hay información de ADMIN_OPTION en SYSTEM_PRIVILEGE_MAP
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

        public ResListarRoles ListarRoles()
        {
            ResListarRoles res = new ResListarRoles();
            res.errores = new List<string>();
            res.roles = new List<RolInfo>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
        SELECT 
            ROLE,
            AUTHENTICATION_TYPE,
            COMMON,
            ORACLE_MAINTAINED
        FROM DBA_ROLES
        ORDER BY ROLE";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.roles.Add(new RolInfo
                                {
                                    nombreRol = reader["ROLE"].ToString(),
                                    autenticacion = reader["AUTHENTICATION_TYPE"].ToString(),
                                    comun = reader["COMMON"].ToString(),
                                    oracle = reader["ORACLE_MAINTAINED"].ToString(),
                                });
                            }
                        }
                    }

                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al listar roles: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }
        public ResListarUsuarios ListarUsuarios(ReqListarUsuarios req)
        {
            ResListarUsuarios res = new ResListarUsuarios();
            res.errores = new List<string>();
            res.usuarios = new List<UsuarioInfo>();

            try
            {
                using (OracleConnection conexion = new OracleConnection(_connectionString))
                {
                    conexion.Open();
                    string sql = @"
                SELECT 
                    USERNAME,
                    ACCOUNT_STATUS,
                    TO_CHAR(CREATED, 'YYYY-MM-DD HH24:MI:SS') as CREATED_DATE,
                    DEFAULT_TABLESPACE,
                    AUTHENTICATION_TYPE,
                    COMMON
                FROM DBA_USERS
                ORDER BY USERNAME";

                    using (OracleCommand cmd = new OracleCommand(sql, conexion))
                    {
                        using (OracleDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                res.usuarios.Add(new UsuarioInfo
                                {
                                    nombreUsuario = reader["USERNAME"].ToString(),
                                    estado = reader["ACCOUNT_STATUS"].ToString(),
                                    fechaCreacion = reader["CREATED_DATE"].ToString(),
                                    perfilPorDefecto = reader["DEFAULT_TABLESPACE"].ToString(),
                                    autenticacion = reader["AUTHENTICATION_TYPE"].ToString(),
                                    comun = reader["COMMON"].ToString()
                                });
                            }
                        }
                    }
                    res.resultado = true;
                }
            }
            catch (Exception ex)
            {
                res.errores.Add($"Error al listar usuarios: {ex.Message}");
                res.resultado = false;
            }

            return res;
        }
    }
}

