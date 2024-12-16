import axios from 'axios';

const API_URL = 'http://localhost:9090/api/v1/account-transactions';

const getToken = () => localStorage.getItem('accessToken');

const deposit = async (depositRequest) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/deposit`, depositRequest, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const withdraw = async (withdrawalRequest) => {
    const token = getToken();
    const response = await axios.post(`${API_URL}/withdraw`, withdrawalRequest, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const getAllTransactions = async () => {
    const token = getToken();
    const response = await axios.get(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
const searchTransactions = async (params) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/search`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params
    });
    return response.data;
}

export default {
    deposit,
    withdraw,
    getAllTransactions,
    searchTransactions
};
