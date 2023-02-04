import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const SocialLogin = () => {
  const navigation = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accesstoken = searchParams.get('accesstoken');
  const refreshtoken = searchParams.get('refreshtoken');

  useEffect(() => {
    localStorage.setItem('accessToken', accesstoken);
    localStorage.setItem('refreshToken', refreshtoken);

    navigation('/');
  }, []);

  return <div>로그인중</div>;
};

export default SocialLogin;
