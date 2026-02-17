import axios from "axios";

const api = await axios.create({
    baseURL: "http://localhost:5000/api",
})

export default api;