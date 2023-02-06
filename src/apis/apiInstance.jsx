import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

api.interceptors.response.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken || accessToken === undefined) {
      localStorage.clear();
    }

    return config;
  },
  function (response) {
    if (response.response.data.errorMessage === '로그아웃 된 유저입니다.') {
      localStorage.clear();
    } else if (
      response.response.data.errorMessage === '로그인이 유효하지 않습니다.'
    ) {
      localStorage.clear();
    }
    return response;
  }
);

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

userApi.interceptors.response.use(
  function (config) {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken || accessToken === undefined) {
      localStorage.clear();
    }

    return config;
  },
  function (response) {
    if (response.response.data.errorMessage === '로그아웃 된 유저입니다.') {
      localStorage.clear();
    } else if (
      response.response.data.errorMessage === '로그인이 유효하지 않습니다.'
    ) {
      localStorage.clear();
    }
    return response;
  }
);
