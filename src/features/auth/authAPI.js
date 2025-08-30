import axios from "axios";

const API_URL = "https://mern-blog-9xkb.onrender.com/api/auth"; // adjust when backend ready

export const registerUser = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axios.post(`${API_URL}/login`, userData);
  return res.data;
};
