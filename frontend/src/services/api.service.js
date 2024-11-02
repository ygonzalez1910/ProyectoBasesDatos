import axios from "axios";
import { API_ENDPOINTS } from "./config";

// Configuración global de axios
const axiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL, // Asegúrate de definir esta URL en config.js
  timeout: 2400000, // 40 minutos
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

export const SeguridadService = {
  crearUsuario: async (data) => {
    return await axiosInstance.post(
      API_ENDPOINTS.SEGURIDAD.CREAR_USUARIO,
      data
    );
  },
  eliminarUsuario: async (data) => {
    return await axiosInstance.delete(
      API_ENDPOINTS.SEGURIDAD.ELIMINAR_USUARIO,
      { data }
    );
  },
  cambiarContraseña: async (data) => {
    return await axiosInstance.post(
      API_ENDPOINTS.SEGURIDAD.MODIFICAR_USUARIO,
      data
    );
  },
  crearRol: async (data) => {
    return await axiosInstance.post(API_ENDPOINTS.SEGURIDAD.CREAR_ROL, data);
  },
  listarRoles: () => axiosInstance.get(API_ENDPOINTS.SEGURIDAD.LISTAR_ROLES),
  listarPrivilegios: () =>
    axiosInstance.get(API_ENDPOINTS.SEGURIDAD.LISTAR_PRIVILEGIOS),
  listarUsuarios: () => 
    axiosInstance.get(API_ENDPOINTS.SEGURIDAD.LISTAR_USUARIOS)
};

export const AuditoriaService = {
  obtenerAuditoria: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUDITORIA.OBTENER_AUDITORIA,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener auditoría:", error);
      throw error;
    }
  },

  activarAuditoria: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUDITORIA.ACTIVAR_AUDITORIA,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al activar auditoría:", error);
      throw error;
    }
  },
  obtenerListaTablas: async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.AUDITORIA.LISTAR_TABLAS
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener la lista de tablas:", error);
      throw error;
    }
  },
};

export const tunningService = {
  analizarConsulta: async (data) => {
    console.log(data);
    return await axiosInstance.post(
      API_ENDPOINTS.TUNING.ANALIZAR_CONSULTA,
      data
    );
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
      const response = await axiosInstance.get(
        `/api/tunning/obtenerListaTablas/${schema}`
      );
      return response.data.Tables;
    } catch (error) {
      console.error("Error al obtener lista de tablas:", error);
      throw error;
    }
  },
  obtenerTablasPorSchema: (schema) =>
    axiosInstance.get(
      `http://localhost:5172/api/ApiTuning/obtenerTablasPorSchema/${schema}`
    ),
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
export const PerformanceService = {
  crearIndice: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PERFORMANCE.CREAR_INDICE,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear tablespace:", error);
      throw error;
    }
  },
  eliminarIndice: async (data) => {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.PERFORMANCE.ELIMINAR_INDICE,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear tablespace:", error);
      throw error;
    }
  },
  listarIndices: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PERFORMANCE.LISTAR_INDICES,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al listar indices:", error);
      throw error;
    }
  },
  obtenerEstadisticasIndice: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.PERFORMANCE.OBTENER_ESTADISTICAS_INDICE,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadisticas del indice:", error);
      throw error;
    }
  },
  verTodosIndices: async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.PERFORMANCE.TODOS_INDICES
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener indices:", error);
      throw error;
    }
  },
};

export const DirectorioService = {
  crearDirectorio: async (data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.DIRECTORIO.CREAR_DIRECTORIO,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear tablespace:", error);
      throw error;
    }
  },
  eliminarDirectorio: async (nombreDirectorio) => {
    try {
      const response = await axiosInstance.delete(
        API_ENDPOINTS.DIRECTORIO.ELIMINAR_DIRECTORIO(nombreDirectorio)
      );
      return response.data;
    } catch (error) {
      console.error("Error al eliminar directorio:", error);
      throw error;
    }
  },
};
