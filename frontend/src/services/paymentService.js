import api from '../api/config';

export const initializePayment = async (amount) => {
    try {
        const response = await api.post('/payments/pay/initiate/', {
            amount: parseFloat(amount),
            callback_url: `${window.location.origin}/payment/callback`
        });
        
        if (response.data.status && response.data.data.authorization_url) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || 'Payment initialization failed');
        }
    } catch (error) {
        throw error.response?.data?.message || 'Failed to initialize payment';
    }
};

export const verifyPayment = async (reference) => {
    try {
        const response = await api.get(`/payments/pay/verify/${reference}/`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to verify payment';
    }
}; 