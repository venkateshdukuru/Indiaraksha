// API Service Layer - All backend communication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Helper function to handle API requests
async function apiRequest(endpoint: string, options: RequestInit = {}, skipAuth = false) {
    const token = localStorage.getItem('accessToken');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(!skipAuth && token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Auth APIs
export const authAPI = {
    register: async (data: {
        email: string;
        mobile: string;
        name: string;
        password: string;
        city?: string;
        state?: string;
    }) => {
        const result = await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        if (result.accessToken) {
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    },

    login: async (email: string, password: string) => {
        const result = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (result.accessToken) {
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('user', JSON.stringify(result.user));
        }
        return result;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },
};

// Scam Reports APIs
export const scamReportsAPI = {
    create: async (data: {
        scamType: string;
        phoneNumber?: string;
        url?: string;
        appName?: string;
        description: string;
        amountLost?: number;
        city?: string;
        state?: string;
        isAnonymous?: boolean;
        incidentDate?: string;
    }) => {
        // Skip authentication for anonymous reports
        const skipAuth = data.isAnonymous === true;
        return apiRequest('/scam-reports', {
            method: 'POST',
            body: JSON.stringify(data),
        }, skipAuth);
    },

    getAll: async (params?: {
        page?: number;
        limit?: number;
        scamType?: string;
        status?: string;
        city?: string;
        state?: string;
    }) => {
        const queryString = new URLSearchParams(params as any).toString();
        return apiRequest(`/scam-reports?${queryString}`);
    },

    getMyReports: async () => {
        return apiRequest('/scam-reports/my-reports');
    },

    getStatistics: async () => {
        return apiRequest('/scam-reports/statistics');
    },

    getTrending: async (limit: number = 10) => {
        return apiRequest(`/scam-reports/trending?limit=${limit}`);
    },

    getById: async (id: string) => {
        return apiRequest(`/scam-reports/${id}`);
    },
};

// Scam Lookup APIs
export const scamLookupAPI = {
    check: async (value: string) => {
        const encodedValue = encodeURIComponent(value);
        return apiRequest(`/scam-lookup/check/${encodedValue}`);
    },

    search: async (query: string) => {
        return apiRequest(`/scam-lookup/search?q=${encodeURIComponent(query)}`);
    },

    getTopScammers: async (limit: number = 10) => {
        return apiRequest(`/scam-lookup/top-scammers?limit=${limit}`);
    },

    getHighRisk: async (limit: number = 10) => {
        return apiRequest(`/scam-lookup/high-risk?limit=${limit}`);
    },

    block: async (value: string) => {
        const encodedValue = encodeURIComponent(value);
        return apiRequest(`/scam-lookup/block/${encodedValue}`, {
            method: 'POST',
        });
    },

    unblock: async (value: string) => {
        const encodedValue = encodeURIComponent(value);
        return apiRequest(`/scam-lookup/unblock/${encodedValue}`, {
            method: 'POST',
        });
    },
};

// Alerts APIs
export const alertsAPI = {
    getActive: async (city?: string, state?: string) => {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (state) params.append('state', state);
        return apiRequest(`/alerts/active?${params.toString()}`);
    },

    getAll: async (params?: {
        page?: number;
        limit?: number;
        alertType?: string;
        severity?: string;
        city?: string;
        state?: string;
    }) => {
        const queryString = new URLSearchParams(params as any).toString();
        return apiRequest(`/alerts?${queryString}`);
    },

    getById: async (id: string) => {
        return apiRequest(`/alerts/${id}`);
    },
};

// Admin APIs
export const adminAPI = {
    getDashboard: async () => {
        return apiRequest('/admin/dashboard');
    },

    getPendingReports: async (page: number = 1, limit: number = 20) => {
        return apiRequest(`/admin/reports/pending?page=${page}&limit=${limit}`);
    },

    verifyReport: async (id: string) => {
        return apiRequest(`/admin/reports/${id}/verify`, {
            method: 'POST',
        });
    },

    rejectReport: async (id: string, reason: string) => {
        return apiRequest(`/admin/reports/${id}/reject`, {
            method: 'POST',
            body: JSON.stringify({ reason }),
        });
    },

    getLocationStats: async () => {
        return apiRequest('/admin/analytics/location');
    },

    getTrends: async (days: number = 30) => {
        return apiRequest(`/admin/analytics/trends?days=${days}`);
    },

    getUsers: async (page: number = 1, limit: number = 20) => {
        return apiRequest(`/admin/users?page=${page}&limit=${limit}`);
    },
};

// Users APIs
export const usersAPI = {
    getProfile: async () => {
        return apiRequest('/users/profile');
    },

    updateProfile: async (data: {
        name?: string;
        mobile?: string;
        city?: string;
        state?: string;
    }) => {
        return apiRequest('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// Health Check
export const healthAPI = {
    check: async () => {
        return apiRequest('/');
    },

    stats: async () => {
        return apiRequest('/stats');
    },
};
