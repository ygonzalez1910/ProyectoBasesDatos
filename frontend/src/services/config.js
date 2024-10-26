const API_BASE_URL = 'http://localhost:5172/api'; // Ajusta según tu backend

export const API_ENDPOINTS = {
    // Endpoints de Respaldo
    RESPALDO: {
        GET_ALL: `${API_BASE_URL}/ApiRespaldo`,
        GET_BY_ID: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
        CREATE: `${API_BASE_URL}/ApiRespaldo`,
        UPDATE: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
        DELETE: (id) => `${API_BASE_URL}/ApiRespaldo/${id}`,
    },
    // Agrega más endpoints según necesites
    USUARIOS: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    // ... más endpoints
};