const API_BASE_URL = 'http://localhost:5172/api'; // Ajusta según tu backend

export const API_ENDPOINTS = {
    // Endpoints de Respaldo
    RESPALDO: {
        GET_ALL: `${API_BASE_URL}/ApiRespaldo`,
        GET_BY_ID: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
        CREATE_SCHEMA: `${API_BASE_URL}/ApiRespaldo/schema`,
        CREATE_TABLE: `${API_BASE_URL}/ApiRespaldo/tabla`,
        CREATE_FULL: `${API_BASE_URL}/ApiRespaldo/completo`,
        RECUPERAR_RESPALDO: `${API_BASE_URL}/ApiRespaldo/recuperar`,
        UPDATE: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
        DELETE: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
    },
    // Agrega más endpoints según necesites
    USUARIOS: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    SEGURIDAD: {
        CREAR_USUARIO: `${API_BASE_URL}/ApiSeguridad/crearUsuario`,
        ELIMINAR_USUARIO: `${API_BASE_URL}/ApiSeguridad/eliminarUsuario`,
        MODIFICAR_USUARIO: `${API_BASE_URL}/ApiSeguridad/cambiarPassword`,
        CREAR_ROL: `${API_BASE_URL}/ApiSeguridad/crearRol`,
        LISTAR_ROLES: `${API_BASE_URL}/ApiSeguridad/listarRoles`
    },
    AUDITORIA: {
        OBTENER_AUDITORIA: '/api/auditoria/obtener',
        ACTIVAR_AUDITORIA: '/api/auditoria/activar'
    },
    SCHEMAS: {
        GET_ALL: `${API_BASE_URL}/ApiSchema/get-schemas`,
        GET_ALL_TABLES: `${API_BASE_URL}/ApiSchema/get-tables`,
        GET_BY_ID: (id) => `${API_BASE_URL}/ApiSchema/${id}`,
        GET_BY_TYPE: `${API_BASE_URL}/ApiSchema/backup`,
        CREATE: `${API_BASE_URL}/ApiSchema`,
        UPDATE: (id) => `${API_BASE_URL}/ApiSchema/${id}`,
        DELETE: (id) => `${API_BASE_URL}/ApiSchema/${id}`,
    },
    TABLESPACE: {
        GET_ALL: `${API_BASE_URL}/ApiTablespace/get-tablespaces`,
        GET_BY_ID: (id) => `${API_BASE_URL}/ApiTableSpace/${id}`,
        CREATE: `${API_BASE_URL}/ApiTableSpace/create-tablespace`,
        UPDATE: (id) => `${API_BASE_URL}/ApiTablespace/${id}`,
        MODIFY_SIZE: `${API_BASE_URL}/ApiTableSpace/modify-tablespace-size`,
        DELETE: (nombreTableSpace) => `${API_BASE_URL}/ApiTableSpace/${nombreTableSpace}`,
    }
    // ... más endpoints
};