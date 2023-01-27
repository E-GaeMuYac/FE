import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosWarning } from 'react-icons/io';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';

const Reviews = () => {
  const navigate = useNavigate();
  const [moreShow, setMoreShow] = useState(true);
  const [like, setLike] = useState(false);

  const { id } = useParams();

  const tagName = [
    '전체보기',
    '만족',
    '부작용',
    '효과',
    '개선',
    '통증',
    '졸음',
    '가려움',
    '어지러움',
    '두통',
    '설사',
    '두드러기',
    '발진',
    '속쓰림',
  ];
  const [pickTag, setpickTag] = useState('전체보기');

  // const mock =
  //   '피부에 도움이 되는 비타민이랑 L시스테인 같이 먹고 있어요. 과일 좋아하지 않는 분들은 비타민 C 꾸준히 챙겨드시면 좋아요. 신맛 느끼지 않고 캡슐에 들어 있어서 먹기 편해요. 개인적으로 작은 용량의 제품을 먹어서 비우는게 더 좋은 거 같아요. 대용량은 약을 덜어내면서 계속 공기와 접촉하니 이렇게 작은용량이 좋은 것 같아요! 비싸고 브랜드 있는 제품과 비교해서 비타민 함량이 고용량이고 피부에 도움이 되는 비타민이랑 L시스테인 같이 먹고 있어요. 과일 좋아하지 않는 분들은 비타민 C 꾸준히 챙겨드시면 좋아요. 신맛 느끼지 않고 캡슐에 들어 있어서 먹기 편해요. 개인적으로 작은 용량의 제품을 먹어서 비우는게 더 좋은 거 같아요. 대용량은 약을 덜어내면서 계속 공기와 접촉하니 이렇게 작은용량이 좋은 것 같아요! 비싸고 브랜드 있는 제품과 비교해서 비타민 함량이 고용량이고피부에 도움이 되는 비타민이랑 L시스테인 같이 먹고 있어요. 과일 좋아하지 않는 분들은 비타민 C 꾸준히 챙겨드시면 좋아요. 신맛 느끼지 않고 캡슐에 들어 있어서 먹기 편해요. 개인적으로 작은 용량의 제품을 먹어서 비우는게 더 좋은 거 같아요. 대용량은 약을 덜어내면서 계속 공기와 접촉하니 이렇게 작은용량이 좋은 것 같아요! 비싸고 브랜드 있는 제품과 비교해서 비타민 함량이 고용량이고피부에 도움이 되는 비타민이랑 L시스테인 같이 먹고 있어요. 과일 좋아하지 않는 분들은 비타민 C 꾸준히 챙겨드시면 좋아요. 신맛 느끼지 않고 캡슐에 들어 있어서 먹기 편해요. 개인적으로 작은 용량의 제품을 먹어서 비우는게 더 좋은 거 같아요. 대용량은 약을 덜어내면서 계속 공기와 접촉하니 이렇게 작은용량이 좋은 것 같아요! 비싸고 브랜드 있는 제품과 비교해서 비타민 함량이 고용량이고';

  const mock = ['만족', '부작용', '효과', '개선', '발진'];

  const pickTagColor = (e) => {
    setpickTag(e.target.innerText);
  };
  return (
    <Wrapper>
      <ReviewBtnWrap>
        <ReviewDesc>
          <p>000님의 리뷰로 같은 고민을 가진 분들이 도움이 될 수 있어요.</p>
          <span>
            리뷰에 해당 의약품과 무관한 내용이 포함되었거나, 어뷰징으로 판단된
            리뷰는 안내 없이 즉시 삭제 처리됩니다.
          </span>
        </ReviewDesc>
        <ReviewpageBtn onClick={() => navigate(`/detail/${id}/reviewform`)}>
          리뷰 쓰기
        </ReviewpageBtn>
      </ReviewBtnWrap>
      <ReviewNav>
        <ReviewHeader>
          <div className='total'>
            <span className='title'>리뷰</span>
            <span className='sum'> 300개</span>
          </div>
        </ReviewHeader>
        <ReviewSorting>
          {tagName.map((tag) => (
            <SortTag
              key={tag}
              tag={tag}
              pickTag={pickTag}
              onClick={pickTagColor}>
              {tag}
            </SortTag>
          ))}
        </ReviewSorting>
      </ReviewNav>
      {mock.map((a) =>
        a.includes(pickTag) ? (
          <Contents key={a}>
            <ReviewInfo>
              <AccountBox>
                <AccountBoxBg>
                  <AccountBoxImg /*imageUrl={imageUrl}*/ />
                </AccountBoxBg>
                <span>닉네임</span>
              </AccountBox>
              <DateWrited>2023년 1월 29일</DateWrited>
            </ReviewInfo>
            <Description>
              {moreShow ? <DescSum>{a}</DescSum> : <DescWhole>{a}</DescWhole>}
              <MoreBtn
                className='more'
                onClick={() => {
                  setMoreShow(!moreShow);
                }}>
                {moreShow ? '리뷰 자세히 보기 ▼' : '접기 ▲'}
              </MoreBtn>
            </Description>
            <Exception>
              <IoIosWarning size='26' color='#FF772B' />
              <span>면책사항:</span>
              <div>의학적 또는 전문가의 조언이 아닌 사용자의 의견입니다.</div>
            </Exception>
            <Recommend>
              <LikeBtn like={like} onClick={() => setLike(!like)}>
                <AiFillLike />
                <div>도움 돼요</div>
              </LikeBtn>
              <UnlikeBtn>
                <AiFillDislike />
                <div>도움 안돼요</div>
              </UnlikeBtn>
            </Recommend>
          </Contents>
        ) : null
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ReviewBtnWrap = styled.div`
  background-color: #f6f7fa;
  width: 100%;
  height: 120px;
  border-radius: 25px;
  padding: 30px 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReviewDesc = styled.div`
  width: 1070px;
  line-height: 20px;
  p {
    font-size: 20px;
  }

  span {
    font-size: 20px;
    font-weight: bold;
  }
`;

const ReviewpageBtn = styled.div`
  width: 130px;
  height: 44px;
  background-color: #242424;
  border-radius: 8px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;
const ReviewNav = styled.div`
  background-color: #f6f7fa;
  width: 100%;
  height: 178px;
  border-radius: 25px;
  padding: 30px 60px;
`;

const ReviewHeader = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  .sum {
    font-size: 24px;
    font-weight: bold;
    color: #3366ff;
  }
`;

const ReviewSorting = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SortTag = styled.span`
  background-color: ${(props) =>
    props.tag === props.pickTag ? '#3366FF' : '#D0D0D0'};
  color: ${(props) => (props.tag === props.pickTag ? 'white' : '#868686;')};
  min-width: 64px;
  height: 46px;
  padding: 0 10px;
  border-radius: 87px;
  box-sizing: border-box;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Contents = styled.div`
  width: 100%;
  border-radius: 23px;
  background-color: #f6f7fa;
  display: flex;
  flex-direction: column;
  padding: 30px 60px;
`;
const ReviewInfo = styled.div`
  width: 100%;
  height: 58px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const AccountBox = styled.div`
  height: 58px;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  span {
    font-size: 20px;
    font-weight: bold;
  }
`;

const AccountBoxBg = styled.div`
  width: 52px;
  height: 52px;
  margin: 10px;
  border-radius: 50%;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AccountBoxImg = styled.div`
  /* background-image: ${({ imageUrl }) => `url(${imageUrl})`}; */
  background-color: pink;
  background-size: cover;
  background-position: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const DateWrited = styled.span`
  display: flex;
  align-items: center;
  color: #868686;
  font-size: 18px;
`;

const Description = styled.div`
  width: 100%;
  padding-top: 20px;
`;

const DescSum = styled.div`
  font-size: 24px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DescWhole = styled.div`
  font-size: 24px;
`;

const MoreBtn = styled.button`
  background-color: #e7e7e7;
  appearance: none;
  margin: 15px 0;
  padding: 5px 10px;
  border-radius: 8px;
  border: none;
  color: #3366ff;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
`;

const Exception = styled.div`
  width: 100%;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  padding: 10px 0;
  span {
    color: #ff772b;
  }
  div {
    color: #868686;
    text-indent: 5px;
  }
`;

const Recommend = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LikeBtn = styled.button`
  width: 127px;
  height: 36px;
  border-radius: 87px;
  border: none;
  background-color: ${({ like }) => (like ? '#3366FF' : '#e7e7e7')};
  color: ${({ like }) => (like ? '#ffffff' : '#868686')};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  div {
    text-indent: 5px;
  }
`;

const UnlikeBtn = styled.button`
  width: 127px;
  height: 36px;
  border-radius: 87px;
  border: none;
  background-color: #e7e7e7;
  color: #868686;
  display: flex;
  /* flex-direction: row; */
  justify-content: center;
  align-items: center;
  div {
    text-indent: 5px;
  }
`;
export default Reviews;
