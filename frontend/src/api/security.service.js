// services/api/security.service.js

import axios from 'axios';
import { handleResponse, handleError } from './api.utils';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const SecurityService = {
    // Gestión de Roles
    getRoles: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/roles`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    createRole: async (roleData) => {
        try {
            const response = await axios.post(`${BASE_URL}/roles`, roleData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    updateRole: async (roleName, roleData) => {
        try {
            const response = await axios.put(`${BASE_URL}/roles/${roleName}`, roleData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    deleteRole: async (roleName) => {
        try {
            const response = await axios.delete(`${BASE_URL}/roles/${roleName}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // Gestión de Privilegios
    getRolePrivileges: async (roleName) => {
        try {
            const response = await axios.get(`${BASE_URL}/roles/${roleName}/privileges`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    assignPrivilegeToRole: async (roleName, privilegeData) => {
        try {
            const response = await axios.post(`${BASE_URL}/roles/${roleName}/privileges`, privilegeData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    revokePrivilegeFromRole: async (roleName, privilegeName) => {
        try {
            const response = await axios.delete(`${BASE_URL}/roles/${roleName}/privileges/${privilegeName}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // Gestión de Usuarios con Roles
    assignRoleToUser: async (username, roleData) => {
        try {
            const response = await axios.post(`${BASE_URL}/users/${username}/roles`, roleData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    revokeRoleFromUser: async (username, roleName) => {
        try {
            const response = await axios.delete(`${BASE_URL}/users/${username}/roles/${roleName}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    // Roles SYSDBA
    getSysdbaPolicies: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/sysdba/policies`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    assignSysdbaRole: async (username) => {
        try {
            const response = await axios.post(`${BASE_URL}/sysdba/assign`, { username });
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    },

    revokeSysdbaRole: async (username) => {
        try {
            const response = await axios.delete(`${BASE_URL}/sysdba/revoke/${username}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error);
        }
    }
};

