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

    transferCoins: async (username: string, amount: number, password: string) => {
        const response = await api.post('/wallet/transfer/', { username, amount, password });
        return response.data;
    },

    getCardDetails: async (password: string) => {
        const response = await api.post('/wallet/card-details/', { password });
        return response.data;
    }
};
