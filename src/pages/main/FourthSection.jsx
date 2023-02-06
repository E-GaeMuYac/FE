import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Mobile, Laptop, PC } from '../../query/useMediaQuery';

const FourthSection = (props) => {
  const scrollPoint = props.scrollpoint;
  return (
    <Flex>
      <Wrapper>
        <PC>
          {scrollPoint > 2000 && (
            <Content1>
              <h3>상세페이지</h3>
              <h2>
                약 성분과 효능, 부작용까지
                <br />
                빠르게 확인해 보세요
              </h2>
            </Content1>
          )}
          <ContentsWrap>
            {scrollPoint > 2300 && (
              <AlignWrap>
                <Content2>
                  <Content2Tooltip />
                </Content2>
              </AlignWrap>
            )}
            {scrollPoint > 2400 && (
              <AlignWrap>
                <Content3>
                  <div className='subTitle'>
                    <span>약 성분 조회</span>
                  </div>
                  <div>
                    <h1>
                      성분 그래프로
                      <br />
                      성분 비율을 한눈에!
                    </h1>
                  </div>
                  <p>
                    약 설명서에 적혀있는 성분들 읽기에 너무 작지 않나요?
                    <br />
                    이제 필너츠에서 성분 비율까지 명확하게 확인하세요!
                  </p>
                </Content3>
              </AlignWrap>
            )}
          </ContentsWrap>
          <ContentsWrap>
            {scrollPoint > 3100 && (
              <AlignWrap>
                <Content4>
                  <div className='subTitle'>
                    <span>알레르기 조회</span>
                  </div>
                  <div>
                    <h1>
                      약 복용시 알레르기 반응을
                      <br />
                      겪으신적 있으신가요?
                    </h1>
                  </div>
                  <p>마이페이지에 알러지 성분을 등록하세요!</p>
                  <p style={{ marginBottom: 0 }}>
                    약에 대한 정보 조회시 알레르기를 유발하는 성분이
                    <br />
                    있다면 알려드릴게요!
                  </p>
                </Content4>
              </AlignWrap>
            )}
            {scrollPoint > 3300 && (
              <AlignWrap>
                <Content5>
                  <Content5Tooltip />
                </Content5>
              </AlignWrap>
            )}
          </ContentsWrap>
          <ContentsWrap>
            {scrollPoint > 3900 && (
              <AlignWrap>
                <Content6 style={{ marginLeft: '30px' }} />
              </AlignWrap>
            )}
            {scrollPoint > 3900 && (
              <AlignWrap>
                <Content7>
                  <div>
                    <div className='subTitle'>
                      <span>중요 성분 확인</span>
                    </div>
                    <h1>
                      제일 유의해서
                      <br />
                      봐야할 성분들이에요!
                    </h1>
                  </div>
                  <p>
                    약의 이해를 돕기 위해 성분의 함량에 관계없이,
                    <br />
                    중요순서로 3개를 뽑아 정보를 제공합니다.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    성분 함량이 가장 많다고 해서 가장 중요한 성분이
                    <br />
                    아닐 수 있으니 꼭 주요 유효성분을 확인해주세요!
                  </p>
                </Content7>
              </AlignWrap>
            )}
          </ContentsWrap>
          <ContentsWrap>
            {scrollPoint > 4500 && (
              <AlignWrap>
                <Content8>
                  <div className='subTitle'>
                    <span>약 정보 제공</span>
                  </div>
                  <div>
                    <h1>
                      의약품의
                      <br />
                      다양한 정보 제공
                    </h1>
                  </div>
                  <p>
                    약에 대해 궁금한 정보가 있다면 탭을 클릭해보세요.
                    <br />
                    당신이 원하는 정보를 제공해드릴게요.
                  </p>
                </Content8>
              </AlignWrap>
            )}
            {scrollPoint > 4650 && (
              <AlignWrap>
                <Content9 />
              </AlignWrap>
            )}
          </ContentsWrap>
        </PC>
        <Laptop>
          {scrollPoint > 1200 && (
            <Content1>
              <h3>상세페이지</h3>
              <h2>
                약 성분과 효능, 부작용까지
                <br />
                빠르게 확인해 보세요
              </h2>
            </Content1>
          )}
          <ContentsWrap>
            {scrollPoint > 1200 && (
              <AlignWrap>
                <Content2>
                  <Content2Tooltip />
                </Content2>
              </AlignWrap>
            )}
            {scrollPoint > 1300 && (
              <AlignWrap>
                <Content3>
                  <div className='subTitle'>
                    <span>약 성분 조회</span>
                  </div>
                  <div>
                    <h1>
                      성분 그래프로
                      <br />
                      성분 비율을 한눈에!
                    </h1>
                  </div>
                  <p>약 설명서에 적혀있는 성분들 읽기에 너무 작지 않나요?</p>
                  <p style={{ marginBottom: 0 }}>
                    이제 필너츠에서 성분 비율까지 명확하게 확인하세요!
                  </p>
                </Content3>
              </AlignWrap>
            )}
          </ContentsWrap>
          <ContentsWrap>
            {scrollPoint > 1800 && (
              <AlignWrap>
                <Content4>
                  <div className='subTitle'>
                    <span>알레르기 조회</span>
                  </div>
                  <div>
                    <h1>
                      약 복용시 알레르기 반응을
                      <br />
                      겪으신적 있으신가요?
                    </h1>
                  </div>
                  <p>마이페이지에 알러지 성분을 등록하세요!</p>
                  <p style={{ marginBottom: 0 }}>
                    약에 대한 정보 조회시 알레르기를 유발하는 성분이
                    <br />
                    있다면 알려드릴게요!
                  </p>
                </Content4>
              </AlignWrap>
            )}
            {scrollPoint > 2000 && (
              <AlignWrap>
                <Content5>
                  <Content5Tooltip />
                </Content5>
              </AlignWrap>
            )}
          </ContentsWrap>
          <ContentsWrap>
            {scrollPoint > 2200 && (
              <AlignWrap>
                <Content6 style={{ marginLeft: '30px' }} />
              </AlignWrap>
            )}
            {scrollPoint > 2400 && (
              <AlignWrap>
                <Content7>
                  <div>
                    <div className='subTitle'>
                      <span>중요 성분 확인</span>
                    </div>
                    <h1>
                      제일 유의해서
                      <br />
                      봐야할 성분들이에요!
                    </h1>
                  </div>
                  <p>
                    약의 이해를 돕기 위해 성분의 함량에 관계없이,
                    <br />
                    중요순서로 3개를 뽑아 정보를 제공합니다.
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    성분 함량이 가장 많다고 해서 가장 중요한 성분이
                    <br />
                    아닐 수 있으니 꼭 주요 유효성분을 확인해주세요!
                  </p>
                </Content7>
              </AlignWrap>
            )}
          </ContentsWrap>
          <ContentsWrap>
            {scrollPoint > 2700 && (
              <AlignWrap>
                <Content8>
                  <div className='subTitle'>
                    <span>약 정보 제공</span>
                  </div>
                  <div>
                    <h1>
                      의약품의
                      <br />
                      다양한 정보 제공
                    </h1>
                  </div>
                  <p>
                    약에 대해 궁금한 정보가 있다면 탭을 클릭해보세요.
                    <br />
                    당신이 원하는 정보를 제공해드릴게요.
                  </p>
                </Content8>
              </AlignWrap>
            )}
            {scrollPoint > 2850 && (
              <AlignWrap>
                <Content9 />
              </AlignWrap>
            )}
          </ContentsWrap>
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
  background-color: white;
  /* width: 100%; */
  /* height: 2512px; */
  position: relative;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  .subTitle {
    margin-bottom: 5px;
    height: 34px;
    display: flex;
    align-items: center;
    span {
      @media screen and (max-width: 1700px) {
        font-size: 15px;
        padding: 2.5px 10px;
      }
      background-color: #ebf0ff;
      border-radius: 8px;
      color: #3366ff;
      padding: 2.5px 10px;
      font-weight: 700;
      font-size: 20px;
    }
  }
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

const ContentsWrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 1000px;
    height: 500px;
  }
  width: 1140px;
  height: 650px;
  /* height: 57.01vw; */
  display: flex;
  /* background-color: aliceblue; */
`;

const Content1 = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: 0vh;
    height: 120px;
  }
  /* width: 100%; */
  height: 300px;
  margin-top: 400px;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  /* justify-content: center; */
  opacity: 0;
  animation: ${slide} 1s ease-out forwards;
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
  h2 {
    @media screen and (max-width: 1700px) {
      font-size: 36px;
      line-height: 55px;
    }
    font-size: 50px;
    text-align: center;
    font-weight: 700;
  }
`;
const AlignWrap = styled.div`
  width: 50%;
  max-height: 650px;
  height: 114.03vw;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  /* background-color: aliceblue; */
`;
const Content2 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 70%;
    background-position: left;
  }
  background-image: url('/assets/image/성분그래프.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 497px;
  max-height: 485px;
  height: 97.58vw;
  /* margin-top: 100px; */
  /* position: absolute;
  top: 680px;
  left: 50px; */
  opacity: 0;
  animation: ${slide} 1s ease-out forwards;
  position: relative;
`;

const Content2Tooltip = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 75%;
    left: 5px;
    bottom: 135px;
    animation: ${show} 0.7s 1s ease-in forwards;
  }
  background-image: url('/assets/image/성분그래프_팝업.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 155px;
  height: 52px;
  position: absolute;
  left: 30px;
  bottom: 110px;
  z-index: 999;
  animation: ${show} 0.8s 1.4s ease-in forwards;
  opacity: 0;
`;

const Content3 = styled.div`
  width: 570px;
  height: 218px;
  /* margin-top: 220px; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
  div {
    @media screen and (max-width: 1700px) {
      margin-bottom: 25px;
    }
    margin-bottom: 40px;
  }
  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 30px;
      line-height: 44px;
    }
    font-size: 40px;
    font-weight: 700;
    line-height: 58px;
  }
  p {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      line-height: 25px;
    }
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    color: #868686;
  }
`;

const Content4 = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  animation: ${slide} 1s ease-out forwards;
  div {
    @media screen and (max-width: 1700px) {
      margin-bottom: 25px;
    }
    margin-bottom: 40px;
  }
  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 30px;
      line-height: 44px;
    }
    font-size: 40px;
    font-weight: 700;
    line-height: 58px;
  }
  p {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      line-height: 25px;
    }
    @media screen and (min-width: 1701px) {
      margin-bottom: 24px;
    }
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    color: #868686;
  }
