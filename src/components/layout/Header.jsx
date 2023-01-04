import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderWrapper>
      {/* 이미지로 교체 예정 */}
      <LogoBox>LOGO</LogoBox>
      <CategoryBox>
        <StyledLink>카테고리1</StyledLink>
        <StyledLink>카테고리2</StyledLink>
        <StyledLink>카테고리3</StyledLink>
        <StyledLink>카테고리4</StyledLink>
      </CategoryBox>
      <SignBox>
        <LoginBtn>로그인</LoginBtn>
        <SignupBtn>회원가입</SignupBtn>
      </SignBox>
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
  border-bottom: 1px solid black;
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
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 80px;
  align-items: center;
  font-size: 23px;
  font-weight: 600;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const SignBox = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: center;
`;

const LoginBtn = styled.button`
  background-color: white;
  width: 100px;
  height: 35px;
  font-size: 16px;
  font-weight: 900;
  border: 1px solid black;
  cursor: pointer;
`;

const SignupBtn = styled.button`
  background-color: black;
  color: white;
  width: 100px;
  height: 35px;
  font-size: 16px;
  font-weight: 900;
  cursor: pointer;
`;
export default Header;
