import React from 'react';
import styled, { keyframes } from 'styled-components';

const FirstSection = (props) => {
  const scrollPoint = props.scrollpoint;

  return (
    <Flex>
      <Wrapper>
        {scrollPoint >= 0 && (
          <MainContentShow>
            약에 대한 궁금증
            <br />
            <span>필너츠</span>에서 해결하세요!
          </MainContentShow>
        )}
        {/* <ImgWrap>
          <ContentImg />
        </ImgWrap> */}
        {scrollPoint >= 0 && <ContentImg />}
        {/* {scrollPoint === 0 && (
          <ImgWrap>
            <ContentImg />
          </ImgWrap>
        )} */}
      </Wrapper>
    </Flex>
  );
};

const Flex = styled.div`
  width: 100%;
  display: flex;
  /* justify-content: center; */
`;

const Wrapper = styled.div`
  width: 100%;
  height: 97vh;
  min-height: 97vh;
  max-height: 97vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10vh;
  /* justify-content: center; */
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

const MainContentShow = styled.h1`
  @media screen and (max-width: 1700px) {
    font-size: 40px !important;
    line-height: 65px !important;
    padding-bottom: 0vh !important;
  }
  @media screen and (max-width: 1920px) {
    padding-bottom: 0vh;
    font-size: 54px;
    line-height: 70px;
  }
  span {
    color: #3366ff;
  }
  width: 100%;
  font-weight: 700;
  font-size: 60px;
  line-height: 87px;
  text-align: center;
  animation: ${show} 1s ease-out forwards;
  padding-bottom: 5vh;
`;

const ImgWrap = styled.div`
  /* width: 666px;
  height: 451px; */
  /* padding-top: 67.71%; */
  /* height: 451px; */
  background-color: aliceblue;
  /* aspect-ratio: auto 1 / 1; */
`;

const ContentImg = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 65% !important;
    background-position: top;
  }
  @media screen and (max-width: 1920px) {
    background-size: 85%;
    background-position: top;
  }
  background-image: url('/assets/image/메인 섹션1.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  /* max-width: 100%;
  height: auto; */
  width: 1151px;
  /* background-color: aliceblue; */
  /* height: 0; */
  /* padding-top: calc(67.71%); */
  /* padding-top: 67.71%; */
  /* background: url('/assets/image/메인 섹션1.png') center center / cover
    no-repeat;
  padding-top: calc(451 / 666 * 100%); */
  /* calc (이미지 높이 ÷ 이미지 가로 × 100 %) */
  max-height: 749px;
  height: 153.67vw;
  /* background-color: aliceblue; */
  /* aspect-ratio: auto 1 / 1; */
  /* display: flex; */
  /* justify-content: center; */
  /* margin-top: 150px; */
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
`;

export default FirstSection;
