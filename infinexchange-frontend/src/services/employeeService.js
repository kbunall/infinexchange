import axios from "axios";
// http://localhost:9090/api/v1/employee
// const URL = process.env.BASE_API_URL + "users";



const URL = "http://localhost:9090/api/v1/users";

let accessToken = localStorage.getItem("accessToken");

const createEmployee = async (values) => {
  const token = localStorage.getItem('jwtToken');
  const response = await axios.post(URL, values, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });
  return response;
};

const searchAllEmployee = async (
  id = "",
  username = "",
  firstName = "",
  lastName = "",
  role = "",
  email = ""
) => {
  const params = { id, username, firstName, lastName, role, email };
  console.log(accessToken)
  const queryString = Object.entries(params)
    .filter(([key, value]) => value) // Sadece değeri dolu olanları alır
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // Parametreleri URL için uygun hale getirir
    .join("&");

  const url = `${URL}/search${queryString ? `?${queryString}` : ""}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  return response;
};
const updateUser = async (id, employeeData) => {
 // const token = getToken();
  const response = await axios.put(`${URL}/${id}`, employeeData, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
      }
  });
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${URL}/${id}`, {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
      }
  });
  return response.data;
};

export default {
  createEmployee,
  searchAllEmployee,
  updateUser,
  getUserById,
}