import axios from 'axios';
import React, { useEffect } from 'react';

const NaverRedirect = () => {
  const code = new URL(window.location.href).search.split('&')[0].split('=')[1];

  const api = axios.create({ baseURL: process.env.REACT_APP_API_ENDPOINT });

  useEffect(() => {
    NaverLogin(code);
  }, []);

  const NaverLogin = async (code) => {
    try {
      const res = await api.get(`/api/users/login/naver?code=${code}`);
      console.log(res);
    } catch (e) {
      alert(e);
    }
  };
  return;
};

export default NaverRedirect;
