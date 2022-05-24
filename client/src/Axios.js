import axios from 'axios';

export const baseUrl = 'http://192.168.20.7:4000';


export const profileUrlpath = baseUrl + '/profile/'

const instance = axios.create({
    baseURL: `${baseUrl}/api/`,
    headers: {
        'Content-Type': 'application/json',
    },
    
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
            const { data } = await instance.get('/auth/refresh', { withCredentials: true });
            if (data.success) {
                localStorage.setItem('accessToken', data.accessToken)
                return instance.request(prevRequest)
            }
            return Promise.reject(error)
        }
    }
)





export default instance;