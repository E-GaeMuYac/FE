import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { userApi } from '../../apis/apiInstance';

const Header = (props) => {
  const navigate = useNavigate();

  const isToken = props.istoken;
  const setIsToken = props.setistoken;

  const userImage = props.userimage;
  const setUserImage = props.setuserimage;

  useEffect(() => {
    loginCheck();
  }, []);

  const loginCheck = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    if (refreshToken || accessToken) {
      GetProfile();
      setIsToken(true);
    }
  };

  const GetProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setUserImage(res.data.user.imageUrl);
    } catch (e) {
      console.log(e);
    }
  };

  const logoutHandler = async () => {
    try {
      const res = await userApi.put('api/users/logout');
      alert(res.data.message);
      localStorage.clear();
      setIsToken(false);
      navigate('/login');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Wrap>
      <HeaderWrapper>
        {/* 이미지로 교체 예정 */}
        <LogoBox to='/'>Logo</LogoBox>
        <CategoryBox>
          <StyledLink to='/'>ABOUT</StyledLink>
          <StyledLink to='/search'>검색하기</StyledLink>
          <StyledLink to='/compare?tab=성분그래프'>비교하기</StyledLink>
          <StyledLink to='/event'>이벤트</StyledLink>
        </CategoryBox>
        {!isToken ? (
          <SignBox>
            <LoginBtn to='/login'>로그인</LoginBtn>
            <SignupBtn to='/signup'>회원가입</SignupBtn>
          </SignBox>
        ) : (
          <SignBox>
            <MypageBtn to='/mypage' props={userImage} />
            <LogoutBtn onClick={logoutHandler}>로그아웃</LogoutBtn>
          </SignBox>
        )}
      </HeaderWrapper>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 80px;
`;

const HeaderWrapper = styled.div`
  background-color: white;
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  border-bottom: 1px solid #d0d0d0;
  z-index: 9999;
`;

const LogoBox = styled(Link)`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
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

const LoginBtn = styled(Link)`
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

const SignupBtn = styled(Link)`
  background-color: #e4ffea;
  width: 100px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-size: 16px;
  font-weight: 900;
  color: #13bd7e;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const MypageBtn = styled(Link)`
  background-image: ${({ props }) => `url(${props})`};
  background-size: cover;
  background-position: center;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const LogoutBtn = styled.button`
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
