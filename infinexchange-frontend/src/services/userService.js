import axios from 'axios';

const API_URL = 'http://localhost:9090/api/v1/users'; // Adjust the URL as necessary

const getToken = () => localStorage.getItem('accessToken');

const getAllUsers = async () => {
    const token = getToken();
    const response = await axios.get(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const getUserById = async (id) => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const createUser = async (userRequest) => {
    const token = getToken();
    const response = await axios.post(API_URL, userRequest, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const updateUser = async (id, userRequest) => {
    const token = getToken();
    const response = await axios.put(`${API_URL}/${id}`, userRequest, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const deleteUser = async (id) => {
    const token = getToken();
    await axios.delete(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export default{
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
