import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { useGetSearchQuery } from '../query/searchQuery';

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
    for (let i = 0; i < searchLength; i++) {
      if ((i + 1) % 20 === 0) {
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
  const [searhArr, setSearhArr] = useState([]);

  //약 검색 종류 데이터 모음
  const [searchSortList, setSearchSortList] = useState(['약 이름', '약 분류']);
  const [searchKinds, setSearchKinds] = useState('약 이름');
  const [searchKindsCode, setSearchKindsCode] = useState('itemName');
  const [isOpenSearchSort, setIsOpenSearchSort] = useState(false);

  //약 검색 input 용 데이터모음
  const [inputValue, setInputValue] = useState('');
  const [searchedWord, setSearchedWord] = useState('');

  const [isActiveDeleteBtn, setIsActiveDeleteBtn] = useState(false);

  const [nowPageNum, setNowPageNum] = useState(1);

  const [searchLength, setSearchLength] = useState(0);

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

  // input에 글을 적을 때마다 실시간으로 저장
  const changeInputValue = ({ target: { value } }) => {
    setInputValue(value);
  };
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
  const doingSearch = () => {
    if (inputValue.trim()) {
      // 결과 창 단어 교체
      setSearchedWord(inputValue);
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
  return (
    <Wrap>
      <SearchBarWrap
        isOpenSearchSort={isOpenSearchSort}
        isActiveDeleteBtn={isActiveDeleteBtn}>
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
            placeholder=' 검색어를 입력해주세요.'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                doingSearch();
              }
            }}
          />
          <div className='deleteSearchInputValue'>
            <div
              className='deleteSearchInputValueBtn'
              onClick={deleteSearchValue}></div>
          </div>
          <div className='searchBtnWrap' onClick={doingSearch}>
            <div className='searchBtn'></div>
          </div>
        </div>
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
                검색 결과 {searchLength?.toLocaleString('ko-KR')}개
              </div>
            </div>
            <div className='searchSort'>찜한순</div>
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
      ) : null}
    </Wrap>
  );
};

const Wrap = styled.div`
  padding-top: 100px;
`;
const SearchBarWrap = styled.div`
  margin: 0 auto 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  .searchBar {
    @media screen and (max-width: 1440px) {
      width: 70%;
    }
    max-width: 860px;
    width: 60%;
    border: 1px solid #f6f7fa;
    background-color: #f6f7fa;
    border: none;
    border-radius: 60px;
    display: flex;
  }
  .searchSortWrap {
    @media screen and (max-width: 1440px) {
      font-size: 20px;
    }
    border-radius: 32px;
    background-color: white;
    border: 2px solid #f6f7fa;
    width: 158px;
    height: 62px;
    margin-right: 10px;
    font-size: 24px;
    position: relative;
  }
  .searchSortHeaderWrap {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
  }
  .searchSortList {
    @media screen and (max-width: 1440px) {
      font-size: 20px;
      width: 148px;
      height: 100px;
      gap: 10px;
    }
    display: ${({ isOpenSearchSort }) => (isOpenSearchSort ? 'flex' : 'none')};
    position: absolute;
    left: -3px;
    top: -2px;
    width: 158px;
    height: 110px;
    justify-content: center;
    /* align-items: center; */
    list-style: none;
    /* padding: 12px; */
    flex-direction: column;
    gap: 14px;
    background-color: white;
    border-radius: 32px;
    border: 2px solid #f6f7fa;
  }
  .searchSortList li {
    display: flex;
    gap: 10px;
    color: #868686;
    cursor: pointer;
    margin-left: -14px;
    @media screen and (max-width: 1440px) {
      margin-left: -13px;
    }
  }
  .searchSortList li.choice {
    color: #242424;
    margin-top: 1px;
    @media screen and (max-width: 1440px) {
      margin-top: 3px;
    }
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
    @media screen and (max-width: 1440px) {
      margin-top: -1px;
      margin-left: 0px;
    }
  }
  .searchinput {
    width: 475px;
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
    flex-grow: 1;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .deleteSearchInputValueBtn {
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
    width: 125px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 210px;
    cursor: pointer;
    background: linear-gradient(to left, #3366ff, #6690ff);
  }
  .searchBtn {
    width: 37px;
    height: 37px;
    background-image: url('/assets/image/icon_search2.png');
    background-size: cover;
    background-position: center;
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
    @media screen and (max-width: 1440px) {
      font-size: 24px;
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
    color: #868686;
  }
  .searchList {
    @media screen and (max-width: 1440px) {
      gap: 26px;
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

export default Search;
