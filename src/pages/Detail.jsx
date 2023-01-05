import React from 'react';
import styled from 'styled-components';
import defaultImg from '../assets/img/pill_image.png';

const Detail = () => {
  return (
    <Wrap>
      <TopSection>
        <LeftInfo>
          <img src={defaultImg} alt='' />
        </LeftInfo>
      </TopSection>
      {/* <Inner></Inner> */}
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 1380px;
  margin: auto;

  background-color: aliceblue;
`;

const TopSection = styled.div`
  width: 100%;
  /* height: 0; */
  margin: auto;
  border-bottom: 2px solid #d9d9d9;
  margin-top: 80px;
  /* padding-top: 50%; */
  /* background-color: #3d79ad; */
`;

const LeftInfo = styled.div`
  width: 400px;
  height: 465px;
  margin: auto;
  border-bottom: 2px solid #d9d9d9;
  margin-top: 80px;
  /* padding-top: 50%; */
  background-color: #3dad3d;
`;

// const Inner = styled.div`
//   width: 100%;
//   height: 0;
//   margin: auto;
//   padding-top: 50%;
//   /* background-color: #3d79ad; */
// `;

export default Detail;
