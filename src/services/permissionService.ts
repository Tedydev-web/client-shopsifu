import { privateAxios } from '@/lib/api';
import { API_ENDPOINTS } from '@/constants/api';

export const permissionService = {
    getAllPermissions: async () => {
        try {
            const response = await privateAxios.get(API_ENDPOINTS.PERMISSION.GETALL);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getRolePermissions: async (roleId: string) => {
        try {
            const url = API_ENDPOINTS.PERMISSION.GET_ROLE_PERMISSIONS.replace(':id', roleId);
            const response = await privateAxios.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updateRolePermissions: async (roleId: string, permissions: string[]) => {
        try {
            const url = API_ENDPOINTS.PERMISSION.UPDATE_ROLE_PERMISSIONS.replace(':id', roleId);
            const response = await privateAxios.put(url, { permissions });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};