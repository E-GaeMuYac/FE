import React, { useEffect } from 'react';
import styled from 'styled-components';

const Event = () => {
  return (
    <Wrap>
      <EventImg />
    </Wrap>
  );
};
const Wrap = styled.div`
  @media screen and (min-width: 2560px) {
    height: 94.5vh;
  }
  @media screen and (max-width: 1700px) {
    height: 94.5vh;
  }
  width: 100%;
  min-width: 1024px;
  height: 1200px;
  min-height: 900px;
  max-height: 170vh;
  background-color: #3366ff;
`;
const EventImg = styled.div`
  width: 100%;
  max-height: 1440px;
  height: 100%;
  background-image: url('/assets/image/이벤트페이지.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: contain;
`;

export default Event;
