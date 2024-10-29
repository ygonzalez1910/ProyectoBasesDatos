import axios from "axios";
import { API_ENDPOINTS } from "./config";

// Configuración global de axios
const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL, // Asegúrate de definir esta URL en config.js
  timeout: 1200000, // 20 minutos
  headers: {
    "Content-Type": "application/json",
  },
});

export const tunningService = {
  analizarConsulta: async (sqlQuery, schema) => {
    try {
      const response = await axiosInstance.post("/api/tunning/analizarConsulta", {
        sqlQuery,
        schema
      });
      return response;
    } catch (error) {
      console.error("Error al analizar consulta:", error);
      throw error;
    }
  },

  obtenerEstadisticasTabla: async (schema, tabla) => {
    try {
      const response = await axiosInstance.get(
        `/api/tunning/obtenerEstadisticasTabla/${schema}/${tabla}`
      );
      return response;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  },
  obtenerListaTablas: async (schema) => {
    try {
      const response = await axiosInstance.get(`/api/tunning/obtenerListaTablas/${schema}`);
      return response.data.Tables;
    } catch (error) {
      console.error("Error al obtener lista de tablas:", error);
      throw error;
    }
  },
  obtenerTablasPorSchema: async (schema) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.TUNING.TABLAS_POR_SCHEMA}/${schema}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener tablas por schema:", error);
      throw error;
    }
  }
};

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
  getRespaldoByType: async (tipo) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.SCHEMAS.GET_BY_TYPE}/${tipo}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener respaldos:", error);
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

export const TableSpaceService = {
  getAllTableSpaces: async (params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.TABLESPACE.GET_ALL,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener tablespaces:", error);
      throw error;
    }
  },
  createTableSpace: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.TABLESPACE.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear tablespace:", error);
      throw error;
    }
  },
  updateSizeTableSpace: async (data) => {
    try {
      const response = await axiosInstance.put(
        API_ENDPOINTS.TABLESPACE.MODIFY_SIZE, // Usar el endpoint específico
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el tamaño del tablespace:`, error);
      throw error;
    }
  },
  deleteTableSpace: async (nombreTableSpace) => {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.TABLESPACE.DELETE(nombreTableSpace)
      );
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar tablespace ${nombreTableSpace}:`, error);
      throw error;
    }
  },

};
