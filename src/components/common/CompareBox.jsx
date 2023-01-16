import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilState } from 'recoil';

import styled from 'styled-components';
import { compareBoxData } from '../../recoil/recoilStore';

const ListCardComp = ({ arrState, list }) => {
  const navigate = useNavigate();
  const [isArr, setIsArr] = arrState;

  const [isFill, setIsFill] = useState(false);

  useEffect(() => {
    if (list.itemName !== 'null') {
      setIsFill(true);
    } else {
      setIsFill(false);
    }
  }, [isArr]);

  //상품 삭제
  const deleteList = (id) => {
    let deletedArr = isArr.map((list) =>
      list.medicineId === id
        ? { medicineId: isArr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setIsArr(deletedArr);
  };

  //서치페이지로 이동
  const goToSearch = () => {
    //페이지 이동
    navigate('/search');
  };

  return (
    <>
      {isFill ? (
        <ListCard isFill={isFill} image={list.itemImage}>
          <div className='cardImg'></div>
          <div className='cardContent'>
            <div className='listName'>{list.itemName}</div>
            <div className='listSubContent'>{list.entpName}</div>
            <div className='listSubContent'>{list.etcOtcCode}</div>
          </div>
          <div
            className='cardDeleteImg'
            onClick={() => {
              deleteList(list.medicineId);
            }}></div>
        </ListCard>
      ) : (
        <ListCard
          isFill={isFill}
          onClick={() => {
            goToSearch();
          }}>
          <div className='addListImg'></div>
          <div className='addComment'>비교하고 싶은 약품을 담아주세요</div>
        </ListCard>
      )}
    </>
  );
};

const CompareBox = () => {
  const navigate = useNavigate();
  // 토글 여부 state
  const [isOpen, setIsOpen] = useState(false);

  // compareBox 배열
  const [isArr, setIsArr] = useRecoilState(compareBoxData);
  // compareBox null 갯수
  const [isArrLength, setIsArrLength] = useState(0);

  //itemNAme이 null이 아닌 것을 세어 length 표현
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < isArr.length; i++) {
      if (isArr[i].itemName !== 'null') {
        count++;
      }
    }
    setIsArrLength(count);
  }, [isArr]);

  // onclick시 토글
  const boxToggle = () => {
    setIsOpen(!isOpen);
  };

  // 비교하기 페이지로 이동
  const goToCompare = () => {
    if (isOpen && isArrLength === 2) {
      navigate('/compare?tab=성분그래프');

      //이동 후 state 초기화
      setIsOpen(false);
    }
  };

  // 배열 초기화 버튼
  const listReset = () => {
    const allDeletedArr = isArr.map((list) =>
      list.itemName !== 'null'
        ? { medicineId: isArr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setIsArr(allDeletedArr);
  };

  return (
    <Wrap isOpen={isOpen}>
      <div className='wrap'>
        <BoxTop isOpen={isOpen} isArrLength={isArrLength}>
          <div className='boxCommentWrap'>
            <div className='boxComment'>약품 비교함에 담기</div>
            <div className='boxNum'>{isArrLength}/2</div>
          </div>
          <div className='boxButtonWrap'>
            <div className='boxButtonReset' onClick={listReset}>
              <div className='boxButtonResetImg'></div>초기화
            </div>
            <button className='goToCompareBtn' onClick={goToCompare}>
              비교하기
            </button>
          </div>
        </BoxTop>
        <BoxContent>
          {isArr.map((list) => (
            <ListCardComp
              key={list.medicineId}
              list={list}
              arrState={[isArr, setIsArr]}
            />
          ))}
        </BoxContent>
        <div className='toggleBtnWrap' onClick={boxToggle}>
          <div className='toggleBtnImg'></div>
        </div>
      </div>
    </Wrap>
  );
};

const Wrap = styled.div`
  position: fixed;
  left: 0;
  bottom: ${({ isOpen }) => (isOpen ? 0 : '-240px')};
  transition: bottom 0.3s;
  width: 100%;
  background-color: white;
  box-shadow: 0 0 24px 1px rgba(0, 0, 0, 0.2);
  .wrap {
    margin: 0 auto;
    max-width: 1050px;
    width: 100%;
    height: 100%;
    position: relative;
  }
  .boxComment {
    margin-right: 14px;
  }
  .toggleBtnWrap {
    position: absolute;
    left: 50%;
    top: -20px;
    transform: translateX(-50%);
    width: 68px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 -10px 30px 1px rgba(0, 0, 0, 0.094);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .toggleBtnImg {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/arrow_up.png');
    ${({ isOpen }) =>
      isOpen ? `transform: rotate(180deg);` : `transform: rotate(0deg);`};
    background-size: cover;
    background-position: center;
    transition: transform 0.3s;
  }
`;
const BoxTop = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .boxCommentWrap {
    font-size: 20px;
    line-height: 28px;
    font-weight: bold;
    display: flex;
  }
  .boxButtonWrap {
    display: flex;
    align-items: center;
  }
  .boxButtonReset {
    color: #f43f3f;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 14px;
  }
  .boxButtonResetImg {
    width: 24px;
    height: 24px;
    background-image: url('/assets/image/icon_reset.png');
  }
  .goToCompareBtn {
    width: 170px;
    height: 40px;
    background-color: ${({ isOpen, isArrLength }) =>
      isOpen && isArrLength === 2 ? '#242424' : '#B7B7B7'};
    border-radius: 38px;
    border: none;
    color: white;
    cursor: ${({ isOpen, isArrLength }) =>
      isOpen && isArrLength === 2 ? 'pointer' : 'auto'};
    font-weight: bold;
  }
`;
const BoxContent = styled.div`
  height: 240px;
  width: 100%;
  display: flex;
  gap: 50px;
`;
const ListCard = styled.div`
  position: relative;
  width: 90%;
  height: 186px;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  padding: 48px 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ isFill }) =>
    isFill
      ? null
      : `background-color: #E7E7E7; justify-content: center; flex-direction: column;`}
  .cardImg {
    width: 160px;
    height: 100%;
    background-image: ${({ image }) =>
      image ? `url(${image})` : `url('/assets/image/PillDefaultImg.png')`};
    background-size: contain;
    background-position: center;
    margin-right: 24px;
  }
  .listName {
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 18px;
  }
  .listSubContent {
    font-size: 14px;
    line-height: 24px;
    font-weight: bold;
    color: #868686;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cardDeleteImg {
    width: 32px;
    height: 32px;
    position: absolute;
    right: 10px;
    top: 10px;
    background-image: url('/assets/image/icon_delete.png');
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  .cardNothing {
    width: 100%;
    height: 100%;
  }
  .addListImg {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/icon_add1.png');
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
  }
  .addComment {
    font-size: 18px;
    line-height: 26px;
    color: #242424;
    font-weight: bold;
  }
`;

export default CompareBox;
