import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:2121'
});

export default api;