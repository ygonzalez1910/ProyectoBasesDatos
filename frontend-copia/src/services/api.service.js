import axios from "axios";
import { API_ENDPOINTS } from "./config";

// Configuración global de axios
const axiosInstance = axios.create({
  timeout: 1200000, // Establecer el timeout a 20 minutos (1200000 ms)
  headers: {
    "Content-Type": "application/json",
  },
});
// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejar error de autenticación
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export const SchemasService = {
  getAllSchemas: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.SCHEMAS.GET_ALL, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener esquemas:", error);
      throw error;
    }
  },
  getAllTables: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SCHEMAS.GET_ALL_TABLES,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener esquemas:", error);
      throw error;
    }
  },
  getRespaldoByType: async (type) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.SCHEMAS.GET_BY_TYPE(type)
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener respaldo ${type}:`, error);
      throw error;
    }
  },
};

// Servicio para Respaldos
export const RespaldoService = {
  // Obtener todos los respaldos
  getAllRespaldos: async (params = {}) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.RESPALDO.GET_ALL, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener respaldos:", error);
      throw error;
    }
  },

  // Crear nuevo respaldo
  createRespaldoSchema: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.RESPALDO.CREATE_SCHEMA,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear respaldo:", error);
      throw error;
    }
  },

  // Crear nuevo respaldo por tabla
  createRespaldoTable: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.RESPALDO.CREATE_TABLE,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear respaldo:", error);
      throw error;
    }
  },
  // Crear nuevo respaldo por tabla
  createRespaldoFULL: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.RESPALDO.CREATE_FULL,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear respaldo:", error);
      throw error;
    }
  },

  recuperarRespaldo: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.RESPALDO.RECUPERAR_RESPALDO,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear respaldo:", error);
      throw error;
    }
  },

  // Actualizar respaldo
  updateRespaldo: async (id, data) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.RESPALDO.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar respaldo ${id}:`, error);
      throw error;
    }
  },

  // Eliminar respaldo
  deleteRespaldo: async (id) => {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.RESPALDO.DELETE(id)
      );
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar respaldo ${id}:`, error);
      throw error;
    }
  },
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
