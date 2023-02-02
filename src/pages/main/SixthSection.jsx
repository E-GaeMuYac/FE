import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Mobile, Laptop, PC } from '../../query/useMediaQuery';

const SixthSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        <PC>
          {scrollPoint > 6800 && (
            <div className='contentsBox'>
              {/* <Content1>
              <h2>
                땅콩의 껍질을 까서 먹듯,
                <br />
                약의 속도 파헤쳐 보자
              </h2>
            </Content1> */}
              {/* <Content1 /> */}
              <Content2 />
              <Content3 to='/search'>지금 체험해보기</Content3>
            </div>
          )}
        </PC>
        <Laptop>
          {scrollPoint > 4200 && (
            <div className='contentsBox'>
              {/* <Content1>
              <h2>
                땅콩의 껍질을 까서 먹듯,
                <br />
                약의 속도 파헤쳐 보자
              </h2>
            </Content1> */}
              {/* <Content1 /> */}
              <Content2 />
              <Content3 to='/search'>지금 체험해보기</Content3>
            </div>
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
  width: 1920px;
  height: 100vh;
  /* position: relative; */
  /* display: flex;
  flex-direction: column;
  align-items: center; */
  .contentsBox {
    /* background-color: aliceblue; */
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
  }
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
  @media screen and (max-width: 1700px) {
    background-size: 70%;
    background-position: center;
  }
  background-image: url('/assets/image/메인 섹션6-1.png');
  background-size: cover;
  background-repeat: no-repeat;
  width: 540px;
  height: 162px;
  /* text-align: center; */
  /* margin-top: 300px; */
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; */
  animation: ${show} 2s ease-out forwards;
  h2 {
    /* position: absolute; */
    font-size: 50px;
  }
`;

const Content2 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 60%;
    background-position: center;
    margin: 3vh 0 0 0;
    height: 400px;
  }
  background-image: url('/assets/image/메인 섹션6.png');
  background-size: cover;
  background-repeat: no-repeat;
  width: 430px;
  height: 484px;
  margin: 100px 0 80px 0;
  /* position: absolute;
  top: 115px;
  right: 400px; */
  animation: ${show} 2s ease-out forwards;
  opacity: 0;
`;

const Content3 = styled(Link)`
  @media screen and (max-width: 1700px) {
    width: 270px;
    height: 58px;
    font-size: 23px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  width: 420px;
  height: 80px;
  background-color: #3366ff;
  border: 0;
  border-radius: 12px;
  font-weight: 700;
  font-size: 28px;
  color: #ffffff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  /* margin: 70px 0 100px 0; */
  /* position: absolute;
  top: 110px;
  right: 0px; */
  animation: ${show} 2s ease-out forwards;
  opacity: 0;
  :hover {
    background-color: #1751ff;
  }
`;

export default SixthSection;
