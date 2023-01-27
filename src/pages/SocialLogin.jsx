import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { userApi } from '../apis/apiInstance';

const SocialLogin = (props) => {
  const navigation = useNavigate();
  const setIsToken = props.setistoken;
  const setUserImage = props.setuserimage;
  const [searchParams, setSearchParams] = useSearchParams();
  const accesstoken = searchParams.get('accesstoken');
  const refreshtoken = searchParams.get('refreshtoken');
  const nickname = searchParams.get('nickname');

  useEffect(() => {
    localStorage.setItem('accessToken', accesstoken);
    localStorage.setItem('refreshToken', refreshtoken);
    localStorage.setItem('nickname', nickname);

    setIsToken(true);
    GetProfile();
    navigation('/');
    const accessToken = localStorage.getItem('accessToken');
    console.log(accessToken);
  }, []);

  const GetProfile = async () => {
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
