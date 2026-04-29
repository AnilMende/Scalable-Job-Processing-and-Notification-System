import axios from "axios";

const api = axios.create({
    baseURL : "https://jobs-processing-backend.onrender.com",
    withCredentials : true
})

export default api;
