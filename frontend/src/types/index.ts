export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  type: "income" | "expense";
  amount: number;
  note: string;
  date: string;
  created_at: string;
  updated_at: string;
  category: Category;
}

export interface Meta {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
  meta?: Meta;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
