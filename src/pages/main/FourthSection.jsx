import React from 'react';
import styled, { keyframes } from 'styled-components';

const FourthSection = () => {
  return (
    <Flex>
      <Wrapper>
        <Content1>
          <h3>상세페이지</h3>
          <h2>약 성분과 효능, 부작용까지 빠르게 확인해보세요</h2>
        </Content1>
        <Content2 />
        <Content3>
          <div>
            <h2>성분 그래프로</h2>
            <h2>성분 비율을 한눈에!</h2>
          </div>
          <p>약 설명서에 적혀있는 성분들 읽기에 너무 작지 않나요?</p>
          <p>이제 필너츠에서 성분 비율까지 명확하게 확인하세요!</p>
        </Content3>
        <Content4>
          <div>
            <h2>주요 유효성분</h2>
            <h2>3개 제공</h2>
          </div>
          <p>
            약의 이해를 위해 성분의 함량에 관계없이, <br />
            중요순서로 3개를 뽑아 정보를 제공합니다.
          </p>
          <p>
            궁금하신 성분 위에 마우스, 손을 가져다 대면 성분의 효능에 대해
            알려드려요!
          </p>
        </Content4>
        <Content5 />
        <Content6 />
        <Content7>
          <div>
            <h2>의약품의</h2>
            <h2>다양한 정보 제공</h2>
          </div>
          <p>
            약의 대해 궁금한 정보가 있다면 탭을 클릭해보세요.
            <br />
            당신이 원하는 정보를 제공해드릴게요.
          </p>
        </Content7>
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
  width: 1140px;
  height: 2512px;
  position: relative;
`;

const Content1 = styled.div`
  width: 620px;
  height: 300px;
  position: absolute;
  top: 180px;
  left: 270px;
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
  background-image: url('/assets/image/성분그래프.png');
  background-size: cover;
  width: 450px;
  height: 485px;
  position: absolute;
  top: 680px;
  left: 50px;
`;

const Content3 = styled.div`
  width: 570px;
  height: 218px;
  position: absolute;
  top: 800px;
  right: -20px;
  div {
    margin-bottom: 40px;
  }
  h2 {
    margin: 5px;
    font-size: 40px;
  }
  p {
    margin: 5px;
    font-size: 22px;
    font-weight: 600;
    color: #868686;
  }
`;

const Content4 = styled.div`
  width: 440px;
  position: absolute;
  top: 1400px;
  left: 90px;
  div {
    margin-bottom: 40px;
  }
  h2 {
    margin: 5px;
    font-size: 40px;
  }
  p {
    margin: 20px 0;
    font-size: 22px;
    font-weight: 600;
    color: #868686;
  }
`;

const Content5 = styled.div`
  background-image: url('/assets/image/주요 유효성분.png');
  background-size: cover;
  width: 380px;
  height: 485px;
  position: absolute;
  top: 1350px;
  right: 90px;
`;

const Content6 = styled.div`
  background-image: url('/assets/image/탭바.png');
  background-size: cover;
  width: 500px;
  height: 100px;
  position: absolute;
  top: 2100px;
  left: 90px;
`;

const Content7 = styled.div`
  width: 520px;
  height: 218px;
  position: absolute;
  top: 2050px;
  right: 0px;
  div {
    margin-bottom: 40px;
  }
  h2 {
    margin: 5px;
    font-size: 40px;
  }
  p {
    margin: 20px 0;
    font-size: 22px;
    font-weight: 600;
    color: #868686;
  }
`;

export default FourthSection;
