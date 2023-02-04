import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilState, useRecoilValue } from 'recoil';

import styled from 'styled-components';
import { compareBoxData, nowRoute } from '../../recoil/recoilStore';

const ListCardComp = ({ list }) => {
  const navigate = useNavigate();
  const [compareData, setCompareData] = useRecoilState(compareBoxData);

  const [isFill, setIsFill] = useState(false);

  useEffect(() => {
    if (list.itemName !== 'null') {
      setIsFill(true);
    } else {
      setIsFill(false);
    }
  }, [compareData.arr]);

  //상품 삭제
  const deleteList = (id) => {
    let deletedArr = compareData.arr.map((list) =>
      list.medicineId === id
        ? { medicineId: compareData.arr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setCompareData({ ...compareData, arr: deletedArr });
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
            <ul className='listSubTag'>
              {list.productType.map((list) => (
                <li>{list}</li>
              ))}
            </ul>
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

  // compareBox 배열
  const [compareData, setCompareData] = useRecoilState(compareBoxData);

  const nowPage = useRecoilValue(nowRoute);

  //itemNAme이 null이 아닌 것을 세어 length 표현
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < compareData.arr.length; i++) {
      if (compareData.arr[i].itemName !== 'null') {
        count++;
      }
    }
    setCompareData({ ...compareData, length: count });
  }, [compareData.arr]);

  //페이지를 이동하면 자동으로 클로즈
  useEffect(() => {
    setCompareData({ ...compareData, isOpen: 'close' });
  }, [nowPage]);

  // onclick시 기능
  const boxToggle = () => {
    switch (compareData.isOpen) {
      case 'close':
        setCompareData({ ...compareData, isOpen: 'open' });
        break;
      case 'open':
        setCompareData({ ...compareData, isOpen: 'close' });
        break;
      case 'hide':
        setCompareData({ ...compareData, isOpen: 'close' });
        break;
    }
  };
  //onclick시 버튼 삭제
  const closeBox = () => {
    setCompareData({ ...compareData, isOpen: 'hide' });
  };

  // 비교하기 페이지로 이동
  const goToCompare = () => {
    if (compareData.length === 2) {
      navigate('/compare?tab=성분그래프');
    }
  };

  // 배열 초기화 버튼
  const listReset = () => {
    const allDeletedArr = compareData.arr.map((list) =>
      list.itemName !== 'null'
        ? { medicineId: compareData.arr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setCompareData({ ...compareData, arr: allDeletedArr, isOpen: 'close' });
  };

  return (
    <Wrap isOpen={compareData.isOpen}>
      <div className='wrap'>
        <div className='backLayout'></div>
        <div className='layout'>
          <BoxTop isOpen={compareData.isOpen} isArrLength={compareData.length}>
            <div className='boxCommentWrap'>
              <div className='boxComment'>약품 비교함에 담기</div>
              <div className='boxNum'>{compareData.length}/2</div>
            </div>
            <div className='boxButtonWrap'>
              <div className='boxButtonReset' onClick={listReset}>
                <div className='boxButtonResetImg'></div>초기화
              </div>
              <button className='goToCompareBtn' onClick={goToCompare}>
                비교하기
              </button>
            </div>
            <div className='deleteBoxBtn' onClick={closeBox}></div>
          </BoxTop>
          <BoxContent>
            {compareData.arr.map((list) => (
              <ListCardComp key={list.medicineId} list={list} />
            ))}
          </BoxContent>
        </div>
        <div className='toggleBtnBehind'></div>
        <div className='toggleBtnWrap' onClick={boxToggle}>
          <div className='toggleBtnImg'></div>
        </div>
      </div>
    </Wrap>
  );
};

const Wrap = styled.div`
  @media screen and (max-width: 1700px) {
    bottom: ${({ isOpen }) => {
      switch (isOpen) {
        case 'open':
          return 0;
        case 'close':
          return '-222px';
        case 'hide':
          return '-288px';
      }
    }};
  }
  position: fixed;
  left: 0;
  bottom: ${({ isOpen }) => {
    switch (isOpen) {
      case 'open':
        return 0;
      case 'close':
        return '-222px';
      case 'hide':
        return '-322px';
    }
  }};
  transition: bottom 0.3s;
  width: 100%;
  z-index: 1000;
  background-color: white;
  .wrap {
    position: relative;
  }
  .layout {
    margin: 0 auto;
    max-width: 1050px;
    height: 100%;
    @media screen and (max-width: 1700px) {
      max-width: 800px;
    }
  }
  .backLayout {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 24px 1px rgba(0, 0, 0, 0.2);
    z-index: 2;
    background-color: white;
  }
  .boxComment {
    margin-right: 14px;
  }
  .toggleBtnBehind {
    position: absolute;
    left: 50%;
    top: -35px;
    transform: translateX(-50%);
    width: 72px;
    height: 55px;
    background-color: #ffffff;
    box-shadow: 0px 0px 30px 1px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }
  .toggleBtnWrap {
    position: absolute;
    left: 50%;
    top: -35px;
    transform: translateX(-50%);
    width: 72px;
    height: 55px;
    background-color: #ffffff;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }
  .toggleBtnImg {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/arrow_up.png');
    ${({ isOpen }) =>
      isOpen === 'open'
        ? `transform: rotate(180deg);`
        : `transform: rotate(0deg);`};
    background-size: cover;
    background-position: center;
    transition: transform 0.3s;
    margin-bottom: 10px;
  }
`;
const BoxTop = styled.div`
  @media screen and (max-width: 1700px) {
    width: 800px;
    height: 66px;
  }
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  position: relative;
  .boxCommentWrap {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
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
    @media screen and (max-width: 1700px) {
      font-size: 13px;
    }
    color: #f43f3f;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 14px;
  }
  .boxButtonResetImg {
    @media screen and (max-width: 1700px) {
      width: 20px;
      height: 20px;
    }
    width: 24px;
    height: 24px;
    background-image: url('/assets/image/icon_reset.png');
    background-size: cover;
  }
  .goToCompareBtn {
    @media screen and (max-width: 1700px) {
      font-size: 15px;
      width: 136px;
      height: 38px;
    }
    width: 170px;
    height: 40px;
    background-color: ${({ isArrLength }) =>
      isArrLength === 2 ? '#242424' : '#B7B7B7'};
    border-radius: 38px;
    border: none;
    color: white;
    cursor: ${({ isArrLength }) => (isArrLength === 2 ? 'pointer' : 'auto')};
    font-weight: bold;
  }
  .deleteBoxBtn {
    @media screen and (max-width: 1700px) {
      width: 26px;
      height: 26px;
    }
    width: 40px;
    height: 40px;
    background-image: url('/assets/image/icon_delete2.png');
    background-size: cover;
    background-position: center;
    position: absolute;
    right: -100px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }
`;
const BoxContent = styled.div`
  @media screen and (max-width: 1700px) {
    width: 800px;
    padding-top: 15px;
  }
  height: 222px;
  width: 100%;
  display: flex;
  gap: 50px;
  position: relative;
  z-index: 2;
  @media screen and (max-width: 1700px) {
    gap: 4%;
  }
`;
const ListCard = styled.div`
  @media screen and (max-width: 1700px) {
    width: 48%;
    height: 170px;
  }
  position: relative;
  width: 90%;
  height: 186px;
  border-radius: 20px;
  padding: 48px 24px;
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ isFill }) =>
    isFill
      ? `
      background-color: #ffffff;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
    `
      : `background-color: #E7E7E7;
      justify-content: center;
      flex-direction: column;`}
  .cardImg {
    @media screen and (max-width: 1700px) {
      min-width: 150px;
    }
    width: 160px;
    height: 86px;
    background-image: ${({ image }) =>
      image ? `url(${image})` : `url('/assets/image/PillDefaultImg.png')`};
    background-size: 110%;
    background-position: 50% 0%;
    margin-right: 24px;
    border-radius: 8px;
  }
  .listName {
    @media screen and (max-width: 1700px) {
      width: 65%;
    }
    font-size: 18px;
    line-height: 26px;
    font-weight: bold;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 12px;
  }
  .listSubTag {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
  }
  .listSubTag li {
    padding: 3.5px 6px;
    background-color: #ebf0ff;
    border-radius: 5px;
    color: #3366ff;
    font-weight: 500;
    font-size: 13px;
  }
  .listSubContent {
    font-size: 14px;
    line-height: 24px;
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
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    font-size: 18px;
    line-height: 26px;
    color: #868686;
    font-weight: bold;
  }
`;

export default CompareBox;
