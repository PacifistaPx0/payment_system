import api from './config';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/accounts/token/', { email, password });
    
            const { access, refresh, user } = response.data;
    
            if (access) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
    
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },    

    register: async (userData) => {
        try {
            const response = await api.post('/accounts/register/', userData);
            const { access, refresh, user } = response.data;
            
            if (access) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
            
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getCurrentUser: async () => {
        try {
            const token = localStorage.getItem('access_token');
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