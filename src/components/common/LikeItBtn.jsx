import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { usePutLikeMutation } from '../../query/likeQuery';
import { useSetRecoilState } from 'recoil';
import { alertModalState } from '../../recoil/recoilStore';

const LikeItBtn = ({ id, dibs }) => {
  const [heartActive, setHeartBtn] = useState(false);

  const setAboutAlert = useSetRecoilState(alertModalState);

  const LikeMutate = usePutLikeMutation(id);

  //찜하기 실행 함수
  const likeIt = async (id) => {
    if (localStorage.getItem('refreshToken')) {
      LikeMutate.mutate(id);
      setHeartBtn(!heartActive);
    } else {
      setAboutAlert({
        msg: '로그인 후 이용 가능합니다.',
        btn: '확인하기',
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    setHeartBtn(dibs);
  }, [dibs]);

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
  @media screen and (max-width: 1700px) {
    width: 34px;
    height: 34px;
  }
  width: 38px;
  height: 38px;
  border-radius: 8px;
  box-shadow: 0px 1px 6px 0px rgba(10, 32, 98, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  .btnLikeImg {
    @media screen and (max-width: 1700px) {
      width: 20px;
      height: 20px;
    }
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
