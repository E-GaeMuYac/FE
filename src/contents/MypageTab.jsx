import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const Tab = ({ tab, location, query }) => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const tabChange = () => {
    navigate(`${location}?tab=${tab}`);
  };

  useEffect(() => {
    if (tab === query) {
      setIsClicked(true);
    } else {
      setIsClicked(false);
    }
  }, [tab, query]);

  return (
    <TapWrap>
      <NavTap isClicked={isClicked} onClick={tabChange}>
        {tab}
      </NavTap>
      <TapBoder isClicked={isClicked} />
    </TapWrap>
  );
};

const MypageTab = ({ query }) => {
  const location = window.location.pathname;
  const tabName = ['내가 찜한 의약품', '나의 알레르기', '내가 쓴 리뷰'];

  return (
    <Tabbar>
      <NavWrap>
        {tabName.map((tab) => (
          <Tab key={tab} tab={tab} location={location} query={query} />
        ))}
      </NavWrap>
      <UnderLine />
    </Tabbar>
  );
};

const Tabbar = styled.div`
  @media screen and (max-width: 1700px) {
    height: 85px;
  }
  width: 100%;
  height: 145px;
  position: relative;
`;

const NavWrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 600px;
  }
  width: 900px;
  display: flex;
  position: absolute;
  bottom: 0;
  z-index: 3;
`;

const TapWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const NavTap = styled.button`
  @media screen and (max-width: 1700px) {
    font-size: 18px;
    height: 40px;
  }
  width: 100%;
  height: 60px;
  font-size: 24px;
  font-weight: ${({ isClicked }) => (isClicked ? 'bold' : '500')};
  border: none;
  background-color: white;
  color: ${({ isClicked }) => (isClicked ? '#3366FF' : '#868686')};
`;

const TapBoder = styled.div`
  @media screen and (max-width: 1700px) {
    height: ${({ isClicked }) => (isClicked ? '4px' : 'none')};
  }
  width: 100%;
  height: ${({ isClicked }) => (isClicked ? '5px' : 'none')};
  background-color: ${({ isClicked }) => (isClicked ? '#3366FF' : '#e7e7e7')};
  border-radius: 3px;
`;

const UnderLine = styled.div`
  @media screen and (max-width: 1700px) {
    border-bottom: 2px solid #e7e7e7;
  }
  width: 100%;
  height: 80px;
  border-bottom: 3px solid #e7e7e7;
  position: absolute;
  bottom: 0;
`;
export default MypageTab;
