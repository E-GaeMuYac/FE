import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosWarning } from 'react-icons/io';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useEffect } from 'react';
import { userApi } from '../apis/apiInstance';
import { Link } from 'react-router-dom';

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
    window.scrollTo(0, 300);
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

const MyReviews = ({ userId }) => {
  const [moreShow, setMoreShow] = useState(0);
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
      setSearchLength(res.data.totalReview);
      setMyReviewArr(res.data.reviewList);
      setSearchLength(res.data.totalReview);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        const res = await userApi.delete(`/api/reviews/${id}`);
        alert(res.data.message);
        getMyReviews();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLike = async (id) => {
    try {
      await userApi.put(`/api/reviews/${id}/like`);
      getMyReviews();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisLike = async (id) => {
    try {
      await userApi.put(`/api/reviews/${id}/dislike`);
      getMyReviews();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Wrapper>
      {myReviewArr.map((review) => (
        <Contents key={review.reviewId}>
          <WrapContents>
            <Image imgUrl={review?.itemImage} />
            <div style={{ marginRight: '20px' }}>
              <Name to={`/detail/${review.medicineId}?tab=효능 효과`}>
                {review?.itemName}
              </Name>
              <Categorize>
                {review?.productType?.map((list) => {
                  return <div key={list}>{list}</div>;
                })}
              </Categorize>
            </div>
            <div className='labelWrap'>
              <TopLabel>{review?.entpName}</TopLabel>
              <BottomLabel>
                {review?.etcOtcCode}
                <div className='etcOtcCodeDesc'>
                  {review?.etcOtcCode === '전문의약품' ? (
                    <span className='tooltipText'>
                      의사 또는 치과의사의 지시와 감독에 따라 사용되어야 하는
                      의약품으로, 의사의 처방전에 의해서만 구입하여 사용할 수
                      있다.
                    </span>
                  ) : (
                    <span className='tooltipText'>
                      처방전 없이 약국에서 구입할 수 있는 의약품으로, 포장
                      용기에 기재된 설명대로 올바르게 복용한다면 비교적 안전하게
                      사용할 수 있다.
                    </span>
                  )}
                </div>
              </BottomLabel>
            </div>
            <div className='buttonWrap'>
              <Link
                to={`/detail/${review.medicineId}/editform/${review.reviewId}`}
                className='reviewBtn modify'>
                수정하기
              </Link>
              <button
                className='reviewBtn delete'
                onClick={() => deleteReview(review.reviewId)}>
                삭제하기
              </button>
            </div>
          </WrapContents>
          <Description>
            {review.review.length > 260 ? (
              moreShow !== review.reviewId ? (
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
              ) : (
                <>
                  <DescWhole>{review.review}</DescWhole>
                  <FoldBtn
                    onClick={() => {
                      setMoreShow(false);
                    }}>
                    접기 ▲
                  </FoldBtn>
                </>
              )
            ) : (
              <DescWhole style={{ marginBottom: '10px' }}>
                {review.review}
              </DescWhole>
            )}
          </Description>
          <Exception>
            <IoIosWarning size='26' color='#FF772B' />
            <span>면책사항:</span>
            <div>의학적 또는 전문가의 조언이 아닌 사용자의 의견입니다.</div>
          </Exception>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Recommend>
              <LikeBtn
                like={review.like}
                onClick={() => handleLike(review.reviewId)}>
                <AiFillLike />
                <div>도움 돼요 {review.likeCount}</div>
              </LikeBtn>
              <DislikeBtn
                disLike={review.dislike}
                onClick={() => handleDisLike(review.reviewId)}>
                <AiFillDislike />
                <div>도움 안돼요</div>
              </DislikeBtn>
            </Recommend>
            <DateWrited>
              {review.updatedAt
                .replace('T', '. ')
                .split(' ')[0]
                .split('-')
                .join('.')
                .replace('.', '년 ')
                .replace('.', '월 ')
                .replace('.', '일')}
            </DateWrited>
          </div>
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
  margin: 20px 0 100px 0;
`;

const Contents = styled.div`
  width: 100%;
  border-radius: 23px;
  background-color: #f6f7fa;
  display: flex;
  flex-direction: column;
  padding: 30px 60px;
`;

const WrapContents = styled.div`
  width: 100%;
  padding: 21px 0;
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
  .buttonWrap {
    position: absolute;
    right: 0;
    display: flex;
    gap: 10px;
    .reviewBtn {
      width: 120px;
      height: 40px;
      border-radius: 8px;
      border: none;
      color: white;
    }
    .modify {
      background-color: #868686;
      display: flex;
      text-decoration: none;
      align-items: center;
      justify-content: center;
    }
    .delete {
      background-color: red;
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

const Name = styled(Link)`
  min-width: 360px;
  max-width: 380px;
  margin: auto;
  color: black !important;
  text-decoration: none;
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

const ModifyArea = styled.textarea`
  width: 100%;
  height: 300px;
  background-color: white;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  outline: none;
  resize: none;
  font-size: 24px;

  ::placeholder {
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

const Description = styled.div`
  width: 100%;
`;

const DescSum = styled.div`
  font-size: 24px;
  width: 100%;
  height: 110px;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DescWhole = styled.div`
  font-size: 24px;
  word-break: break-all;
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

const DislikeBtn = styled.button`
  width: 127px;
  height: 36px;
  border-radius: 87px;
  border: none;
  background-color: ${({ disLike }) => (disLike ? '#3366FF' : '#e7e7e7')};
  color: ${({ disLike }) => (disLike ? '#ffffff' : '#868686')};
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    text-indent: 5px;
  }
`;

const DateWrited = styled.span`
  align-items: center;
  color: #868686;
  font-size: 18px;
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
