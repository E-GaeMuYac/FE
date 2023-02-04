import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

const MiniNav = () => {
  const { id } = useParams();

  const currentLocation = window.location.pathname;

  return (
    <Wrapper>
      {currentLocation === '/allergy' && (
        <>
          <LinkNav to='/mypage'>마이페이지</LinkNav>
          <SpanNav />
          <LinkNav to='/allergy'>알레르기 등록</LinkNav>
        </>
      )}
      {currentLocation.includes('/reviewform') && (
        <>
          <LinkNav to='/search'>검색하기</LinkNav>
          <SpanNav />
          <LinkNav to={`/detail/${id}?tab=효능 효과`}>상세 페이지</LinkNav>
          <SpanNav />
          <LinkNav to={`/detail/${id}/reviewform`}>리뷰 작성하기</LinkNav>
        </>
      )}
      {currentLocation === `/detail/${id}` && (
        <>
          <LinkNav to='/search'>검색하기</LinkNav>
          <SpanNav />
          <LinkNav to={`/detail/${id}?tab=효능 효과`}>상세 페이지</LinkNav>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  min-width: 1024px;
  height: 38px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LinkNav = styled(Link)`
  color: #868686 !important;
  font-weight: 500;
  font-size: 15px;
  margin: 0 5px;
  text-decoration: none;
`;

const SpanNav = styled.div`
  background-image: url('/assets/image/miniNavArrow.png');
  background-size: cover;
  width: 20px;
  height: 20px;
`;

export default MiniNav;
