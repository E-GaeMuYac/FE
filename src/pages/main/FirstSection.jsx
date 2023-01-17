import React from 'react';
import styled, { keyframes } from 'styled-components';

const FirstSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        {scrollPoint < 375 && (
          <MainContentShow>
            의약품 검색과 비교 필넛에서 도와드려요
          </MainContentShow>
        )}
      </Wrapper>
    </Flex>
  );
};

const Flex = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 1140px;
  height: 1080px;
  position: relative;
`;

const show = keyframes`
    from {
        opacity: 0;
    } to {
        opacity:1;
    }
`;

const MainContentShow = styled.h1`
  width: 511px;
  font-size: 55px;
  text-align: center;
  position: absolute;
  top: 200px;
  left: 320px;
  animation: ${show} 1s ease-in;
`;

export default FirstSection;
