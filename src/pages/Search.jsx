import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';

import styled from 'styled-components';

import { useGetRemmendQuery, useGetSearchQuery } from '../query/searchQuery';

import { useRecoilState } from 'recoil';
import { searchWord } from '../recoil/recoilStore';

//component
import ProductList from '../components/common/productList';

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
      if (i % 20 === 0) {
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

const Search = () => {
  const navigate = useNavigate();
  const [searhArr, setSearhArr] = useState([]);

  //약 검색 종류 데이터 모음
  const [searchSortList, setSearchSortList] = useState(['약 이름', '약 분류']);
  const [searchKinds, setSearchKinds] = useState('약 이름');
  const [searchKindsCode, setSearchKindsCode] = useState('itemName');
  const [isOpenSearchSort, setIsOpenSearchSort] = useState(false);

  //약 검색 input 용 데이터모음
  const [searchedWord, setSearchedWord] = useRecoilState(searchWord);
  const [inputValue, setInputValue] = useState(searchedWord);
  const [recommendedValue, setRecommendedValue] = useState('');
  //inputValue 초기화 버튼 활성화 유무
  const [isActiveDeleteBtn, setIsActiveDeleteBtn] = useState(false);
  //페이지네이션
  const [nowPageNum, setNowPageNum] = useState(1);
  //서치 결과 길이
  const [searchLength, setSearchLength] = useState(0);

  const [isFocusedInput, setIsFocusedInput] = useState(false);

  const searchSortRemove = () => {
    setIsOpenSearchSort(false);
  };
  const searchSortOpen = () => {
    setIsOpenSearchSort(true);
  };
  const searchSortChoice = (name) => {
    let retouchedList = [...searchSortList];

    retouchedList.splice(searchSortList.indexOf(name), 1);
    retouchedList.unshift(name);

    setSearchSortList(retouchedList);

    setSearchKinds(name);
    searchSortRemove();
  };

  const focusedInput = () => {
    setIsFocusedInput(true);
  };
  const focusOutInput = () => {
    setTimeout(() => {
      setIsFocusedInput(false);
    }, 100);
  };
  // input에 글을 적을 때마다 실시간으로 저장
  const changeInputValue = useCallback(({ target: { value } }) => {
    setInputValue(value);
  }, []);

  useEffect(() => {
    const setRecommended = setTimeout(() => {
      setRecommendedValue(inputValue);
    }, 300);
    return () => clearTimeout(setRecommended);
  }, [inputValue]);

  // input에 적은 글 삭제
  const deleteSearchValue = () => {
    setInputValue('');
  };

  useEffect(() => {
    if (inputValue.length > 0) {
      setIsActiveDeleteBtn(true);
    } else {
      setIsActiveDeleteBtn(false);
    }
  }, [inputValue]);
  // -----------------------------------------------------------------------------
  //서치 훅 호출
  const { refetch, data } = useGetSearchQuery(
    searchKindsCode,
    searchedWord,
    nowPageNum,
    20
  );

  //서치 시작
  const doingSearch = (value) => {
    setInputValue(value);
    if (value.trim()) {
      // 결과 창 단어 교체
      setSearchedWord(value);
      setNowPageNum(1);
      if (searchKinds === '약 이름') {
        setSearchKindsCode('itemName');
      } else if (searchKinds === '약 분류') {
        setSearchKindsCode('productType');
      }
    }
  };

  //searchedWord,nowPageNum 변경 시 refetch
  useEffect(() => {
    if (searchedWord) {
      refetch();
    }
  }, [searchedWord, nowPageNum]);

  // data가 undefined가 아닐 때 state 변경
  useEffect(() => {
    if (data) {
      setSearhArr(data.data.data);
      setSearchLength(data.data.searchLength);
    }
  }, [data]);
  // -----------------------------------------------------------------------------
  const TopSearchArr = [
    { name: '타이레놀정500밀리그람', id: 49132 },
    { name: '판콜에스내복액', id: 2286 },
    { name: '판피린큐액', id: 17060 },
    { name: '까스활명수큐액', id: 2285 },
    { name: '탁센연질캡슐', id: 18895 },
    { name: '콜대원코프큐시럽', id: 48855 },
    { name: '텐텐츄정', id: 17101 },
    { name: '케토톱플라스타', id: 3449 },
    { name: '광동원탕', id: 4010 },
    { name: '벤포벨에스정', id: 50083 },
  ];
  const TopSearchKind = [
    '진통제',
    '해열제',
    '소염제',
    '항히스타민제',
    '정신신경용제',
    '수렴제',
    '진양제',
  ];

  const topItemSearch = (list) => {
    setSearchedWord(list);
    setInputValue(list);
    setNowPageNum(1);
    setSearchKindsCode('productType');
  };

  const topItemDetail = (id) => {
    navigate(`/detail/${id}?tab=효능 효과`);
  };

  // -----------------------------------------------------------------------------
  const [recommendArr, setRecommendArr] = useState([]);
  const recommendWord = useGetRemmendQuery(
    'itemName',
    recommendedValue,
    1,
    8
  ).data;
  useEffect(() => {
    if (searchKinds !== '약 이름') {
      setRecommendArr([]);
    } else if (recommendWord && isFocusedInput) {
      setRecommendArr(recommendWord.data.data);
    }
  }, [recommendedValue, recommendWord, isFocusedInput, searchKinds]);
  // -----------------------------------------------------------------------------
  return (
    <Wrap>
      <SearchBarWrap
        isOpenSearchSort={isOpenSearchSort}
        isActiveDeleteBtn={isActiveDeleteBtn}
        isFocusedInput={isFocusedInput}>
        <div className='searchBar'>
          <div className='searchSortWrap'>
            <div className='searchSortHeaderWrap' onClick={searchSortOpen}>
              <div className='searchSortHeader'>{searchKinds}</div>
              <div className='searchSortArrow'></div>
            </div>
            <ul className='searchSortList'>
              {searchSortList.map((list) =>
                list === searchKinds ? (
                  <li
                    key={list}
                    className='choice'
                    onClick={() => {
                      searchSortChoice(list);
                    }}>
                    {list}
                    <div className='searchSortArrow2'></div>
                  </li>
                ) : (
                  <li
                    onClick={() => {
                      searchSortChoice(list);
                    }}
                    key={list}>
                    {list}
                  </li>
                )
              )}
            </ul>
          </div>
          <input
            className='searchinput'
            value={inputValue}
            onChange={changeInputValue}
            onFocus={focusedInput}
            onBlur={focusOutInput}
            placeholder={
              searchKinds === '약 이름'
                ? '약 이름을 검색해보세요!'
                : '약 분류를 검색해보세요!'
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                doingSearch(inputValue);
              }
            }}
          />
          <div
            className='deleteSearchInputValueBtn'
            onClick={deleteSearchValue}></div>
          <div
            className='searchBtnWrap'
            onClick={() => {
              doingSearch(inputValue);
            }}>
            <div className='searchBtn'></div>
            <div className='searchBtnText'>검색</div>
          </div>
        </div>
        {isFocusedInput && recommendedValue && recommendArr.length > 0 ? (
          <ul className='recommendBox'>
            {recommendArr.map((list) => {
              return (
                <li
                  key={list.medicineId}
                  onClick={() => {
                    doingSearch(list.itemName);
                  }}>
                  {list.itemName}
                </li>
              );
            })}
          </ul>
        ) : null}
      </SearchBarWrap>
      <LatestSearchWrap>
        {/* <div className='title'>최근검색어</div>
        <ul>
          <li>게보린</li>
          <li>게보린</li>
          <li>게보린</li>
        </ul>
        <div className='allDelete'>전체삭제</div> */}
      </LatestSearchWrap>
      {searchedWord ? (
        <SearchResultWrap>
          <div className='ExplainWrap'>
            <div className='LikeBtnImgBox'></div>
            <span>찜이 많은 순</span>으로 검색데이터가 제공됩니다.
          </div>
          <div className='searchTop'>
            <div className='searchTitleWrap'>
              <div className='searchText'>'{searchedWord}'</div>
              <div className='searchListNum'>
                검색 결과 {searchLength.toLocaleString('ko-KR')}개
              </div>
            </div>
            <div className='searchSort'>찜이 많은 순</div>
          </div>
          <ul className='searchList'>
            {searhArr.map((list) => (
              <ProductList
                key={list.medicineId}
                image={list.itemImage}
                list={list}
              />
            ))}
          </ul>
          <Pagenation
            nowPageNum={nowPageNum}
            setNowPageNum={setNowPageNum}
            searchLength={searchLength}
          />
        </SearchResultWrap>
      ) : (
        <TopSearchWrap searchKinds={searchKinds}>
          <div className='title'>인기 검색어</div>
          <ul className='desc'>
            {searchKinds === '약 이름'
              ? TopSearchArr.map((list) => (
                  <li key={list.id} onClick={() => topItemDetail(list.id)}>
                    {TopSearchArr.indexOf(list) + 1}. {list.name}
                  </li>
                ))
              : TopSearchKind.map((list) => (
                  <li key={list} onClick={() => topItemSearch(list)}>
                    {list}
                  </li>
                ))}
          </ul>
        </TopSearchWrap>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  @media screen and (max-width: 1700px) {
    padding-top: 50px;
  }
  padding-top: 100px;
`;
const SearchBarWrap = styled.div`
  @media screen and (max-width: 1700px) {
    margin: 0 auto 35px;
  }
  margin: 0 auto 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
  font-family: 'NanumSquare', sans-serif;
  .searchBar {
    @media screen and (max-width: 1700px) {
      width: 70%;
      height: 50px;
    }
    max-width: 860px;
    height: 65px;
    width: 60%;
    ${({ isFocusedInput }) =>
      isFocusedInput
        ? `
        border: 1px solid #ffffff;
        background-color: #ffffff;
        box-shadow: 0 1px 8px 0px rgba(0, 0, 0, 0.15);
        `
        : `
          border: 1px solid #f6f7fa;
          background-color: #f6f7fa;
        `}
    border-radius: 60px;
    display: flex;
    position: relative;
    z-index: 100;
  }
  .searchSortWrap {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      height: 50px;
      width: 130px;
    }
    border-radius: 32px;
    ${({ isFocusedInput }) =>
      isFocusedInput
        ? `
    background-color: #F6F7FA;
    border: 3px solid #ffffff;
    `
        : `
    background-color: white;
    border: 3px solid #f6f7fa;
    `}
    width: 150px;
    height: 65px;
    margin-right: 10px;
    font-size: 24px;
    font-weight: bold;
    position: relative;
  }
  .searchSortHeaderWrap {
    @media screen and (max-width: 1700px) {
      height: 50px;
      width: 130px;
    }
    width: 150px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
  }
  .searchSortList {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      width: 150px;
      height: 90px;
      gap: 10px;
      width: 130px;
      border-radius: 26px;
      padding: 7px 9px;
    }
    display: ${({ isOpenSearchSort }) => (isOpenSearchSort ? 'flex' : 'none')};
    position: absolute;
    left: -3px;
    top: -2.5px;
    width: 152px;
    padding: 14px 16px;
    margin: 0;
    flex-direction: column;
    gap: 14px;
    ${({ isFocusedInput }) =>
      isFocusedInput
        ? `
    background-color: #F6F7FA;
    border: 3px solid #ffffff;
    `
        : `
    background-color: white;
    border: 3px solid #f6f7fa;
    `}
    border-radius: 32px;
  }
  .searchSortList li {
    color: #868686;
    cursor: pointer;
    margin-left: 4px;
    @media screen and (max-width: 1700px) {
      gap: 4px;
      margin-left: 10.5px;
      margin-top: 2.5px;
    }
  }
  .searchSortList li.choice {
    display: flex;
    gap: 4px;
    color: #242424;
    /* margin-top: 1px; */
    @media screen and (max-width: 1700px) {
      /* margin-top: 3px; */
    }
    display: flex;
    align-items: center;
  }
  .searchSortArrow {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/arrow_down.png');
    background-size: cover;
    background-position: center;
  }
  .searchSortArrow2 {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/arrow_down.png');
    background-size: cover;
    background-position: center;
    margin-top: 2px;
    margin-left: 0px;
    @media screen and (max-width: 1700px) {
      margin-top: -1px;
      margin-left: -0.5px;
    }
  }
  .searchinput {
    @media screen and (max-width: 1700px) {
      height: 50px;
      font-size: 16px;
    }
    width: 475px;
    height: 65px;
    font-size: 20px;
    font-weight: bold;
    line-height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
  }
  .searchinput::placeholder {
    color: #b7b7b7;
  }
  .deleteSearchInputValue {
    @media screen and (max-width: 1700px) {
      margin-right: 12px;
      height: 50px;
    }
    flex-grow: 1;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .deleteSearchInputValueBtn {
    @media screen and (max-width: 1700px) {
      right: 112px;
      top: 14px;
    }
    right: 140px;
    top: 20px;
    position: absolute;
    display: ${({ isActiveDeleteBtn }) =>
      isActiveDeleteBtn ? 'blick' : 'none'};
    width: 24px;
    height: 24px;
    background-image: url('/assets/image/icon_delete1.png');
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
  .searchBtnWrap {
    @media screen and (max-width: 1700px) {
      width: 100px;
      height: 50px;
    }
    position: absolute;
    top: 0;
    right: 0;
    width: 125px;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 210px;
    cursor: pointer;
    background: linear-gradient(#6690ff, #3366ff);
    border: 1.4px solid #5e86ff;
  }
  .searchBtn {
    @media screen and (max-width: 1700px) {
      width: 26px;
      height: 26px;
    }
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/icon_search2.png');
    background-size: cover;
    background-position: center;
    margin-right: 4px;
  }
  .searchBtnText {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
    }
    font-size: 24px;
    color: #ffffff;
  }
  .recommendBox {
    @media screen and (max-width: 1700px) {
      width: 70%;
    }
    max-width: 860px;
    width: 60%;
    padding: 51px 0 20px;
    position: absolute;
    left: 50%;
    top: 25px;
    transform: translateX(-50%);
    background-color: #f6f7fa;
    box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.15);
    border-radius: 0 0 10px 10px;
    z-index: 50;
  }
  .recommendBox li {
    height: 50px;
    padding: 12px 40px;
    cursor: pointer;
    font-size: 18px;
  }
`;
const LatestSearchWrap = styled.div`
  border-bottom: 2px solid #e7e7e7;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 20px;
    font-weight: bold;
    line-height: 29px;
    margin-bottom: 29px;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 24px;
    height: 44px;
  }
  li {
    width: 152px;
    height: 100%;
    background-color: #ebebeb;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    border-radius: 40px;
    font-size: 16px;
    color: #868686;
    cursor: pointer;
  }
  .allDelete {
    align-self: flex-end;
    width: 60px;
    margin-bottom: 26px;
    font-size: 15px;
    text-decoration: underline;
    cursor: pointer;
  }
`;
const SearchResultWrap = styled.div`
  margin-bottom: 218px;
  .ExplainWrap {
    @media screen and (max-width: 1700px) {
      font-size: 22px;
      width: 600px;
      height: 58px;
    }
    width: 676px;
    height: 66px;
    font-size: 30px;
    background-color: #ebf0ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 30px auto 37px;
  }
  .LikeBtnImgBox {
    width: 50px;
    height: 50px;
    background-image: url('/assets/image/likeBtnImg.png');
    background-size: cover;
    background-position: center;
    margin-right: 9px;
  }
  .ExplainWrap span {
    color: #3366ff;
    font-weight: bold;
  }
  .searchTop {
    margin-bottom: 30px;
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .searchTitleWrap {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .searchListNum {
    color: #868686;
  }
  .searchSort {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    color: #868686;
  }
  .searchList {
    @media screen and (max-width: 1700px) {
      gap: 21.33px;
      min-width: 1024px;
    }
    display: flex;
    flex-wrap: wrap;
    gap: 28px;
    list-style: none;
    padding: 0;
    margin: 0;
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
    @media screen and (max-width: 1700px) {
      left: 170px;
    }
    left: 350px;
    background-image: url('/assets/image/icon_page_arrow_left.png');
  }
  .pagenationArrow.right {
    @media screen and (max-width: 1700px) {
      right: 170px;
    }
    right: 350px;
    background-image: url('/assets/image/icon_page_arrow_right.png');
  }
`;
const TopSearchWrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 400px;
  }
  width: 520px;
  height: 316px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 144px auto;
  .title {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
      line-height: 32px;
    }
    width: 100%;
    font-size: 24px;
    line-height: 35px;
    color: #242424;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 24px;
  }
  .desc {
    @media screen and (max-width: 1700px) {
      ${({ searchKinds }) =>
        searchKinds === '약 이름'
          ? `
          height: 210px;
          gap: 15px;
          `
          : `gap: 18px 14px;`}
    }
    width: 100%;

    display: flex;
    ${({ searchKinds }) =>
      searchKinds === '약 이름'
        ? `
          flex-direction: column;
          height: 245px;
          gap: 25px;
          `
        : `gap: 1px 14px;`}
    flex-wrap: wrap;
  }
  .desc li {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
      width: ${({ searchKinds }) =>
        searchKinds === '약 이름' ? '200px' : 'auto'};
    }
    ${({ searchKinds }) =>
      searchKinds === '약 이름'
        ? `
          width: 251px;
          white-space: nowrap;
          font-size: 20px;
          line-height: 29px;
          overflow: hidden;
          text-overflow: ellipsis; 
          `
        : `
          background-color: #E7E7E7;
          padding: 6.5px 15px;
          height: 34px;
          border-radius: 20px;
          font-size: 16px;
          line-height: 23px;
          `}
    cursor: pointer;
  }
`;

export default Search;
