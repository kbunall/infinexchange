import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/v1/customers';
const getToken = () => localStorage.getItem('accessToken');

const getAllCustomers = async () => {
    const token = getToken();
    const response = await axios.get(API_BASE_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
const searchCustomers = async (params) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/search`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        params
    });
    return response.data;
}

const searchAllCustomer = async (
    id = "",
    userId = "",
    firstName = "",
    lastName = "",
    corporationName = "",
    type = "",
    tcNo = "",
    address = "",
    taxNo = "",
    dateOfBirth = "",
    phoneNumber = "",
    email = "",
    balance = ""
  ) => {
    const params = { id, userId, firstName, lastName, corporationName, type, tcNo, address, taxNo, dateOfBirth, phoneNumber, email, balance };
    const queryString = Object.entries(params)
    .filter(([key, value]) => value) // Sadece değeri dolu olanları alır
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Parametreleri URL için uygun hale getirir
    .join("&");
  
    const url = `${API_BASE_URL}/search${queryString ? `?${queryString}` : ""}`;
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

const createCustomer = async (customerRequest) => {
    const token = getToken();
    const response = await axios.post(API_BASE_URL, customerRequest, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const getCustomerById = async (id) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const updateCustomer = async (id, customerRequest) => {
    const token = getToken();
    const response = await axios.put(`${API_BASE_URL}/${id}`, customerRequest, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

const deleteCustomer = async (id) => {
    const token = getToken();
    await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const getPortfolio = async (id) => {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/${id}/portfolio`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export default {
    getAllCustomers,
    searchCustomers,
    createCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getPortfolio,
    searchAllCustomer
};
