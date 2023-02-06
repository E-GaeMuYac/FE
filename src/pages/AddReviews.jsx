import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { userApi } from '../apis/apiInstance';
import { useRecoilValue } from 'recoil';
import { userInfoState } from '../recoil/recoilStore';

const AddReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [medicineItem, setMedicineItem] = useState({});
  const [content, setContent] = useState('');
  const userInfo = useRecoilValue(userInfoState);

  useEffect(() => {
    getMedicine();
  }, []);

  const getMedicine = async () => {
    try {
      const res = await userApi.get(`/api/products/${id}`);
      setMedicineItem(res.data.product);
    } catch (e) {
      console.log(e);
    }
  };

  const handleInput = (e) => {
    setContent(e.target.value);
  };

  const submitReview = async () => {
    try {
      await userApi.post(`/api/reviews/${id}`, { review: content });
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      <PageTitle>리뷰 작성하기</PageTitle>
      <CardBox>
        <WrapContents>
          <Image imgUrl={medicineItem?.itemImage} />
          <div className='firstWrap'>
            <Name>{medicineItem?.itemName}</Name>
            <Categorize>
              {medicineItem?.productType?.map((list) => {
                return <div key={list}>{list}</div>;
              })}
            </Categorize>
          </div>
          <div className='labelWrap'>
            <TopLabel>{medicineItem?.entpName}</TopLabel>
            <BottomLabel>{medicineItem?.etcOtcCode}</BottomLabel>
          </div>
        </WrapContents>
      </CardBox>
      <ReviewGuide>
        <p>
          {userInfo.nickname}님의 리뷰로 같은 고민을 가진 분들이 도움이 될 수
          있어요.
        </p>
        <span>
          리뷰에 해당 의약품과 무관한 내용이 포함되었거나, 어뷰징으로 판단된
          리뷰는 안내 없이 즉시 삭제 처리됩니다.
        </span>
      </ReviewGuide>
      <ContentBox>
        <ReviewArea
          maxLength={1000}
          onChange={handleInput}
          placeholder='작성팁을 참고해 리뷰를 작성해 주시면 다른 사용자분들에게 더 도움이 될거에요!&#13;&#10;1)  의약품 섭취 전 어떤 증상이 있었나요?&#13;&#10;2)  섭취 후 어떤 개선 효과가 있었나요?&#13;&#10;3)  섭취 후 부작용이 있었나요?&#13;&#10;이 박스를 클릭해 리뷰 작성을 시작해주세요!'></ReviewArea>
        <CountText count={content.length}>
          {content.length}자 / 최소 10글자
        </CountText>
      </ContentBox>
      <SubmitBtnWrap>
        <SubmitBtn
          type='button'
          onClick={submitReview}
          disabled={content.length < 10}>
          리뷰 등록하기
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
  @media screen and (max-width: 1700px) {
    padding: 18px 26px;
  }
  width: 100%;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  padding: 22px 30px;
`;

const WrapContents = styled.div`
  @media screen and (max-width: 1700px) {
    padding: 0;
  }
  width: 100%;
  margin: auto;
  align-items: center;
  display: flex;

  .firstWrap {
    @media screen and (max-width: 1700px) {
      width: 280px;
      margin-right: 15px;
    }
    width: 350px;
    height: 85px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 30px;
  }
  .labelWrap {
    @media screen and (max-width: 1700px) {
      min-width: 265px;
    }
    display: flex;
    width: 300px;
    height: 85px;
    flex-direction: column;
  }
  .boxWrap {
    display: flex;
    position: absolute;
    right: 30px;
  }
`;

const Image = styled.div`
  width: 160px;
  min-width: 150px;
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
    width: 308px;
  }
  width: 350px;
  height: 33px;
  color: black !important;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  line-height: 35px;
`;

const Categorize = styled.div`
  div {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
      padding: 8px 10px;
    }
    padding: 10px 12px;
    background: #ebf0ff;
    color: #3366ff;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    font-weight: 500;
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
    font-size: 16px;
    line-height: 40px;
  }
  height: 34px;
  font-size: 18px;
  font-weight: 400;
  line-height: 42px;
  color: #868686;
  margin-bottom: 10px;
  text-align: left;
`;

const BottomLabel = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 16px;
    line-height: 24px;
  }
  height: 30px;
  font-size: 18px;
  font-weight: 400;
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
    font-weight: 350;
  }

  span {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    font-size: 20px;
    font-weight: 500;
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
  position: relative;
`;

const ReviewArea = styled.textarea`
  @media screen and (max-width: 1700px) {
    font-size: 16px;
    height: 310px;
  }
  width: 100%;
  height: 400px;
  background-color: #f6f7fa;
  border: none;
  outline: none;
  resize: none;
  font-size: 24px;
  font-weight: 350;

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
  right: 50px;
  font-size: 15px;
  font-weight: 600;
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
export default AddReviews;
