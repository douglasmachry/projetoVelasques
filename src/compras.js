import axios from 'axios';

const comprasApi = axios.create({
    baseURL: 'http://www.mocky.io/v2/598b16861100004905515ec7'
});

export default comprasApi;