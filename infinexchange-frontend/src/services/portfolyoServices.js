import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api/v1/portfolios';

const getToken = () => localStorage.getItem('accessToken');

export const getAll = async (
  taxNo = "",
  tcNo = "",
  corporationName = "",
  firstName = "",
  lastName = "",
  currencyCode = "",
  amount = ""
) => {
  const params = { taxNo, tcNo, corporationName, firstName, lastName, currencyCode, amount: amount ? amount.toString() : "" };
  const queryString = Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const url = `${API_BASE_URL}${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    throw error; // Hata fırlatmayı unutmayın
  }
};
