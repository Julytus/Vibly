import axios from 'axios';

const baseURL = "http://localhost:8080";
const instance = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// You can add interceptors if needed
instance.interceptors.request.use(
    config => {
        // Do something before request is sent
        return config;
    },
    error => {
        // Do something with request error
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        // Do something with response data
        return response;
    },
    error => {
        // Do something with response error
        return Promise.reject(error);
    }
);

export default instance;