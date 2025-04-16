import api from './config';

export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post('/accounts/token/', { username, password });
    
            const { access, refresh } = response.data;
    
            if (access) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
            }
    
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },    

    register: async (userData) => {
        try {
            const response = await api.post('/accounts/register/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('access_token'); // Get stored token
            const response = await api.get('/accounts/profile/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 