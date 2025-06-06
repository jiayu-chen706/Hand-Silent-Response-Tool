import axios from "axios";
import { BASE_URL } from "../api/urls";

const authAxios = axios.create({
  baseURL: BASE_URL,
});

authAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default authAxios;
