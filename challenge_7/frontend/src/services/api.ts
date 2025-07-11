import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface VerifyOtpData {
    email: string;
    code: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    code: string;
    newPassword: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
    email?: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    views?: number;
    published_at?: string;
    category_id?: number;
    author_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ArticleListResponse {
    success: boolean;
    data: Article[];
    total: number;
    pagination: {
        page: number;
        limit: number;
    };
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
}

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }

            return data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('Có lỗi xảy ra khi kết nối với server');
        }
    }

    // Đăng ký
    async register(data: RegisterData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Xác thực OTP
    async verifyOtp(data: VerifyOtpData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Đăng nhập
    async login(data: LoginData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Quên mật khẩu
    async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Đặt lại mật khẩu
    async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Gửi lại OTP xác thực tài khoản
    async resendRegisterOtp(data: { email: string }): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiService = new ApiService();

export async function fetchArticles(page = 1, limit = 12): Promise<ArticleListResponse> {
    const res = await axios.get<ArticleListResponse>(
        `http://localhost:5000/api/articles?page=${page}&limit=${limit}`
    );
    return res.data;
}

export async function fetchArticlesByCategory(category: string, page = 1, limit = 12): Promise<ArticleListResponse> {
    const res = await axios.get<ArticleListResponse>(
        `http://localhost:5000/api/articles/category/${category}?page=${page}&limit=${limit}`
    );
    return res.data;
}

export async function fetchCategories() {
    const res = await axios.get('http://localhost:5000/api/categories');
    return res.data.data;
}

export async function fetchArticleStats() {
    const res = await axios.get('http://localhost:5000/api/articles/stats');
    return res.data.data;
}

export async function fetchUsers() {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/users', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function fetchArticleById(id: string) {
    const res = await axios.get(`http://localhost:5000/api/articles/${id}`);
    return res.data.data;
}

export async function createArticle(article: Partial<Article>) {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/articles', article, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function updateArticle(id: string, article: Partial<Article>) {
    const token = localStorage.getItem('token');
    const res = await axios.put(`http://localhost:5000/api/articles/${id}`, article, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function deleteArticle(id: string) {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`http://localhost:5000/api/articles/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function searchArticles(keyword: string, page = 1, limit = 12) {
    const res = await axios.get(`http://localhost:5000/api/articles/search?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`);
    return res.data;
}

export async function createUser(user: Partial<User>) {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/users', user, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function updateUser(id: string, user: Partial<User>) {
    const token = localStorage.getItem('token');
    const res = await axios.put(`http://localhost:5000/api/users/${id}`, user, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function deleteUser(id: string) {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
} 