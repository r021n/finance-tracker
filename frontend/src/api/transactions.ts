import api from '../lib/axios'
import type { ApiResponse, Transaction, Meta } from '../types'

export interface TransactionFilter{
    category_id?: number;
    type?: string;
    start_date?: string;
    end_date?: string;
    min_amount?: number;
    max_amount?: number;
    page?: number;
    limit?: number;
}

export interface CreateTransactionData{
    category_id: number;
    type: "income" | "expense";
    amount: number;
    note: string;
    date: string;
}

export interface TransactionListResponse{
    status: string;
    message: string;
    data: Transaction[];
    meta: Meta;
}

export const transactionsApi = {
    getAll: async(filter: TransactionFilter = {}): Promise<TransactionListResponse> => {
        const params = new URLSearchParams();
        if(filter.category_id) params.append("category_id", filter.category_id.toString());
        if(filter.type) params.append("type", filter.type);
        if(filter.start_date) params.append("start_date", filter.start_date);
        if(filter.end_date) params.append("end_date", filter.end_date);
        if(filter.min_amount) params.append("min_amount", filter.min_amount.toString());
        if(filter.max_amount) params.append("max_amount", filter.max_amount.toString());
        if(filter.page) params.append("page", filter.page.toString());
        if(filter.limit) params.append("limit", filter.limit.toString());

        const response = await api.get<TransactionListResponse>(`/transactions?${params.toString()}`)
        return response.data
    },

    getById: async(id: string): Promise<ApiResponse<Transaction>> => {
        const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
        return response.data;
    },

    create: async(data: CreateTransactionData): Promise<ApiResponse<Transaction>> => {
        const response = await api.post<ApiResponse<Transaction>>("/transactions", data);
        return response.data;
    }, 

    update: async(id: string, data: CreateTransactionData): Promise<ApiResponse<Transaction>> => {
        const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
        return response.data;
    },

    delete: async(id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete<ApiResponse<null>>(`/transactions/${id}`);
        return response.data;
    }
}