`;

const Content5 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 70%;
    background-position: left;
  }
  background-image: url('/assets/image/성분그래프2.png');
  background-size: cover;
  background-repeat: no-repeat;
  width: 495px;
  height: 485px;
  display: flex;
  justify-content: center;
  /* margin-top: 150px; */
  /* margin-left: 100px; */
  /* position: absolute;
  top: 1320px;
  right: 90px; */
  opacity: 0;
  animation: ${slide} 1s ease-out forwards;
`;

const Content5Tooltip = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 75%;
    left: 136px;
    top: 113px;
    animation: ${show} 0.7s 1s ease-in forwards;
  }
  background-image: url('/assets/image/성분그래프2_팝업.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 256px;
  height: 107px;
  position: absolute;
  right: -14.5px;
  top: 78px;
  z-index: 999;
  animation: ${show} 0.8s 1.4s ease-in forwards;
  opacity: 0;
`;

const Content6 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 75%;
    background-position: left;
  }
  background-image: url('/assets/image/주요 유효성분.png');
  background-size: cover;
  background-repeat: no-repeat;
  width: 380px;
  height: 485px;
  opacity: 0;
  animation: ${slide} 1s ease-out forwards;
`;

const Content7 = styled.div`
  width: 450px;
  /* margin-top: 225px; */
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
  div {
    @media screen and (max-width: 1700px) {
      margin-bottom: 25px;
    }
    margin-bottom: 40px;
  }
  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 30px;
      line-height: 44px;
    }
    font-size: 40px;
    font-weight: 700;
    line-height: 58px;
  }
  p {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      line-height: 25px;
    }
    @media screen and (min-width: 1701px) {
      margin-bottom: 24px;
    }
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    color: #868686;
  }
`;

const Content8 = styled.div`
  width: 520px;
  /* height: 218px; */
  /* margin-top: 260px; */
  opacity: 0;
  animation: ${slide} 1s 0.5s ease-out forwards;
  div {
    @media screen and (max-width: 1700px) {
      margin-bottom: 25px;
    }
    margin-bottom: 40px;
  }
  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 30px;
      line-height: 44px;
    }
    font-size: 40px;
    font-weight: 700;
    line-height: 58px;
  }
  p {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      line-height: 25px;
    }
    font-size: 22px;
    line-height: 36px;
    font-weight: 500;
    color: #868686;
  }
`;

const Content9 = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 97%;
    background-position: left;
  }
  background-image: url('/assets/image/탭바.png');
  background-size: contain;
  background-repeat: no-repeat;
  width: 600px;
  height: 241px;
  /* background-color: aliceblue; */
  margin-top: 100px;
  /* position: absolute;
  top: 2100px;
  left: 90px; */
  opacity: 0;
  animation: ${slide} 1s 1s ease-out forwards;
`;
export default FourthSection;
