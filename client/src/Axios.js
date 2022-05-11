import axios from 'axios';

const baseUrl = 'http://localhost:4001/api';

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

instance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('accessToken');
    accessToken && (config.headers.Authorization = `Bearer ${accessToken}`);
    return config;
}, error => Promise.reject(error));

instance.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error.response.status === 403 && !prevRequest.sent) {
            prevRequest.sent = true
            const { data } = await instance.get('/auth/refresh')
            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken)
                return instance.request(prevRequest)
            }
            return Promise.reject(error)
        }
    }
)





export default instance;