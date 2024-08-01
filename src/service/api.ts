import axios from 'axios';
import { interceptor } from './interceptor';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/'
});

interceptor(api);

export default api;