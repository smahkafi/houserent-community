import axios from "axios";
import { API_BASE_URL } from "../config/api";

export const loginUser = async (payload) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  return response.data;
};
