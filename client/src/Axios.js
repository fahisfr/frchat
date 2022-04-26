const axios = require('axios');

const baseUrl = 'http://localhost:4001/api';

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        "authorization": localStorage.getItem("auccesstoken")??null
    }
});

export default instance;