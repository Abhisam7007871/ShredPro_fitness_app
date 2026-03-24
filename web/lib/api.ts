import axios from "axios";

// Base URL for your backend gateway / API.
// Configure this in web/.env.local, for example:
// NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;

