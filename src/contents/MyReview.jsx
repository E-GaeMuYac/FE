import React, { useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import { userApi } from '../apis/apiInstance';
import { Link } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { userInfoState, confirmModalState } from '../recoil/recoilStore';

const Pagenation = ({ nowPageNum, setNowPageNum, searchLength }) => {
  const [numArr, setNumArr] = useState([]);
  const [numArrPage, setNumArrPage] = useState([]);
  const [pageNum, setPageNum] = useState(0);

  //서치 갯수에 따라 numArr 배열 생성
  useEffect(() => {
    let newArr = [];
    let count = 1;
    newArr.push(count);
    for (let i = 1; i < searchLength; i++) {
      if (i % 5 === 0) {
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

const MyReviews = () => {
  const userId = useRecoilValue(userInfoState).userId;
  const [aboutConfirm, setAboutConfirm] = useRecoilState(confirmModalState);
  const [moreShow, setMoreShow] = useState(0);
  const [myReviewArr, setMyReviewArr] = useState([]);
  const [searchLength, setSearchLength] = useState(0);

  //현재페이지
  const [nowPageNum, setNowPageNum] = useState(1);

  useEffect(() => {
    getMyReviews();
  }, [userId, nowPageNum]);

  const getMyReviews = async () => {
    try {
      const res = await userApi.get(
        `/api/reviews/myreview?userId=${userId}&page=${nowPageNum}&pageSize=5`
      );
      setSearchLength(res.data.totalReview);
      setMyReviewArr(res.data.reviewList);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteConfirm = async (reviewId) => {
    setAboutConfirm({
      msg: '리뷰를 삭제하시겠습니까?',
      btn: ['취소하기', '삭제하기'],
      isOpen: true,
      reviewId,
    });
  };

  useEffect(() => {
    async function fetchData() {
      if (aboutConfirm.isApprove === true) {
        deleteReview();
      }
    }
    fetchData();
  }, [aboutConfirm]);

  const deleteReview = async () => {
    try {
      await userApi.delete(`/api/reviews/${aboutConfirm.reviewId}`);
      getMyReviews();
      setAboutConfirm({
        msg: '',
        btn: [],
        isOpen: false,
        isApprove: false,
      });
    } catch (error) {
      console.log(error);
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

  const koreaCurrent = (date) => {
    let localDate = new Date(date);
    let nowMonth = (localDate.getMonth() + 1).toString();
    if (nowMonth.length === 1) {
      nowMonth = '0' + nowMonth;
    }
    let nowDate = localDate.getDate().toString();
    if (nowDate.length === 1) {
      nowDate = '0' + nowDate;
    }
    let koreaDate = `${localDate.getFullYear()}년 ${nowMonth}월 ${nowDate}일`;
    return koreaDate;
  };

  return (
    <Wrapper>
      {myReviewArr.map((review) => (
        <Contents key={review.reviewId}>
          <WrapContents>
            <Image imgUrl={review?.itemImage} />
            <div className='firstWrap'>
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
              <BottomLabel>{review?.etcOtcCode}</BottomLabel>
            </div>
            {review.report.length > 4 ? (
              <div className='warningWrap'>
                <div className='warningBox'>
                  <div className='icon' />
                  <div className='content'>
                    신고가 누적되어 관리자가 확인 중인 리뷰입니다.
                  </div>
                </div>
              </div>
            ) : (
              <div className='buttonWrap'>
                <Link
                  to={`/detail/${review.medicineId}/editform/${review.reviewId}`}
                  className='reviewBtn modify'>
                  수정하기
                </Link>
                <button
                  className='reviewBtn delete'
                  onClick={() => deleteConfirm(review.reviewId)}>
                  삭제하기
                </button>
              </div>
            )}
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
                    리뷰 자세히 보기
                    <div />
                  </MoreBtn>
                </>
              ) : (
                <>
                  <DescWhole>{review.review}</DescWhole>
                  <FoldBtn
                    onClick={() => {
                      setMoreShow(false);
                    }}>
                    접기
                    <div />
                  </FoldBtn>
                </>
              )
            ) : (
              <DescWhole style={{ marginBottom: '10px' }}>
                {review.review}
              </DescWhole>
            )}
          </Description>
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
                <div />
                도움 돼요 {review.likeCount}
              </LikeBtn>
              <DislikeBtn
                disLike={review.dislike}
                onClick={() => handleDisLike(review.reviewId)}>
                <div />
                도움 안돼요 {review.dislikeCount}
              </DislikeBtn>
            </Recommend>
            <DateWrited>{koreaCurrent(review.createdAt)}</DateWrited>
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
  @media screen and (max-width: 1700px) {
    padding: 30px 30px;
  }
  width: 100%;
  border-radius: 23px;
  background-color: #f6f7fa;
  display: flex;
  flex-direction: column;
  padding: 30px 60px;
`;

const WrapContents = styled.div`
  @media screen and (max-width: 1700px) {
    padding: 0;
  }
  width: 100%;
  padding: 21px 0;
  margin: auto;
  align-items: center;
  display: flex;

  .firstWrap {
    @media screen and (max-width: 1700px) {
      min-width: 280px;
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
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 14px;
    width: 390px;
    height: 85px;

    .reviewBtn {
      @media screen and (max-width: 1700px) {
        width: 90px;
        height: 34px;
        font-size: 14px;
      }
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
      background-color: #242424;
    }
  }
  .warningWrap {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 390px;
    height: 85px;

    .warningBox {
      @media screen and (max-width: 1700px) {
        padding: 10px 8px;
      }
      border-radius: 10px;
      border: 2px solid #ff8880;
      background-color: #ffecea;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;

      .icon {
        @media screen and (max-width: 1700px) {
          width: 35px;
          height: 35px;
        }
        background-image: url('/assets/image/redWarn.png');
        background-size: cover;
        width: 44px;
        height: 44px;
      }

      .content {
        @media screen and (max-width: 1700px) {
          width: 150px;
          height: 40px;
          font-size: 13px;
          line-height: 20px;
        }
        width: 173px;
        height: 46px;
        font-weight: 500;
        font-size: 15px;
        line-height: 23px;
        color: #ff392b;
      }
    }
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

const Name = styled(Link)`
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
  @media screen and (max-width: 1700px) {
    padding: 30px 0px 10px 8px;
  }
  width: 100%;
`;

const DescSum = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 15px;
  }
  font-size: 24px;
  width: 100%;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DescWhole = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 15px;
  }
  font-size: 24px;
  word-break: break-all;
`;

const MoreBtn = styled.button`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
    margin-bottom: 10px;
    padding: 2px 8px;
    gap: 3px;
  }
  background-color: #e7e7e7;
  appearance: none;
  margin: 15px 0;
  padding: 3px 12px;
  border-radius: 8px;
  border: none;
  color: #3366ff;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  div {
    @media screen and (max-width: 1700px) {
      width: 22px;
      height: 22px;
    }
    background-image: url('/assets/image/moreArrow.png');
    background-size: cover;
    width: 26px;
    height: 26px;
  }
`;

const FoldBtn = styled.button`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
    margin-bottom: 10px;
    padding: 2px 8px;
    gap: 3px;
  }
  background-color: #e7e7e7;
  appearance: none;
  margin: 15px 0;
  padding: 3px 12px;
  border-radius: 8px;
  border: none;
  color: #3366ff;
  font-weight: 500;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  div {
    @media screen and (max-width: 1700px) {
      width: 22px;
      height: 22px;
    }
    background-image: url('/assets/image/foldArrow.png');
    background-size: cover;
    width: 26px;
    height: 26px;
  }
`;

const Recommend = styled.div`
  @media screen and (max-width: 1700px) {
    height: 30px;
    margin-top: 10px;
  }
  height: 70px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LikeBtn = styled.button`
  @media screen and (max-width: 1700px) {
    padding: 5px 14px;
    font-size: 13px;
  }
  padding: 6.5px 15px;
  border-radius: 87px;
  border: none;
  background-color: ${({ like }) => (like ? '#3366FF' : '#e7e7e7')};
  color: ${({ like }) => (like ? '#ffffff' : '#868686')};
  font-size: 16px;
  font-weight: ${({ like }) => (like ? '400' : '350')};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  div {
    @media screen and (max-width: 1700px) {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
    background-image: ${({ like }) =>
      like
        ? `url('/assets/image/ThumbsUp2.png')`
        : `url('/assets/image/ThumbsUp1.png')`};
    background-size: cover;
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
`;

const DislikeBtn = styled.button`
  @media screen and (max-width: 1700px) {
    padding: 5px 14px;
    font-size: 13px;
  }
  padding: 6.5px 15px;
  border-radius: 87px;
  border: none;
  background-color: ${({ disLike }) => (disLike ? '#3366FF' : '#e7e7e7')};
  color: ${({ disLike }) => (disLike ? '#ffffff' : '#868686')};
  font-size: 16px;
  font-weight: ${({ disLike }) => (disLike ? '400' : '350')};
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    @media screen and (max-width: 1700px) {
      width: 20px;
      height: 20px;
      margin-right: 4px;
    }
    background-image: ${({ disLike }) =>
      disLike
        ? `url('/assets/image/ThumbsDown2.png')`
        : `url('/assets/image/ThumbsDown1.png')`};
    background-size: cover;
    width: 24px;
    height: 24px;
    margin-right: 6px;
  }
`;

const DateWrited = styled.span`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
  }
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
