import React from 'react';
import styled, { keyframes } from 'styled-components';

const ThirdSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        {scrollPoint > 633 && (
          <Content1>
            <h3>검색</h3>
            <h2>약에 대해 궁금하다면 검색을 해보세요!</h2>
          </Content1>
        )}
        {scrollPoint > 720 && <Content2 />}
      </Wrapper>
    </Flex>
  );
};

const Flex = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  width: 1140px;
  height: 841px;
  position: relative;
`;

const show = keyframes`
    from {
        opacity: 0;
    } to {
        opacity:1;
    }
`;

const slide = keyframes`
    from {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
    } to {
        transform: translateZ(0);
        opacity:1;
    }
`;

const Content1 = styled.div`
  width: 500px;
  height: 300px;
  position: absolute;
  top: 150px;
  left: 325px;
  animation: ${show} 1s ease-in forwards;
  h3 {
    font-size: 28px;
    margin-left: 15px;
    color: #00c58d;
  }
  h2 {
    font-size: 50px;
    text-align: center;
  }
`;

const Content2 = styled.div`
  background-image: url('/assets/image/검색바.png');
  width: 917px;
  height: 147px;
  position: absolute;
  top: 500px;
  left: 130px;
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
`;
export default ThirdSection;
