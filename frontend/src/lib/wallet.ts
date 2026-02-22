import api from './api';

export const walletService = {
    getBalance: async () => {
        const response = await api.get('/wallet/balance/');
        return response.data;
    },

    getTransactions: async () => {
        const response = await api.get('/wallet/transactions/');
        return response.data;
    },
};
