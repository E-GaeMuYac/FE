import React from 'react';
import styled, { keyframes } from 'styled-components';

const SecondSection = () => {
  return (
    <Flex>
      <Wrapper>
        <ContentWrap>
          <h2>필넛에서 의약품에 대한 정보를 한눈에 확인하세요.</h2>
          <h2>의약품 검색부터 비교, 저장까지</h2>
          <h2>필넛이 당신의 의약품 이용이 편리하도록 도와드릴게요.</h2>
        </ContentWrap>
      </Wrapper>
    </Flex>
  );
};

const Flex = styled.div`
  background-color: #ebebeb;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 1140px;
  height: 558px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrap = styled.div`
  text-align: center;
`;

export default SecondSection;
