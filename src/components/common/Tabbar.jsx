import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Tab = ({ list, query, location, totalCount }) => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);

  const changeTab = () => {
    navigate(`${location}?tab=${list}`);
  };

  useEffect(() => {
    if (list === query) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [list, query]);

  return (
    <>
      {list === '리뷰' ? (
        <TabName isActive={isActive} onClick={changeTab}>
          {list}
          <div>({totalCount})</div>
        </TabName>
      ) : (
        <TabName isActive={isActive} onClick={changeTab}>
          {list}
        </TabName>
      )}
    </>
  );
};

const TabBar = ({ location, query, totalCount }) => {
  const [tabList, setTabList] = useState([
    '카테고리1',
    '카테고리2',
    '카테고리3',
  ]);

  useEffect(() => {
    if (location === '/compare') {
      setTabList([
        '성분그래프',
        '효능 효과',
        '용법 용량',
        '첨가물',
        '유효기간',
      ]);
    }
    if (location.includes('/detail')) {
      setTabList([
        '효능 효과',
        '용법 용량',
        '첨가물',
        '유효기간',
        '주의사항',
        '리뷰',
      ]);
    }
  }, [location]);

  return (
    <Wrap>
      <ul>
        {tabList.map((list) => (
          <Tab
            key={list}
            location={location}
            list={list}
            query={query}
            totalCount={totalCount}
          />
        ))}
      </ul>
    </Wrap>
  );
};

const Wrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 1024px;
    min-width: 1024px;
  }
  width: 100%;
  height: 40px;
  margin-bottom: 16px;
  border-bottom: 2px solid #d9d9d9;
  ul {
    padding: 0px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    list-style: none;
  }
`;
const TabName = styled.li`
  @media screen and (max-width: 1700px) {
    font-size: 16px;
    width: 120px;
  }
  div {
    margin-left: 2px;
    font-weight: 500;
  }
  width: 140px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: ${({ isActive }) => (isActive ? '#3366FF' : '#868686')};
  font-weight: bold;
  position: relative;

  ${({ isActive }) =>
    isActive
      ? `&::after {@media screen and (max-width: 1700px) {
    width: 120px;
  }
    content: '';
    width: 140px;
    height: 3px;
    position: absolute;
    left: 0;
    bottom: -2px;
    border-radius: 3px;
    background-color: #3366ff;
  }`
      : null}
`;

export default TabBar;
