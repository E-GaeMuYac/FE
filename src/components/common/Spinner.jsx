import React from 'react';
import styled, { keyframes } from 'styled-components';

const Spinner = () => {
  return (
    <Wrap>
      <Box></Box>
    </Wrap>
  );
};

const Wrap = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: 220px;
  }
  background-color: white;
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: auto;
  z-index: 9999;
  display: flex;
  margin-top: 270px;
  justify-content: center;
`;

const shake = keyframes`
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-25px);
    }
    100% {
      transform: translateY(0);
    }
  `;

const Box = styled.div`
  @media screen and (max-width: 1700px) {
    width: 294px;
    height: 235px;
  }
  width: 368px;
  height: 294px;
  background-image: url('/assets/image/spinner.png');
  background-size: cover;
  background-position: center;
  animation: ${shake} 1s 0s infinite;
`;

export default Spinner;
