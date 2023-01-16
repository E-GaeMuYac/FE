import { useState } from 'react';
import styled from 'styled-components';
import { userApi } from '../../apis/apiInstance';

const LikeItBtn = ({ id }) => {
  const [heartActive, setHeartBtn] = useState(false);

  //찜하기 실행 함수
  const likeIt = async (id) => {
    const data = await userApi.put(
      `${process.env.REACT_APP_API_ENDPOINT}/api/products/${id}/dibs`
    );
    console.log(data);

    if (heartActive) {
      console.log(`don't like this ${id}`);
    } else {
      console.log(`like this ${id}`);
    }

    setHeartBtn(!heartActive);
  };

  return (
    <LikeItBtnWrap
      onClick={() => {
        likeIt(id);
      }}
      heartActive={heartActive}>
      <div className='btnLikeImg'></div>
    </LikeItBtnWrap>
  );
};

export default LikeItBtn;

const LikeItBtnWrap = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 8px;
  box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  .btnLikeImg {
    width: 26px;
    height: 26px;
    background-image: ${({ heartActive }) =>
      heartActive
        ? `url('/assets/image/icon_heart2.png')`
        : `url('/assets/image/icon_heart1.png')`};
    background-size: cover;
    background-position: center;
  }
`;
