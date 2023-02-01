import React, { useEffect } from 'react';
import styled from 'styled-components';

const Event = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Wrap>
      <EventImg>
        <button
          onClick={() =>
            window.open(
              'https://docs.google.com/forms/d/e/1FAIpQLSecVl62mf888KCfZ7RpNJ6gyEKiCLWoDGKbPpE7SPy4wPW2WQ/viewform'
            )
          }>
          설문조사 작성하기
        </button>
      </EventImg>
    </Wrap>
  );
};
const Wrap = styled.div`
  width: 100%;
  min-width: 1024px;
  background-color: #3366ff;
`;
const EventImg = styled.div`
  @media screen and (max-width: 1700px) {
    width: 1024px;
    height: 700px;
  }
  position: relative;
  margin: auto;
  width: 1920px;
  height: 100%;
  max-height: 1373px;
  height: 139.83vw;

  background-image: url('/assets/image/이벤트페이지.png');
  background-position: top;
  background-repeat: no-repeat;
  background-size: contain;
  div {
    /* position: absolute;
    bottom: 0;
    margin: auto; */
    z-index: 999;
    width: 420px;
    height: 80px;
    margin: auto;
    background-image: url('/assets/image/설문조사이동.png');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    /* calc (이미지 높이 ÷ 이미지 가로 × 100 %) */
    /* max-height: 80px;
    height: 5.25vw;
    border-radius: 12px; */
  }
  button {
    @media screen and (max-width: 1700px) {
      top: 90%;
      width: 280px;
      height: 50px;
      font-size: 20px;
    }
    position: absolute;
    top: 90%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 420px;
    height: 80px;
    font-weight: 700;
    font-size: 28px;
    color: #ffffff;
    border: 0;
    border-radius: 12px;
    background-color: #242424;
  }
`;

export default Event;
