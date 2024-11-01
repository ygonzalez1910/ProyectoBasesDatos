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
    SEGURIDAD: {
        CREAR_USUARIO: `${API_BASE_URL}/ApiSeguridad/crear-usuario`,
        ELIMINAR_USUARIO: `${API_BASE_URL}/ApiSeguridad/eliminar-usuario`,
        MODIFICAR_USUARIO: `${API_BASE_URL}/ApiSeguridad/modificar-usuario`,
        CREAR_ROL: `${API_BASE_URL}/ApiSeguridad/crear-rol`,
        LISTAR_ROLES: `${API_BASE_URL}/ApiSeguridad/listar-roles`,
        LISTAR_PRIVILEGIOS: `${API_BASE_URL}/ApiSeguridad/listar-privilegios`,
        LISTAR_USUARIOS: `${API_BASE_URL}/ApiSeguridad/listar-usuarios`
    },
    AUDITORIA: {
        OBTENER_AUDITORIA: `${API_BASE_URL}/ApiAuditoria/obtener`,
        ACTIVAR_AUDITORIA: `${API_BASE_URL}/ApiAuditoria/activar`,
        LISTAR_TABLAS: `${API_BASE_URL}/ApiAuditoria/listar-tablas`
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
    },
    TUNING:{
        TABLAS_POR_SCHEMA: `${API_BASE_URL}/ApiTuning/obtenerTablasPorSchema/`,
        ANALIZAR_CONSULTA: `${API_BASE_URL}/ApiTuning/analizarConsulta`
    },
    PERFORMANCE: {
        CREAR_INDICE: `${API_BASE_URL}/ApiPerformance/crear-indice`,
        ELIMINAR_INDICE: `${API_BASE_URL}/ApiPerformance/eliminar-indice`,
        LISTAR_INDICES: `${API_BASE_URL}/ApiPerformance/listar-indices`,
        OBTENER_ESTADISTICAS_INDICE: `${API_BASE_URL}/ApiPerformance/obtener-estadisticas-indice`,
        TODOS_INDICES: `${API_BASE_URL}/ApiPerformance/ver-todos-los-indices`,
    },
    DIRECTORIO: { 
        CREAR_DIRECTORIO: `${API_BASE_URL}/ApiDirectorio/crear`,
        ELIMINAR_DIRECTORIO: (nombre) => `${API_BASE_URL}/ApiDirectorio/${nombre}`,
    },
    
    // ... más endpoints
};