
import axios from 'axios';
import { API_ENDPOINTS } from './config';

// Configuración global de axios
const axiosInstance = axios.create({
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Manejar error de autenticación
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Servicio para Respaldos
export const RespaldoService = {
    // Obtener todos los respaldos
    getAllRespaldos: async (params = {}) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.RESPALDO.GET_ALL, { params });
            return response.data;
        } catch (error) {
            console.error('Error al obtener respaldos:', error);
            throw error;
        }
    },

    // Obtener un respaldo por ID
    getRespaldoById: async (id) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.RESPALDO.GET_BY_ID(id));
            return response.data;
        } catch (error) {
            console.error(`Error al obtener respaldo ${id}:`, error);
            throw error;
        }
    },

    // Crear nuevo respaldo
    createRespaldo: async (data) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.RESPALDO.CREATE, data);
            return response.data;
        } catch (error) {
            console.error('Error al crear respaldo:', error);
            throw error;
        }
    },

    // Actualizar respaldo
    updateRespaldo: async (id, data) => {
        try {
            const response = await axiosInstance.put(API_ENDPOINTS.RESPALDO.UPDATE(id), data);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar respaldo ${id}:`, error);
            throw error;
        }
    },

    // Eliminar respaldo
    deleteRespaldo: async (id) => {
        try {
            const response = await axiosInstance.delete(API_ENDPOINTS.RESPALDO.DELETE(id));
            return response.data;
        } catch (error) {
            console.error(`Error al eliminar respaldo ${id}:`, error);
            throw error;
        }
    }
};


// Ejemplo de uso en un componente
/*
// src/pages/respaldo/TablaRespaldo.jsx
import React, { useState, useEffect } from 'react';
import { RespaldoService } from '../../services/api.service';

const TablaRespaldo = () => {
    const [respaldos, setRespaldos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRespaldos = async () => {
            try {
                const data = await RespaldoService.getAllRespaldos();
                setRespaldos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRespaldos();
    }, []);

    // Resto del componente...
};
*/