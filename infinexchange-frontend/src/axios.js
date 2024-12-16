// src/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9090'
});

// İstek öncesi interceptor
instance.interceptors.request.use(
    config => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Yanıt sonrası interceptor
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:9090/api/v1/oauth/token/refresh', {
                    refreshToken
                });

                // Yeni token'ları sakla
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);

                // Orijinal isteği yenile
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Token yenileme başarısız:', refreshError);
                // Yenileme başarısızsa, kullanıcıyı giriş sayfasına yönlendir
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
