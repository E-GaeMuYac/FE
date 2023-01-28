import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Mobile, Laptop, PC } from '../../query/useMediaQuery';

const ThirdSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        <PC>
          {scrollPoint > 1000 && (
            <Content1>
              <h3>검색</h3>
              <h1>
                약에 대해 궁금하다면
                <br />
                검색을 해보세요!
              </h1>
            </Content1>
          )}
          {scrollPoint > 1400 && <Content2 />}
        </PC>
        <Laptop>
          {scrollPoint > 600 && (
            <Content1>
              <h3>검색</h3>
              <h1>
                약에 대해 궁금하다면
                <br />
                검색을 해보세요!
              </h1>
            </Content1>
          )}
          {scrollPoint > 1000 && <Content2 />}
        </Laptop>
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
  @media screen and (max-width: 1700px) {
    margin-top: 30vh;
    margin-bottom: 25vh;
  }
  width: 100%;
  /* height: 841px; */
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  @media screen and (max-width: 1700px) {
    margin-top: 1vh;
    margin-bottom: 6vh;
  }
  margin-top: 300px;
  margin-bottom: 150px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
  h3 {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
    }
    font-size: 28px;
    font-weight: 700;
    color: #3366ff;
  }
  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 36px;
      line-height: 55px;
    }
    font-size: 50px;
    text-align: center;
    font-weight: 700;
  }
`;

const Content2 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 85%;
  }
  background-image: url('/assets/image/검색바.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 860px;
  max-height: 106px;
  height: 12.32vw;
  /* margin-top: 200px; */
  /* display: flex;
  justify-content: center;
  align-items: center; */
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
`;
export default ThirdSection;
