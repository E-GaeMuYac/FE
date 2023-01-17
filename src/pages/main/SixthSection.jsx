import React from 'react';
import styled, { keyframes } from 'styled-components';

const SixthSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        {scrollPoint > 5797 && (
          <>
            <Content1>
              <h3>찜하기</h3>
              <div />
              <h2>
                찜하기를 눌러 <br />
                내가 자주 복용하는 <br />
                약을 담아보세요
              </h2>
            </Content1>
            <Content2 />
            <Content3 />
          </>
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
  width: 1920px;
  height: 879px;
  position: relative;
`;

const show = keyframes`
    from {
        opacity: 0;
    } to {
        opacity:1;
    }
`;

const vibration = keyframes`
    from {
    transform: rotate(5deg);
    }
    to {
    transform: rotate(-5deg);
    }
`;

const slide = keyframes`
    from {
        opacity: 0;
            transform: translate3d(100%, 0, 0);
    } to {
        opacity: 1;
            transform: translateZ(0);
    }
`;

const Content1 = styled.div`
  width: 443px;
  height: 443px;
  position: absolute;
  top: 150px;
  left: 500px;
  animation: ${show} 1s ease-in;
  h3 {
    margin: 0 0 20px 0;
    font-size: 28px;
    color: #00c58d;
  }
  div {
    background-image: url('/assets/image/찜로고.png');
    background-size: cover;
    width: 99px;
    height: 99px;
    animation: ${vibration} 0.1s 1s ease-in;
    animation-iteration-count: 5;
  }
  h2 {
    position: absolute;
    font-size: 50px;
  }
`;

const Content2 = styled.div`
  background-image: url('/assets/image/약정보카드.png');
  background-size: cover;
  width: 450px;
  height: 485px;
  position: absolute;
  top: 115px;
  right: 400px;
  animation: ${slide} 1s 1.5s ease-out forwards;
  opacity: 0;
`;

const Content3 = styled.div`
  background-image: url('/assets/image/약정보카드2.png');
  background-size: cover;
  width: 400px;
  height: 485px;
  position: absolute;
  top: 110px;
  right: 0px;
  animation: ${slide} 0.5s 2s ease-out forwards;
  opacity: 0;
`;

export default SixthSection;
