import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Mobile, Laptop, PC } from '../../query/useMediaQuery';

const FifthSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        <PC>
          {scrollPoint > 5200 && (
            <>
              <Content1>
                <h3>비교하기</h3>
                <h1>
                  약국에 갈 때마다 다르게 받는 감기약, <br />
                  뭐가 어떻게 다른지 비교해보세요!
                </h1>
                <p>
                  약국에서 비슷한 약이라고 추천 받아 구매했는데 실제로도
                  그럴까요?
                  <br />
                  필너츠가 비교해드릴게요!
                </p>
              </Content1>
              <Content2>
                <LeftCard />

                <RightCard />
              </Content2>
            </>
          )}
        </PC>
        <Laptop>
          {scrollPoint > 3500 && (
            <>
              <Content1>
                <h3>비교하기</h3>
                <h1>
                  약국에 갈 때마다 다르게 받는 감기약, <br />
                  뭐가 어떻게 다른지 비교해보세요!
                </h1>
                <p>
                  약국에서 비슷한 약이라고 추천 받아 구매했는데 실제로도
                  그럴까요?
                  <br />
                  필너츠가 비교해드릴게요!
                </p>
              </Content1>
              <Content2>
                <LeftCard />

                <RightCard />
              </Content2>
            </>
          )}
        </Laptop>
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
  @media screen and (max-width: 1700px) {
    width: 1000px;
    /* background-color: aliceblue; */
  }
  background-color: white;
  width: 1920px;
  /* height: 1447px; */
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const leftSlide = keyframes`
    from {
        transform: translate3d(-100%, 0, 0);
        opacity: 0;
    } to {
        transform: translateZ(0);
        opacity:1;
    }
`;

const rightSlide = keyframes`
    from {
        transform: translate3d(100%, 0, 0);
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
  @media screen and (max-width: 1700px) {
    margin-top: 17vh;
    height: 260px;
    margin-bottom: 0px;
  }
  /* width: 850px; */
  height: 300px;
  margin-top: 200px;
  margin-bottom: 100px;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  animation: ${slide} 1s ease-in forwards;
  h3 {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
    }
    font-size: 28px;
    font-weight: 700;
    color: #3366ff;
    text-align: center;
    margin-bottom: 10px;
  }
  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 36px;
      line-height: 55px;
    }
    font-size: 50px;
    line-height: 72px;
    text-align: center;
    font-weight: 700;
  }
  p {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      line-height: 34px;
    }
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    color: #868686;
    text-align: center;
    margin-top: 32px;
  }
`;

const Content2 = styled.div`
  @media screen and (max-width: 1700px) {
    /* margin-top: 0vh; */
    overflow: hidden;
  }
  width: 100%;
  /* height: 945px; */
  display: flex;
  /* flex-direction: column; */
  justify-content: center;
`;

const LeftCard = styled.div`
  @media screen and (max-width: 1700px) {
    animation: ${leftSlide} 1.5s 0.8s ease-in forwards;
    background-size: 80%;
    margin-right: -158px;
  }
  background-image: url('/assets/image/섹션5_left.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 600px;
  height: 784px;
  margin-right: -125px;
  opacity: 0;
  animation: ${leftSlide} 1s 1.2s ease-in forwards;
`;
const RightCard = styled.div`
  @media screen and (max-width: 1700px) {
    animation: ${rightSlide} 1.5s 0.8s ease-in forwards;
    background-size: 76%;
    margin-left: -158px;
  }
  background-image: url('/assets/image/섹션5_right.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 600px;
  height: 784px;
  margin-left: -125px;
  opacity: 0;
  animation: ${rightSlide} 1s 1.2s ease-in forwards;
`;

// const CardWrap = styled.div`
//   @media screen and (max-width: 1700px) {
//     width: 65%;
//     margin: 0px auto 0 auto;
//     gap: 160px;
//   }
//   width: 100%;
//   gap: 234px;
//   /* height: 485px; */
//   display: flex;
//   /* justify-content: space-between; */
//   justify-content: center;
//   margin: 100px auto auto auto;
//   /* position: relative; */
//   /* position: absolute;
//   top: 490px;
//   left: 410px; */
// `;

// const Card1 = styled.div`
//   @media screen and (max-width: 1700px) {
//     /* background-size: 95%; */
//     background-size: contain;
//     width: 190px;
//     height: 210px;
//   }
//   position: relative;
//   background-image: url('/assets/image/약정보카드.png');
//   background-size: cover;
//   background-repeat: no-repeat;
//   width: 280px;
//   height: 312px;
//   opacity: 0;
//   z-index: 998;
//   animation: ${flicker} 1.5s 1s ease-out forwards;
// `;

// const Card2 = styled.div`
//   @media screen and (max-width: 1700px) {
//     /* background-size: 95%; */
//     background-size: contain;
//     width: 190px;
//     height: 210px;
//   }
//   position: relative;
//   background-image: url('/assets/image/약정보카드2.png');
//   background-size: cover;
//   background-repeat: no-repeat;
//   width: 280px;
//   height: 312px;
//   opacity: 0;
//   z-index: 998;
//   animation: ${flicker} 1.5s 1s ease-out forwards;
// `;

// const DottedLine1 = styled.div`
//   @media screen and (max-width: 1700px) {
//     width: 5.5px;
//     height: 127px;
//     top: 182px;
//     left: 115px;
//   }
//   background-image: url('/assets/image/점선1.png');
//   background-size: cover;
//   width: 8px;
//   height: 167px;
//   position: absolute;
//   top: 270px;
//   left: 170px;
//   opacity: 0;
//   z-index: 999;
//   animation: ${fadein} 1s 2.5s ease-in forwards;
// `;

// const DottedLine2 = styled.div`
//   @media screen and (max-width: 1700px) {
//     width: 5.5px;
//     height: 127px;
//     top: 182px;
//     right: 90px;
//   }
//   background-image: url('/assets/image/점선1.png');
//   background-size: cover;
//   width: 8px;
//   height: 167px;
//   position: absolute;
//   top: 270px;
//   right: 133px;
//   opacity: 0;
//   z-index: 999;
//   animation: ${fadein} 1s 2.5s ease-in forwards;
// `;

// const Tab = styled.div`
//   @media screen and (max-width: 1700px) {
//     /* background-size: 80%; */
//     width: 100%;
//     /* height: 331px; */
//     /* position: absolute;
//     left: -25%;
//     top: 800px;
//     z-index: 0; */
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     margin: auto;
//     height: 250px;

//     /* overflow: hidden; */
//   }
//   background-image: url('/assets/image/비교함.png');
//   background-position: center;
//   background-size: contain;
//   background-repeat: no-repeat;
//   width: 1498px;
//   height: 331px;
//   z-index: 1;
//   /* max-height: 331px;
//   height: 22.096vw; */
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin: auto;
//   opacity: 0;
//   animation: ${slide} 1s 1.5s ease-in forwards;
// `;

export default FifthSection;
