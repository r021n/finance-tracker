import api from '../lib/axios'
import type { ApiResponse, Category } from '../types'

export const categoriesApi = {
    getAll: async(): Promise<ApiResponse<Category[]>> => {
        const response = await api.get<ApiResponse<Category[]>>('/categories');
        return response.data;
    }, 

    getById: async(id: number): Promise<ApiResponse<Category>> => {
        const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
        return response.data;
    },

    create: async(data: {name: string}): Promise<ApiResponse<Category>> => {
        const response = await api.post<ApiResponse<Category>>('/admin/categories', data);
        return response.data;
    },

    update: async(id: number, data: {name: string}): Promise<ApiResponse<Category>> => {
        const response = await api.put<ApiResponse<Category>>(`/admin/categories/${id}`, data);
        return response.data;
    },

    delete: async(id: number): Promise<ApiResponse<null>> => {
        const response = await api.delete<ApiResponse<null>>(`/admin/categories/${id}`);
        return response.data;
    }
}