import axios from 'axios';

export const baseUrl = "http://localhost:4001/"


export const profileUrlpath = baseUrl + 'profile/'

const instance = axios.create({
    baseURL: `${baseUrl}api/`,
    headers: {
        'Content-Type': 'application/json',
    },

});

instance.interceptors.request.use(config => {
    const accessToken = localStorage.getItem('auth_token');
    accessToken && (config.headers.Authorization = `Bearer ${accessToken}`);
    return config;
}, error => Promise.reject(error));

instance.interceptors.response.use(
    response => response,
    async (error) => {
        const prevRequest = error?.config;
        if (error.response.status === 403 && !prevRequest.sent) {
            prevRequest.sent = true
            const { data } = await instance.get('/auth/refresh', { withCredentials: true });
            if (data.success) {
                localStorage.setItem('auth_token', data.accessToken)
                return instance.request(prevRequest)
            }
            localStorage.removeItem('auth_token')
            return Promise.reject(error)
        }
    }
)





export default instance;