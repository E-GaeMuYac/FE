import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { userApi } from '../../apis/apiInstance';

const Header = () => {
  const [isToken, setIsToken] = useState(false);
  const [userImage, setUserImage] = useState('');

  useLayoutEffect(() => {
    loginCheck();
  });

  const loginCheck = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      setIsToken(true);
      GetProfile();
    }
  };

  const GetProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setUserImage(res.data.user.imageUrl);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <HeaderWrapper>
      {/* 이미지로 교체 예정 */}
      <LogoBox>Logo</LogoBox>
      <CategoryBox>
        <StyledLink>ABOUT</StyledLink>
        <StyledLink to='/search'>검색하기</StyledLink>
        <StyledLink to='/compare'>비교하기</StyledLink>
        <StyledLink>이벤트</StyledLink>
      </CategoryBox>
      {!isToken ? (
        <SignBox>
          <LoginBtn to='/login'>로그인</LoginBtn>
          <SignupBtn to='/signup'>회원가입</SignupBtn>
        </SignBox>
      ) : (
        <SignBox>
          <MypageBtn to='/mypage' userImage={userImage} />
          <LogoutBtn>로그아웃</LogoutBtn>
        </SignBox>
      )}
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-bottom: 1px solid #d0d0d0;
`;

const LogoBox = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
`;

const CategoryBox = styled.div`
  width: 55%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 70px;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #868686;
`;

const SignBox = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  align-items: center;
`;

const LoginBtn = styled.button`
  background-color: #13bd7e;
  width: 100px;
  height: 39px;
  font-size: 16px;
  font-weight: 900;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const SignupBtn = styled.button`
  background-color: #e4ffea;
  width: 100px;
  height: 39px;
  font-size: 16px;
  font-weight: 900;
  color: #13bd7e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const MypageBtn = styled(Link)`
  background-color: pink;
  background-image: ${({ userImage }) => `url(${userImage})`};
  background-size: cover;
  background-position: center;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const LogoutBtn = styled(Link)`
  background-color: #13bd7e;
  width: 100px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 900;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
export default Header;
