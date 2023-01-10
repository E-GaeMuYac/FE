import axios from 'axios';
import React, { useEffect } from 'react';

const GoogleRedirect = () => {
  const hash = new URLSearchParams(window.location.hash.substring(1));
  const token = hash.get('access_token');

  const api = axios.create({ baseURL: process.env.REACT_APP_API_ENDPOINT });

  useEffect(() => {
    GoogleLogin(token);
  }, []);

  const GoogleLogin = async (token) => {
    try {
      const res = await api.get(`/api/users/login/google?code=${token}`);
      console.log(res);
    } catch (e) {
      alert(e);
    }
  };
  return;
};

export default GoogleRedirect;
