import axios from "axios";

const API_URL = "http://localhost:8000/api/";

export const register = async (username, email, password) => {
  return await axios.post(`${API_URL}register/`, { username, email, password });
};


export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}login/`, { username, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};