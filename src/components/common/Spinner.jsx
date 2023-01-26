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
  width: 100%;
  height: 1080px;
  display: flex;
  align-items: center;
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
  width: 659px;
  height: 526px;
  background-image: url('/assets/image/spinner.png');
  background-size: cover;
  background-position: center;
  animation: ${shake} 1s 0s infinite;
`;

export default Spinner;
