import React from 'react';
import styled from 'styled-components';
import LikeItBtn from '../components/common/LikeItBtn';

const AddReviews = () => {
  return (
    <Wrapper>
      <PageTitle>리뷰 작성하기</PageTitle>
      <CardBox>
        <WrapContents>
          <Image /*imgUrl={medicineItem?.itemImage}*/ />
          <div style={{ marginRight: '20px' }}>
            <Name>{/*medicineItem?.itemName*/}</Name>
            <Categorize>
              {/* {medicineItem?.productType?.map((list) => {
                return <div key={list}>{list}</div>;
              })} */}
            </Categorize>
          </div>
          <div className='labelWrap'>
            <TopLabel>{/*medicineItem?.entpName*/}</TopLabel>
            <BottomLabel>
              {/*medicineItem?.etcOtcCode*/}
              <div className='etcOtcCodeDesc'>
                {/* {medicineItem?.etcOtcCode === '전문의약품' ? ( */}
                <span className='tooltipText'>
                  의사 또는 치과의사의 지시와 감독에 따라 사용되어야 하는
                  의약품으로, 의사의 처방전에 의해서만 구입하여 사용할 수 있다.
                </span>
                {/* ) : ( */}
                <span className='tooltipText'>
                  처방전 없이 약국에서 구입할 수 있는 의약품으로, 포장 용기에
                  기재된 설명대로 올바르게 복용한다면 비교적 안전하게 사용할 수
                  있다.
                </span>
                {/* )} */}
              </div>
            </BottomLabel>
          </div>
          <div className='boxWrap'>
            <Picked>
              <LikeItBtn
              // id={medicineItem?.medicineId}
              // dibs={medicineItem?.dibs}
              />
            </Picked>
            {/* {medicineItem?.medicineId === compareBoxArr[0].medicineId ||
            medicineItem?.medicineId === compareBoxArr[1].medicineId ? ( */}
            <div className='compareBox'>비교함 담기</div>
            {/* ) : ( */}
            <button
              className='compareBox active'
              /*onClick={() => {
                  putInToCompareBox(objGraph);
                }}*/
            >
              비교함 담기
            </button>
            {/* )} */}
          </div>
        </WrapContents>
      </CardBox>
      <ReviewGuide>
        <p>000님의 리뷰로 같은 고민을 가진 분들이 도움이 될 수 있어요.</p>
        <span>
          리뷰에 해당 의약품과 무관한 내용이 포함되었거나, 어뷰징으로 판단된
          리뷰는 안내 없이 즉시 삭제 처리됩니다.
        </span>
      </ReviewGuide>
      <ReviewArea
        placeholder='작성팁을 참고해 리뷰를 작성해 주시면 다른 사용자분들에게 더 도움이 될거에요!&#13;&#10;1)  의약품 섭취 전 어떤 증상이 있었나요?&#13;&#10;2)  섭취 후 어떤 개선 효과가 있었나요?&#13;&#10;3)  섭취 후 부작용이 있었나요?&#13;&#10;이 박스를 클릭해 리뷰 작성을 시작해주세요!'></ReviewArea>
      <SubmitBtnWrap>
        <SubmitBtn>리뷰 등록하기</SubmitBtn>
      </SubmitBtnWrap>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  gap: 20px;
`;

const PageTitle = styled.h3`
  font-weight: bold;
`;

const CardBox = styled.div`
  width: 100%;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`;

const WrapContents = styled.div`
  padding: 21px 30px;
  margin: auto;
  align-items: center;
  display: flex;
  position: relative;
  .labelWrap {
    justify-content: center;
    text-align: left;
  }
  .boxWrap {
    display: flex;
    position: absolute;
    right: 30px;
  }
  .etcOtcCodeDesc {
    width: 20px;
    height: 20px;
    background-image: url('/assets/image/의약품목설명아이콘.png');
    background-size: cover;
    background-position: center;
    margin-left: 5px;
    display: inline-block;
    :hover .tooltipText {
      display: block;
    }
    .tooltipText {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.54);
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
      display: none;
      position: absolute;
      max-width: 310px;
      padding: 13px;
      font-size: 15px;
      line-height: 21px;
      color: #ffffff;
      opacity: 1;
      z-index: 2;
      font-weight: 400;
      font-size: 14px;
    }
  }
  .compareBox {
    width: 276px;
    height: 50px;
    background-color: #cccccc;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }
  .compareBox.active {
    background-color: #3366ff;
    cursor: pointer;
    border: 0;
    :active {
      background-color: #1a50f3;
    }
  }
`;

const Image = styled.div`
  width: 160px;
  height: 85px;
  border-radius: 8px;
  background-image: ${({ imgUrl }) =>
    imgUrl ? `url(${imgUrl})` : `url('/assets/image/default_img.png')`};
  background-size: cover;
  background-position: 50% -50%;
  margin-right: 30px;
`;

const Name = styled.div`
  min-width: 360px;
  max-width: 380px;
  margin: auto;
  font-size: 24px;
  font-weight: 700;
  line-height: 35px;
  justify-content: center;
`;

const Categorize = styled.div`
  div {
    padding: 0 5px;
    min-width: 69px;
    height: 35px;
    background: #ebf0ff;
    color: #3366ff;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    line-height: 20px;
    border-radius: 8px;
    display: flex;
  }
  display: flex;
  margin-top: 10px;
  gap: 8px;
`;

const TopLabel = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  margin-bottom: 10px;
  text-align: left;
`;

const BottomLabel = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  display: flex;
  align-items: center;
  margin-top: 10px;
  text-align: left;
`;

const Picked = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  div {
    width: 48px;
    height: 48px;
    .btnLikeImg {
      width: 28.5px;
      height: 25.33px;
    }
  }
`;

const ReviewGuide = styled.div`
  width: 100%;
  height: 120px;
  padding: 30px 60px;
  border-radius: 25px;
  background-color: #f6f7fa;
  line-height: 20px;
  p {
    font-size: 20px;
  }

  span {
    font-size: 20px;
    font-weight: bold;
    color: #ff392b;
  }
`;

const ReviewArea = styled.textarea`
  width: 100%;
  height: 480px;
  padding: 50px 60px;
  background-color: #f6f7fa;
  padding: 30px 60px;
  border-radius: 25px;
  border: 2px solid #e7e7e7;
  outline: none;
  resize: none;

  ::placeholder {
    font-size: 24px;
  }
`;

const SubmitBtnWrap = styled.div`
  width: 100%;
  height: 58px;
  display: flex;
  justify-content: center;
`;

const SubmitBtn = styled.div`
  width: 326px;
  height: 58px;
  background-color: #3366ff;
  color: white;
  border-radius: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default AddReviews;
