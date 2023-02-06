import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/common/Spinner';

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

  return (
    <div>
      <Spinner />
    </div>
  );
};

export default SocialLogin;
