import React from 'react';
import { useNavigate } from 'react-router';
import styled, { keyframes } from 'styled-components';
import { Mobile, Laptop, PC } from '../../query/useMediaQuery';

const ThirdSection = (props) => {
  const scrollPoint = props.scrollpoint;
  const navigate = useNavigate();

  const onClickAnimation = () => {
    navigate('/search');
  };
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
          {scrollPoint > 1400 && <Content2 onClick={onClickAnimation} />}
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
          {scrollPoint > 850 && <Content2 onClick={onClickAnimation} />}
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
  /* @media screen and (max-width: 1700px) {
    margin-top: 30vh;
    padding-bottom: 25vh;
  } */
  width: 100%;
  height: 80vh;
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
`;

const Content2 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 85%;
    background-position: top;
  }
  @media screen and (max-width: 1920px) {
    background-position: top;
  }
  background-image: url('/assets/image/검색바.png');
  background-position: top;
  background-size: contain;
  background-repeat: no-repeat;
  width: 860px;
  max-height: 150px;
  height: 12.32vw;
  /* margin-top: 200px; */
  /* display: flex;
  justify-content: center;
  align-items: center; */
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
  cursor: pointer;
`;
export default ThirdSection;
