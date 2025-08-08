import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_BASE_API_URL,
    // withCredentials: true, // Uncomment if you need to send cookies with requests
})



// add a request interceptor

export default api