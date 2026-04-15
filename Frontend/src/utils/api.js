import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authRole");
            if (typeof window !== "undefined" && window.location.pathname !== "/signup") {
                window.location.href = "/signup";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
