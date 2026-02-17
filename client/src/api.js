import axios from "axios";

const api = await axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

export default api;