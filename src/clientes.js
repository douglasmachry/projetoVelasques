import axios from 'axios';

const clientesApi = axios.create({
    baseURL: 'http://www.mocky.io/v2/598b16291100004705515ec5'
});

export default clientesApi;