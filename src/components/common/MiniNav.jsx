import React from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';

const MiniNav = () => {
  const { id } = useParams();
  console.log(id);
  console.log(window.location.pathname);

  const currentLocation = window.location.pathname;

  const detailNav = ['검색하기', '상세 페이지'];

  return (
    <Wrapper>
      {currentLocation === '/allergy' && (
        <>
          <LinkNav to='/mypage'>마이페이지</LinkNav>
          <SpanNav>▶</SpanNav>
          <LinkNav to='/allergy'>알레르기 등록</LinkNav>
        </>
      )}
      {currentLocation.includes('/reviewform') && (
        <>
          <LinkNav to='/search'>검색하기</LinkNav>
          <SpanNav>▶</SpanNav>
          <LinkNav to={`/detail/${id}`}>상세 페이지</LinkNav>
          <SpanNav>▶</SpanNav>
          <LinkNav to={`/detail/${id}/reviewform`}>리뷰 작성하기</LinkNav>
        </>
      )}
      {currentLocation.includes('/detail') && (
        <>
          <LinkNav to='/search'>검색하기</LinkNav>
          <SpanNav>▶</SpanNav>
          <LinkNav to={`/detail/${id}`}>상세 페이지</LinkNav>
        </>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 1920px;
  height: 38px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  padding-left: 725px;
`;

const LinkNav = styled(Link)`
  color: #868686 !important;
  font-weight: bold;
  margin: 0 5px;
  text-decoration: none;
`;

const SpanNav = styled.span`
  color: #868686;
  font-weight: bold;
  margin: 0 5px;
`;

export default MiniNav;
