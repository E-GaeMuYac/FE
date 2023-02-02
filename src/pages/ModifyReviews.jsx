import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { userApi } from '../apis/apiInstance';

const ModifyReviews = () => {
  const navigate = useNavigate();
  const { medicineId, reviewId } = useParams();
  const [medicineItem, setMedicineItem] = useState({});
  const [content, setContent] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    getMedicine();
    getReviews();
    getProfile();
  }, []);

  const getCurrentContent = (reviewList) => {
    const review = reviewList.find((obj) => {
      return obj.reviewId === parseInt(reviewId);
    });
    setContent(review.review);
  };

  const getProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setNickname(res.data.user.nickname);
    } catch (e) {
      console.log(e);
    }
  };

  const getMedicine = async () => {
    try {
      const res = await userApi.get(`/api/products/${medicineId}`);
      setMedicineItem(res.data.product);
    } catch (e) {
      console.log(e);
    }
  };

  const getReviews = async () => {
    try {
      const res = await userApi.get(`/api/reviews?medicineId=${medicineId}`);
      const reviewList = await res.data.reviewList;
      getCurrentContent(reviewList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const submitmodify = async () => {
    try {
      const res = await userApi.put(`/api/reviews/${reviewId}`, {
        review: content,
      });
      alert(res.data.message);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <PageTitle>리뷰 수정하기</PageTitle>
      <CardBox>
        <WrapContents>
          <Image imgUrl={medicineItem?.itemImage} />
          <div style={{ marginRight: '20px' }}>
            <Name>{medicineItem?.itemName}</Name>
            <Categorize>
              {medicineItem?.productType?.map((list) => {
                return <div key={list}>{list}</div>;
              })}
            </Categorize>
          </div>
          <div className='labelWrap'>
            <TopLabel>{medicineItem?.entpName}</TopLabel>
            <BottomLabel>
              {medicineItem?.etcOtcCode}
              <div className='etcOtcCodeDesc'>
                {medicineItem?.etcOtcCode === '전문의약품' ? (
                  <span className='tooltipText'>
                    의사 또는 치과의사의 지시와 감독에 따라 사용되어야 하는
                    의약품으로, 의사의 처방전에 의해서만 구입하여 사용할 수
                    있습니다.
                  </span>
                ) : (
                  <span className='tooltipText'>
                    처방전 없이 약국에서 구입할 수 있는 의약품으로, 포장 용기에
                    기재된 설명대로 올바르게 복용한다면 비교적 안전하게 사용할
                    수 있습니다.
                  </span>
                )}
              </div>
            </BottomLabel>
          </div>
        </WrapContents>
      </CardBox>
      <ReviewGuide>
        <p>
          {nickname}님의 리뷰로 같은 고민을 가진 분들이 도움이 될 수 있어요.
        </p>
        <span>
          리뷰에 해당 의약품과 무관한 내용이 포함되었거나, 어뷰징으로 판단된
          리뷰는 안내 없이 즉시 삭제 처리됩니다.
        </span>
      </ReviewGuide>
      <ContentBox>
        <ReviewArea
          maxLength={1000}
          value={content}
          onChange={handleInput}
          placeholder='작성팁을 참고해 리뷰를 작성해 주시면 다른 사용자분들에게 더 도움이 될거에요!&#13;&#10;1)  의약품 섭취 전 어떤 증상이 있었나요?&#13;&#10;2)  섭취 후 어떤 개선 효과가 있었나요?&#13;&#10;3)  섭취 후 부작용이 있었나요?&#13;&#10;이 박스를 클릭해 리뷰 작성을 시작해주세요!'></ReviewArea>
        <CountText count={content.length}>
          {content.length}자 / 최소 10글자
        </CountText>
      </ContentBox>
      <SubmitBtnWrap>
        <SubmitBtn
          type='button'
          onClick={submitmodify}
          disabled={content.length < 10}>
          리뷰 수정하기
        </SubmitBtn>
      </SubmitBtnWrap>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  @media screen and (max-width: 1700px) {
    min-width: 1024px;
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  gap: 20px;
`;

const PageTitle = styled.h3`
  @media screen and (max-width: 1700px) {
    font-size: 26px;
  }
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
    @media screen and (max-width: 1700px) {
      width: 18px;
      height: 18px;
    }
    width: 20px;
    height: 20px;
    position: relative;
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
      background-color: rgba(0, 0, 0, 0.8);
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
      display: none;
      position: absolute;
      top: 30px;
      left: -30px;
      width: 310px;
      padding: 13px;
      font-size: 15px;
      line-height: 21px;
      color: #ffffff;
      opacity: 1;
      z-index: 2;
      font-weight: 400;
      font-size: 14px;
    }
    .tooltipText::after {
      content: '';
      width: 0px;
      height: 0px;
      border-bottom: 10px solid rgba(0, 0, 0, 0.8);
      border-top: 10px solid transparent;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      position: absolute;
      left: 36.5px;
      top: -20px;
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
  @media screen and (max-width: 1700px) {
    font-size: 20px;
    min-width: 220px;
    max-width: 250px;
  }
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
    @media screen and (max-width: 1700px) {
      font-size: 14px;
      min-width: 54px;
      height: 30px;
      padding: 0 5px;
    }
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
  @media screen and (max-width: 1700px) {
    font-size: 15px;
    line-height: 22px;
  }
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  margin-bottom: 10px;
  text-align: left;
`;

const BottomLabel = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 15px;
    line-height: 22px;
  }
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

const ReviewGuide = styled.div`
  @media screen and (max-width: 1700px) {
    line-height: 14px;
    padding: 20px 30px;
    height: 87px;
  }
  width: 100%;
  height: 120px;
  padding: 30px 60px;
  border-radius: 25px;
  background-color: #f6f7fa;
  line-height: 20px;
  p {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    font-size: 20px;
  }

  span {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    font-size: 20px;
    font-weight: bold;
    color: #ff392b;
  }
`;

const ContentBox = styled.div`
  @media screen and (max-width: 1700px) {
    padding: 30px 30px;
    height: 400px;
  }
  @media screen and (min-width: 1701px) {
    align-items: center;
  }
  background-color: #f6f7fa;
  border-radius: 25px;
  border: 2px solid #e7e7e7;
  width: 100%;
  height: 480px;
  padding: 0px 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: relative;
`;

const ReviewArea = styled.textarea`
  @media screen and (max-width: 1700px) {
    font-size: 16px;
    height: 310px;
  }
  width: 100%;
  height: 360px;
  background-color: #f6f7fa;
  border: none;
  outline: none;
  resize: none;
  font-size: 24px;

  ::placeholder {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
      white-space: pre-wrap;
    }
    font-size: 24px;
  }

  ::-webkit-scrollbar {
    width: 12px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background-color: #e7e7e7;
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #b7b7b7;
    border-radius: 5px;
  }
`;

const CountText = styled.span`
  position: absolute;
  bottom: 20px;
  right: 60px;
  font-size: 15px;
  font-weight: bold;
  color: ${(props) =>
    props.count !== 1000 && props.count >= 10 ? '#242424' : '#FF392B'};
`;

const SubmitBtnWrap = styled.div`
  width: 100%;
  height: 58px;
  display: flex;
  justify-content: center;
`;

const SubmitBtn = styled.button`
  @media screen and (max-width: 1700px) {
    width: 280px;
    height: 50px;
    font-size: 18px;
  }
  width: 326px;
  height: 58px;
  background-color: ${(props) => (props.disabled ? '#c2d1ff' : '#3366FF')};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default ModifyReviews;
