import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosWarning } from 'react-icons/io';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { userApi } from '../apis/apiInstance';
import { Mobile, Laptop, PC } from '../query/useMediaQuery';
import AddReviews from '../pages/AddReviews';

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
    window.scrollTo(0, 800);
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

const Reviews = (props) => {
  const navigate = useNavigate();
  const [moreShow, setMoreShow] = useState(0);
  const [reviewArr, setReviewArr] = useState([]);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState(0);
  const [searchLength, setSearchLength] = useState(0);
  const [sort, setSort] = useState('updatedAt');
  const [sortText, setSortText] = useState('최신순');
  const [pickTag, setpickTag] = useState('전체보기');
  const [openDrop, setOpenDrop] = useState(false);
  const setIsToken = props.setIsToken;
  const { id } = useParams();

  //현재페이지
  const [nowPageNum, setNowPageNum] = useState(1);

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

  useEffect(() => {
    getReviews();
    GetProfile();
  }, [nowPageNum, pickTag, sort]);

  const GetProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setNickname(res.data.user.nickname);
      setUserId(res.data.user.userId);
    } catch (e) {
      console.log(e);
    }
  };

  const getReviews = async () => {
    if (pickTag === '전체보기') {
      try {
        const res = await userApi.get(
          `/api/reviews?medicineId=${id}&page=${nowPageNum}&pageSize=5&order=${sort}`
        );
        setReviewArr(res.data.reviewList);
        setSearchLength(res.data.totalReview);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await userApi.get(
          `/api/reviews?medicineId=${id}&page=${nowPageNum}&pageSize=5&tag=${pickTag}&order=${sort}`
        );
        setReviewArr(res.data.reviewList);
        setSearchLength(res.data.totalReview);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const pickTagColor = (e) => {
    setpickTag(e.target.innerText);
    setNowPageNum(1);
  };

  const handleLike = async (id) => {
    if (token) {
      try {
        await userApi.put(`/api/reviews/${id}/like`);
        getReviews();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

  const handleDisLike = async (id) => {
    if (token) {
      try {
        await userApi.put(`/api/reviews/${id}/dislike`);
        getReviews();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

  const handleDropdown = (sort) => {
    setSort(sort);
    setNowPageNum(1);
    setOpenDrop(false);
    if (sort === 'updatedAt') {
      setSortText('최신순');
    } else if (sort === 'likeCount') {
      setSortText('추천순');
    }
  };

  const token = localStorage.getItem('accessToken');

  const addReview = () => {
    if (token) {
      navigate(`/detail/${id}/reviewform`);
    } else {
      alert('로그인 후 이용 가능합니다.');
    }
  };

  const handleReport = () => {
    alert('구현중입니다! 😉');
  };

  return (
    <Wrapper>
      <ReviewBtnWrap>
        <ReviewDesc>
          <p>
            {nickname}님의 리뷰로 같은 고민을 가진 분들이 도움이 될 수 있어요.
          </p>
          <span>
            리뷰에 해당 의약품과 무관한 내용이 포함되었거나, 어뷰징으로 판단된
            리뷰는 안내 없이 즉시 삭제 처리됩니다.
          </span>
        </ReviewDesc>
        <ReviewpageBtn onClick={addReview}>리뷰 쓰기</ReviewpageBtn>
      </ReviewBtnWrap>
      <ReviewNav>
        <ReviewHeader>
          <div className='total'>
            <span className='title'>리뷰</span>
            <span className='sum'> {searchLength}개</span>
          </div>
          {openDrop ? (
            <DropOpen>
              <SortDefault onClick={() => setOpenDrop(false)}>
                <SortName>{sortText}</SortName>
                <Arrow>▲</Arrow>
              </SortDefault>
              <CreatedAt onClick={() => handleDropdown('updatedAt')}>
                최신순
              </CreatedAt>
              <LikeCount onClick={() => handleDropdown('likeCount')}>
                추천순
              </LikeCount>
            </DropOpen>
          ) : (
            <SortDefault onClick={() => setOpenDrop(true)}>
              <SortName>{sortText}</SortName>
              <Arrow>▼</Arrow>
            </SortDefault>
          )}
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
      {reviewArr.map((review) =>
        review.review.includes(pickTag) || pickTag === '전체보기' ? (
          <Contents key={review.reviewId}>
            <ReviewInfo>
              <AccountBox>
                <AccountBoxBg>
                  <AccountBoxImg imageUrl={review.userImage} />
                </AccountBoxBg>
                <span>{review.nickname}</span>
              </AccountBox>
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
            </ReviewInfo>
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
              <PC>
                <IoIosWarning size='26' color='#FF772B' />
              </PC>
              <Laptop>
                <IoIosWarning size='20' color='#FF772B' />
              </Laptop>
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
              {review.userId === userId ? (
                <EditBtn
                  to={`/detail/${review.medicineId}/editform/${review.reviewId}`}>
                  <div />
                  수정하기
                </EditBtn>
              ) : (
                <ReportBtn onClick={handleReport}>
                  <div />
                  신고하기
                </ReportBtn>
              )}
            </div>
          </Contents>
        ) : null
      )}
      <Pagenation
        searchLength={searchLength}
        nowPageNum={nowPageNum}
        setNowPageNum={setNowPageNum}
      />
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
  gap: 20px;
`;

const ReviewBtnWrap = styled.div`
  @media screen and (max-width: 1700px) {
    padding: 20px 30px;
    min-height: 100px;
  }
  background-color: #f6f7fa;
  width: 100%;
  min-height: 120px;
  border-radius: 25px;
  padding: 30px 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ReviewDesc = styled.div`
  @media screen and (max-width: 1700px) {
    line-height: 16px;
  }
  width: 1070px;
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
  }
`;

const ReviewpageBtn = styled.div`
  @media screen and (max-width: 1700px) {
    min-width: 95px;
    height: 40px;
    font-size: 17px;
  }
  min-width: 130px;
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
  @media screen and (max-width: 1700px) {
    padding: 20px 30px;
    min-height: 140px;
  }
  background-color: #f6f7fa;
  width: 100%;
  min-height: 178px;
  border-radius: 25px;
  padding: 30px 60px;
`;

const ReviewHeader = styled.div`
  @media screen and (max-width: 1700px) {
    height: 44px;
    margin-bottom: 10px;
  }
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  .title {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
    }
    font-size: 24px;
    font-weight: bold;
  }
  .sum {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
    }
    font-size: 24px;
    font-weight: bold;
    color: #3366ff;
  }
`;

const SortDefault = styled.div`
  @media screen and (max-width: 1700px) {
    width: 110px;
    height: 36px;
  }
  width: 130px;
  height: 44px;
  border-radius: 8px;
  background-color: #e7e7e7;
  position: absolute;
  right: 0;
  color: #868686;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const SortName = styled.span`
  @media screen and (max-width: 1700px) {
    left: 20px;
  }
  position: absolute;
  left: 30px;
`;

const Arrow = styled.span`
  @media screen and (max-width: 1700px) {
    right: 18px;
    font-size: 12px;
  }
  position: absolute;
  right: 10px;
`;

const DropOpen = styled.div`
  @media screen and (max-width: 1700px) {
    width: 110px;
    height: 110px;
    top: 4px;
  }
  background-color: white;
  width: 130px;
  height: 132px;
  position: absolute;
  border-radius: 8px;
  right: 0;
  top: 8px;
`;

const CreatedAt = styled.div`
  @media screen and (max-width: 1700px) {
    width: 110px;
    height: 35px;
    top: 38px;
    /* background-color: aqua; */
  }
  width: 130px;
  height: 44px;
  border-radius: 8px;
  position: absolute;
  top: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  color: #868686;
  cursor: pointer;
`;

const LikeCount = styled.div`
  @media screen and (max-width: 1700px) {
    width: 110px;
    height: 35px;
    top: 74px;
    /* background-color: #d3c939; */
  }
  width: 130px;
  height: 44px;
  border-radius: 8px;
  position: absolute;
  top: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 2px;
  color: #868686;
  cursor: pointer;
`;

const ReviewSorting = styled.div`
  @media screen and (max-width: 1700px) {
    min-height: 40px;
    /* background-color: aqua; */
  }
  width: 100%;
  min-height: 60px;
  display: flex;
  align-items: center;
  flex-flow: wrap;
  gap: 10px;
`;

const SortTag = styled.span`
  @media screen and (max-width: 1700px) {
    height: 32px;
    min-width: 54px;
    font-size: 14px;
    font-weight: 600;
  }
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
  @media screen and (max-width: 1700px) {
    padding: 20px 30px;
  }
  width: 100%;
  border-radius: 23px;
  background-color: #f6f7fa;
  display: flex;
  flex-direction: column;
  padding: 30px 60px;
`;

const ReviewInfo = styled.div`
  @media screen and (max-width: 1700px) {
    height: 46px;
  }
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
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    font-size: 20px;
    font-weight: bold;
  }
`;

const AccountBoxBg = styled.div`
  @media screen and (max-width: 1700px) {
    width: 44px;
    height: 44px;
    margin-left: 0;
  }
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
  @media screen and (max-width: 1700px) {
    width: 36px;
    height: 36px;
  }
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
  @media screen and (max-width: 1700px) {
    font-size: 14px;
  }
  display: flex;
  align-items: center;
  color: #868686;
  font-size: 18px;
`;

const Description = styled.div`
  @media screen and (max-width: 1700px) {
    padding: 30px 0px 10px 8px;
  }
  /* background-color: aqua; */
  width: 100%;
  padding-top: 20px;
`;

const DescSum = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 15px;
  }
  font-size: 24px;
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
  }
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
  @media screen and (max-width: 1700px) {
    font-size: 14px;
    margin-bottom: 10px;
  }
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
  @media screen and (max-width: 1700px) {
    font-size: 14px;
    padding-bottom: 5px;
  }
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
  @media screen and (max-width: 1700px) {
    height: 40px;
    margin-top: 10px;
  }
  height: 70px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LikeBtn = styled.button`
  @media screen and (max-width: 1700px) {
    min-width: 110px;
    width: 110px;
    max-width: 130px;
    height: 30px;
    font-size: 13px;
  }
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
  @media screen and (max-width: 1700px) {
    min-width: 110px;
    width: 110px;
    max-width: 130px;
    height: 30px;
    font-size: 13px;
  }
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

const EditBtn = styled(Link)`
  @media screen and (max-width: 1700px) {
    width: 100px;
    height: 30px;
    font-size: 13px;
    margin-top: 10px;
  }
  width: 123px;
  height: 36px;
  border-radius: 87px;
  background-color: #868686;
  color: white !important;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  div {
    @media screen and (max-width: 1700px) {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    background-image: url('/assets/image/닉네임수정아이콘.png');
    background-size: cover;
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

const ReportBtn = styled.div`
  @media screen and (max-width: 1700px) {
    width: 100px;
    height: 30px;
    font-size: 13px;
    margin-top: 10px;
  }
  width: 123px;
  height: 36px;
  border-radius: 87px;
  background-color: #ffd3ce;
  color: #ff392b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  div {
    @media screen and (max-width: 1700px) {
      width: 20px;
      height: 20px;
      margin-right: 6px;
    }
    background-image: url('/assets/image/warnIcon.png');
    background-size: cover;
    width: 24px;
    height: 24px;
    margin-right: 10px;
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
export default Reviews;
