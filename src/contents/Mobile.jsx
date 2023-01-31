import React from 'react';
import styled from 'styled-components';

const Mobile = () => {
  return (
    <Wrap>
      <MobileImg />
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #171635;
`;

const MobileImg = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('/assets/image/for_PC.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;
export default Mobile;
