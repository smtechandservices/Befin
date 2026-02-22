import api from './api';

export const walletService = {
    getBalance: async () => {
        try {
            const response = await api.get('/wallet/balance/');
            return response.data;
        } catch (e) {
            return { balance: 2400000.00 }; // fallback
        }
    },

    getTransactions: async () => {
        try {
            const response = await api.get('/wallet/transactions/');
            return response.data;
        } catch (e) {
            return []; // fallback
        }
    },
};
