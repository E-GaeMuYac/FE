import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { compareBoxData } from '../../recoil/recoilStore';
import LikeItBtn from './LikeItBtn';

const ProductList = ({ list }) => {
  const navigate = useNavigate();
  const [compareBoxArr, setCompareBoxArr] = useRecoilState(compareBoxData);

  const goToDetail = (id) => {
    navigate(`/detail/${id}?tab=효능 효과`);
  };

  const putInToCompareBox = (list) => {
    for (let i = 0; i < compareBoxArr.length; i++) {
      if (compareBoxArr[i].itemName === 'null') {
        let newArr = [...compareBoxArr];
        newArr[i] = list;
        setCompareBoxArr(newArr);
        break;
      }
    }
  };

  return (
    <SearchListWrap key={list.medicineId} image={list.itemImage}>
      <li
        onClick={() => {
          goToDetail(list.medicineId);
        }}>
        <div className='listImg'></div>
        <div className='listName'>{list.itemName}</div>
        <div className='listSubTextWrap'>
          <div className='listSubText' style={{ textAlign: 'right' }}>
            {list.etcOtcCode}
          </div>
          <hr />
          <div className='listSubText'>{list.entpName}</div>
        </div>
        <div className='listTag'>{list.productType}</div>
      </li>
      <div className='btnWrap'>
        <LikeItBtn id={list.medicineId} />
        {list.medicineId === compareBoxArr[0].medicineId ||
        list.medicineId === compareBoxArr[1].medicineId ? (
          <div className='btnInBox'>비교함 담기</div>
        ) : (
          <div
            className='btnInBox Active'
            onClick={() => {
              putInToCompareBox(list);
            }}>
            비교함 담기
          </div>
        )}
      </div>
    </SearchListWrap>
  );
};
export default ProductList;
const SearchListWrap = styled.div`
  position: relative;
  li {
    padding: 30px 34px;
    width: 324px;
    height: 360px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.25);
  }
  .listImg {
    width: 100%;
    height: 110px;
    background-image: ${({ image }) =>
      image ? `url(${image})` : `url('/assets/image/PillDefaultImg.png')`};
    background-size: cover;
    border-radius: 8px;
    background-position: 50% 20%;
    margin-bottom: 24px;
    background-repeat: no-repeat;
  }
  .listSubTextWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    margin-bottom: 14px;
  }
  .listSubTextWrap hr {
    width: 2px;
    height: 18px;
    border: none;
    background-color: #888888;
    margin: 0 8px;
  }
  .listSubText {
    width: 126px;
    font-size: 15px;
    line-height: 22px;
    color: #868686;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .listName {
    font-size: 20px;
    line-height: 29px;
    font-weight: bold;
    margin-bottom: 22px;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .listTag {
    max-width: 256px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 10px;
    border-radius: 5px;
    background-color: #ebf0ff;
    color: #3366ff;
    font-size: 14px;
    font-weight: bold;
    line-height: 15px;
    margin-bottom: 18px;
  }
  .btnWrap {
    position: absolute;
    left: 34px;
    bottom: 30px;
    display: flex;
    align-items: center;
    gap: 14px;
    height: 38px;
  }
  .btnInBox {
    width: 205px;
    height: 100%;
    background-color: #cccccc;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
  }
  .btnInBox.Active {
    background-color: #3366ff;
    cursor: pointer;
  }
`;
