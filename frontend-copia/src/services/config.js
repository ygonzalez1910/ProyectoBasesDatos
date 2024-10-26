const API_BASE_URL = 'http://localhost:5172/api'; // Ajusta según tu backend

export const API_ENDPOINTS = {
    // Endpoints de Respaldo
    RESPALDO: {
        GET_ALL: `${API_BASE_URL}/ApiRespaldo`,
        GET_BY_ID: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
        CREATE_SCHEMA: `${API_BASE_URL}/ApiRespaldo/schema`,
        CREATE_TABLE: `${API_BASE_URL}/ApiRespaldo/tabla`,
        CREATE_FULL: `${API_BASE_URL}/ApiRespaldo/completo`,
        UPDATE: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
        DELETE: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
    },
    // Agrega más endpoints según necesites
    USUARIOS: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    SCHEMAS: {
        GET_ALL: `${API_BASE_URL}/ApiSchema/get-schemas`,
        GET_ALL_TABLES: `${API_BASE_URL}/ApiSchema/get-tables`,
        GET_BY_ID: (id) => `${API_BASE_URL}/ApiSchema/${id}`,
        CREATE: `${API_BASE_URL}/ApiSchema`,
        UPDATE: (id) => `${API_BASE_URL}/ApiSchema/${id}`,
        DELETE: (id) => `${API_BASE_URL}/ApiSchema/${id}`,
    },
    // ... más endpoints
};