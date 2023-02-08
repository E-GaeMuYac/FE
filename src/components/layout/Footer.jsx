import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Footer = () => {
  const navigate = useNavigate();
  const navArr = [
    { navName: '검색하기', path: '/search' },
    { navName: '비교하기', path: '/compare' },
    { navName: '이벤트', path: '/event' },
  ];

  const pageChange = (nav) => {
    navigate(`${nav.path}`);
  };

  return (
    <Wrapper>
      <ContentsWrap>
        <Nav>
          {navArr.map((nav) => (
            <NavName key={nav.navName} onClick={() => pageChange(nav)}>
              {nav.navName}
            </NavName>
          ))}
        </Nav>
        <Copyright>@Copyright 2023. Pillnuts All rights reserved.</Copyright>
        <LogoBox>
          <Mfds />
          <Kogl />
        </LogoBox>
      </ContentsWrap>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 230px;
  border-top: 1px solid #d0d0d0;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 40px 0;
`;

const ContentsWrap = styled.div`
  width: 1024px;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  align-items: center;
`;

const Nav = styled.div`
  width: 320px;
  height: 25px;
  display: flex;
  justify-content: space-around;
  text-align: center;
`;

const NavName = styled.span`
  font-size: 18px;
  color: #868686;
  font-weight: bold;
  cursor: pointer;
`;

const Copyright = styled.span`
  height: 70px;
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #868686;
`;

const LogoBox = styled.div`
  width: 256px;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Kogl = styled.div`
  background-image: url('/assets/image/공공누리.png');
  background-size: cover;
  width: 93px;
  height: 35px;
`;

const Mfds = styled.div`
  background-image: url('/assets/image/식약처로고.png');
  background-size: cover;
  width: 149px;
  height: 43px;
`;
export default Footer;
