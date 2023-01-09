import axios from 'axios';
import React, { useEffect } from 'react';

const KakaoRedirect = () => {
  const code = new URL(window.location.href).searchParams.get('code');
  const type = process.env.NODE_ENV;

  const api = axios.create({ baseURL: process.env.REACT_APP_API_ENDPOINT });

  useEffect(() => {
    kakaoLogin(code);
  }, []);

  const kakaoLogin = async (code) => {
    try {
      const res = await api.get(
        `/api/users/login/kakao?type=${type}&code=${code}`
      );
      console.log(res);
    } catch (e) {
      alert(e);
    }
  };
  return;
};

export default KakaoRedirect;
