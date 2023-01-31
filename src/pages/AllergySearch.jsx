import React, { useState, useEffect } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { userApi } from '../apis/apiInstance';
import MaterialList from '../contents/MaterialList';

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

const AllergySearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  //검색키워드
  const [keyword, setKeyword] = useState('');

  //자동완성 관련 state
  const [autoValueList, setAutoValueList] = useState([]);

  //검색결과
  const [result, setResult] = useState([]);

  //검색 버튼으로 검색 시
  const [inputValue, setInputValue] = useState('');

  //검색결과 수
  const [searchLength, setSearchLength] = useState(0);

  //현재페이지
  const [nowPageNum, setNowPageNum] = useState(1);

  const debounceFunction = (callback, delay) => {
    let timer;
    return (argument) => {
      // 실행한 함수(setTimeout())를 취소
      clearTimeout(timer);
      // delay가 지나면 callback 함수를 실행
      timer = setTimeout(() => callback(argument), delay);
    };
  };

  //자동완성
  const autoSearch = async (value) => {
    try {
      const res = await userApi.get(
        `/api/allergies/search?value=${value}&page=1&pageSize=8`
      );
      setAutoValueList(res.data.rows);
    } catch (error) {
      console.log(error);
    }
  };

  const searchValue = useCallback(
    debounceFunction((value) => autoSearch(value), 100),
    []
  );

  const handleChange = (e) => {
    searchValue(e.target.value);
    setInputValue(e.target.value);
  };

  useEffect(() => {
    keywordSearch();
    setInputValue('');
  }, [nowPageNum, keyword]);

  const keywordSearch = async () => {
    try {
      const res = await userApi.get(
        `/api/allergies/search?value=${keyword}&page=${nowPageNum}&pageSize=5`
      );
      setResult(res.data.rows);
      setSearchLength(res.data.count);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  //검색 버튼 클릭 시
  const handleClick = () => {
    setKeyword(inputValue);
    setNowPageNum(1);
  };

  //자동완성 리스트에서 1개 선택 시
  const pickSingleValue = async (e) => {
    setKeyword(e.target.innerText);
    setNowPageNum(1);
  };

  const handleEnter = (e) => {
    if (e.code === 'Enter') {
      setKeyword(inputValue);
    }
    setNowPageNum(1);
  };

  return (
    <Wrapper>
      <Header>
        <span>알레르기 등록</span>
      </Header>
      <Wrap>
        <InputWrap>
          <SearchInput
            placeholder='알레르기 성분을 검색하여 등록해보세요!'
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleEnter}
          />
          <BtnWrap>
            <SearchBtn type='button' onClick={handleClick}>
              <SearchIcon />
            </SearchBtn>
          </BtnWrap>
          {inputValue ? (
            <AutoResult>
              {autoValueList ? (
                autoValueList.map((autoValue) => (
                  <SingleResult onClick={pickSingleValue}>
                    {autoValue.name}
                  </SingleResult>
                ))
              ) : (
                <SingleResult>검색결과가 없습니다</SingleResult>
              )}
            </AutoResult>
          ) : null}
        </InputWrap>
      </Wrap>
      {keyword ? (
        <>
          <ResultSum>
            <SearchKeyword>'{keyword}'</SearchKeyword>
            <SearchSum> 검색결과 {searchLength}개</SearchSum>
          </ResultSum>
          <ListWrap>
            {result?.map((result) => (
              <MaterialList
                result={result}
                key={result.materialId}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            ))}
            <Pagenation
              searchLength={searchLength}
              nowPageNum={nowPageNum}
              setNowPageNum={setNowPageNum}
            />
          </ListWrap>
        </>
      ) : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrap = styled.div`
  width: 1380px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e7e7e7;
`;

const Header = styled.div`
  @media screen and (max-width: 1700px) {
    margin-bottom: 30px;
  }
  width: 100%;
  margin-bottom: 53px;
  display: flex;
  align-items: center;

  span {
    @media screen and (max-width: 1700px) {
      font-size: 26px;
    }
    font-size: 28px;
    font-weight: 700;
  }
`;

const InputWrap = styled.div`
  width: 860px;
  margin-bottom: 70px;
  border-radius: 163px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  z-index: 9998;
  position: relative;
`;

const SearchInput = styled.input`
  width: 730px;
  height: 65px;
  outline: none;
  border: none;
  border-top-left-radius: 163px;
  border-bottom-left-radius: 163px;
  background-color: #ffffff;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  text-indent: 30px;

  ::placeholder {
    color: #b7b7b7;
    font-size: 24px;
  }
`;

const BtnWrap = styled.div`
  width: 130px;
  height: 65px;
  background-color: white;
  border-bottom-right-radius: 210px;
  z-index: 9999;
`;

const SearchBtn = styled.button`
  width: 130px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 210px;
  box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  cursor: pointer;
  background: linear-gradient(to left, #3366ff, #6690ff);
`;

const SearchIcon = styled.div`
  width: 37px;
  height: 37px;
  background-image: url(/assets/image/icon_search2.png);
  background-size: cover;
  background-position: center;
`;

const AutoResult = styled.div`
  background-color: #f6f7fa;
  width: 860px;
  height: 470px;
  position: absolute;
  top: 40px;
  border-bottom-right-radius: 33px;
  border-bottom-left-radius: 33px;
  box-sizing: border-box;
  padding: 50px 40px 30px 40px;
`;

const SingleResult = styled.div`
  width: 100%;
  height: 50px;
  cursor: pointer;
`;

const ResultSum = styled.div`
  width: 1380px;
  margin: 25px 0;
`;

const ListWrap = styled.div`
  width: 1380px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SearchKeyword = styled.span`
  color: #242424;
  font-weight: bold;
  font-size: 20px;
`;

const SearchSum = styled.span`
  color: #868686;
  font-weight: bold;
  font-size: 20px;
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

export default AllergySearch;
