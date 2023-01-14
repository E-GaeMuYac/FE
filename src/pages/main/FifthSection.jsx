import React from 'react';
import styled, { keyframes } from 'styled-components';

const FifthSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        {scrollPoint > 4200 && (
          <>
            <Content1>
              <h3>비교하기</h3>
              <h2>
                약국에 갈 때마다 다르게 받는 감기약, <br />
                뭐가 어떻게 다른지 비교해보세요!
              </h2>
            </Content1>
            <Content2>
              <CardWrap>
                <Card />
                <Card />
              </CardWrap>
              <Tab />
              <DottedLine1 />
              <DottedLine2 />
            </Content2>
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
  background-color: skyblue;
  width: 1920px;
  height: 1447px;
  position: relative;
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

const flicker = keyframes`
  0% {
    transform: translate3d(0, 100%, 0);
  } 50% {
    transform: translateZ(0);
    opacity:1;
  } 75% {
    opacity:0;
  } 100% {
    opacity:1;
  }
`;

const fadein = keyframes`
    from {
        opacity: 0;
    } to {
        opacity: 1;
    }
`;

const Content1 = styled.div`
  width: 850px;
  height: 300px;
  position: absolute;
  top: 150px;
  left: 550px;
  animation: ${slide} 1s ease-in forwards;
  h3 {
    margin: 0;
    font-size: 28px;
    color: #00c58d;
  }
  h2 {
    position: absolute;
    font-size: 50px;
    text-align: center;
  }
`;

const Content2 = styled.div`
  width: 100%;
  height: 945px;
`;

const CardWrap = styled.div`
  width: 1100px;
  height: 485px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 490px;
  left: 410px;
`;

const Card = styled.div`
  background-image: url('/assets/image/약정보카드.png');
  background-size: cover;
  width: 450px;
  height: 485px;
  opacity: 0;
  animation: ${flicker} 1.5s 1s ease-out forwards;
`;

const Tab = styled.div`
  background-image: url('/assets/image/비교함.png');
  background-size: cover;
  width: 1718px;
  height: 320px;
  position: absolute;
  top: 1127px;
  left: 90px;
  opacity: 0;
  animation: ${slide} 1s 2s ease-in forwards;
`;

const DottedLine1 = styled.div`
  background-image: url('/assets/image/점선.png');
  background-size: cover;
  width: 12px;
  height: 360px;
  position: absolute;
  top: 895px;
  left: 700px;
  opacity: 0;
  animation: ${fadein} 1s 3s ease-in forwards;
`;

const DottedLine2 = styled.div`
  background-image: url('/assets/image/점선.png');
  background-size: cover;
  width: 12px;
  height: 360px;
  position: absolute;
  top: 895px;
  left: 1200px;
  opacity: 0;
  animation: ${fadein} 1s 3s ease-in forwards;
`;
export default FifthSection;
