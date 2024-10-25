const API_BASE_URL = 'http://localhost:3001/api'; // Ajusta según tu backend

export const API_ENDPOINTS = {
    // Endpoints de Respaldo
    RESPALDO: {
        GET_ALL: `${API_BASE_URL}/respaldos`,
        GET_BY_ID: (id) => `${API_BASE_URL}/respaldos/${id}`,
        CREATE: `${API_BASE_URL}/respaldos`,
        UPDATE: (id) => `${API_BASE_URL}/respaldos/${id}`,
        DELETE: (id) => `${API_BASE_URL}/respaldos/${id}`,
    },
    // Agrega más endpoints según necesites
    USUARIOS: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    // ... más endpoints
};