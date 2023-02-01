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
    <NavTap isClicked={isClicked} onClick={tabChange}>
      {tab}
    </NavTap>
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
    </Tabbar>
  );
};

const Tabbar = styled.div`
  width: 100%;
  border-bottom: 3px solid #e7e7e7;
`;

const NavWrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 600px;
    margin-top: 40px;
  }
  width: 900px;
  margin-top: 80px;
  display: flex;
`;

const NavTap = styled.button`
  @media screen and (max-width: 1700px) {
    font-size: 18px;
    height: 40px;
  }
  width: 100%;
  height: 60px;
  font-size: 26px;
  font-weight: bold;
  border: none;
  background-color: white;
  border-bottom: ${({ isClicked }) =>
    isClicked ? '4px solid #3366FF' : 'none'};
  color: ${({ isClicked }) => (isClicked ? '#3366FF' : '#868686')};
`;

export default MypageTab;
