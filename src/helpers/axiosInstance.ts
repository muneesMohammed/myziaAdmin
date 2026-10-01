import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1",
});

if (typeof window !== "undefined") {
  axiosInstance.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("myziya_access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}

export default axiosInstance;
