import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { userApi } from '../apis/apiInstance';

const SocialLogin = (props) => {
  const navigation = useNavigate();
  const setUserImage = props.setuserimage;
  const [searchParams, setSearchParams] = useSearchParams();
  const accesstoken = searchParams.get('accesstoken');
  const refreshtoken = searchParams.get('refreshtoken');

  useEffect(() => {
    localStorage.setItem('accessToken', accesstoken);
    localStorage.setItem('refreshToken', refreshtoken);

    getProfile();
    navigation('/');
  }, []);

  const getProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setUserImage(res.data.user.imageUrl);
    } catch (e) {
      console.log(e);
    }
  };

  return <div>로그인중</div>;
};

export default SocialLogin;
