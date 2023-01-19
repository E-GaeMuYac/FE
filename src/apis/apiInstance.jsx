import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

api.interceptors.response.use(function (config) {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    const newAccessToken = config.headers.accesstoken;
    localStorage.setItem('accessToken', newAccessToken);
  }

  return config;
});

export const userApi = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

userApi.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  config.headers.accesstoken = `${accessToken}`;
  config.headers.refreshtoken = `${refreshToken}`;

  return config;
});

userApi.interceptors.response.use(function (config) {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    const newAccessToken = config.headers.accesstoken;
    localStorage.setItem('accessToken', newAccessToken);
  }

  return config;
});
