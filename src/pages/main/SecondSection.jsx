import React from 'react';
import styled from 'styled-components';

const SecondSection = () => {
  return (
    <Flex>
      <Wrapper>
        <ContentWrap>
          <h2>
            필너츠에서 약에 대한 정보를 한눈에 확인하세요.
            <br />
            상세정보 확인부터 비교, 저장까지
            <br />더 이상 약에 대해 어렵게 느껴지지 않도록 당신을 도와드릴게요.
          </h2>
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
  @media screen and (max-width: 1700px) {
    height: 38vh;
  }
  width: 100%;
  height: 558px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentWrap = styled.div`
  text-align: center;
  h2 {
    @media screen and (max-width: 1700px) {
      font-size: 24px;
      line-height: 40px;
      font-weight: 700;
    }
    font-weight: 500;
    line-height: 50px;
  }
`;

export default SecondSection;
