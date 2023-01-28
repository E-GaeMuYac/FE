import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosWarning } from 'react-icons/io';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useEffect } from 'react';
import { userApi } from '../apis/apiInstance';

const Pagenation = ({ nowPageNum, setNowPageNum, searchLength }) => {
  const [numArr, setNumArr] = useState([]);
  const [numArrPage, setNumArrPage] = useState([]);
  const [pageNum, setPageNum] = useState(0);

  //서치 갯수에 따라 numArr 배열 생성
  useEffect(() => {
    let newArr = [];
    let count = 1;
    newArr.push(count);
    for (let i = 0; i < searchLength; i++) {
      if ((i + 1) % 5 === 0) {
        count += 1;
        newArr.push(count);
      }
    }
    setNumArr(newArr);
  }, [searchLength]);

  // 페이지 넘버 변경. 스크롤 업 이벤트 생성
  const pageNumChange = (num) => {
    setNowPageNum(num);
  };

  //numArr의 길이에 따라 배열 쪼개기
  useEffect(() => {
    if (numArr) {
      let newPage = [];

      for (let i = 0; i < numArr.length; i += 10) {
        let pageProp = numArr.slice(i, i + 10);

        newPage.push(pageProp);
      }
      setNumArrPage(newPage);
    }
  }, [numArr]);

  //다음 배열 페이지
  const nextNumPage = () => {
    setPageNum(pageNum + 1);
  };

  //이전 배열 페이지
  const beforeNumPage = () => {
    setPageNum(pageNum - 1);
  };

  return (
    <PagenationWrap nowPageNum={nowPageNum}>
      {numArr.length > 10 ? (
        <>
          {pageNum > 0 ? (
            <div className='pagenationArrow left' onClick={beforeNumPage}></div>
          ) : null}
          {pageNum < numArrPage.length - 1 ? (
            <div className='pagenationArrow right' onClick={nextNumPage}></div>
          ) : null}
        </>
      ) : null}

      <ul className='pagenationNumWrap'>
        {numArrPage[pageNum]
          ? numArrPage[pageNum].map((list) =>
              list === nowPageNum ? (
                <li
                  className='Active'
                  key={list}
                  onClick={() => {
                    pageNumChange(list);
                  }}>
                  {list}
                </li>
              ) : (
                <li
                  onClick={() => {
                    pageNumChange(list);
                  }}
                  key={list}>
                  {list}
                </li>
              )
            )
          : null}
      </ul>
    </PagenationWrap>
  );
};

const MyReviews = ({ imageUrl, nickname, userId }) => {
  const [moreShow, setMoreShow] = useState(0);
  const [like, setLike] = useState(false);
  const [myReviewArr, setMyReviewArr] = useState([]);
  const [searchLength, setSearchLength] = useState(0);

  //현재페이지
  const [nowPageNum, setNowPageNum] = useState(1);

  useEffect(() => {
    getMyReviews();
  }, [nowPageNum]);

  const getMyReviews = async () => {
    try {
      const res = await userApi.get(
        `/api/reviews/myreview?userId=${userId}&page=${nowPageNum}&pageSize=5`
      );
      setMyReviewArr(res.data.reviewList);
      setSearchLength(res.data.totalReview);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      {myReviewArr.map((review) => (
        <Contents key={review.reviewId}>
          <ReviewInfo>
            <AccountBox>
              <AccountBoxBg>
                <AccountBoxImg imageUrl={imageUrl} />
              </AccountBoxBg>
              <span>{nickname}</span>
            </AccountBox>
            <DateWrited>
              {review.updatedAt
                .padEnd(11, '-')
                .replace('-', '년 ')
                .replace('-', '월 ')
                .replace('-', '일')}
            </DateWrited>
          </ReviewInfo>
          <Description>
            {moreShow === review.reviewId ? (
              <>
                <DescWhole>{review.review}</DescWhole>
                <FoldBtn
                  onClick={() => {
                    setMoreShow(false);
                  }}>
                  접기 ▲
                </FoldBtn>
              </>
            ) : (
              <>
                <DescSum>{review.review}</DescSum>
                <MoreBtn
                  className='more'
                  onClick={() => {
                    setMoreShow(review.reviewId);
                  }}>
                  리뷰 자세히 보기 ▼
                </MoreBtn>
              </>
            )}
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
      ))}
      <Pagenation
        searchLength={searchLength}
        nowPageNum={nowPageNum}
        setNowPageNum={setNowPageNum}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
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
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
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

const FoldBtn = styled.button`
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

const PagenationWrap = styled.div`
  margin: 53px auto;
  position: relative;
  .pagenationNumWrap {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: center;
    gap: 29px;
    padding: 0;
    margin: 0;
  }
  .pagenationNumWrap li {
    width: 33px;
    height: 33px;
    background-color: #e7e7e7;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
    font-size: 18px;
    color: #868686;

    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
  }
  .pagenationNumWrap li.Active {
    background-color: white;
    border: 1px solid #3366ff;
    color: #242424;
  }
  .pagenationArrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 26px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
  }
  .pagenationArrow.left {
    left: -50px;
    background-image: url('/assets/image/icon_page_arrow_left.png');
  }
  .pagenationArrow.right {
    right: -50px;
    background-image: url('/assets/image/icon_page_arrow_right.png');
  }
`;
export default MyReviews;
