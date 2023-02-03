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
  const pickSingleValue = (e) => {
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
          <div className='wrap'>
            <SearchInput
              placeholder='알레르기 성분을 검색하여 등록해보세요!'
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            <SearchBtn type='button' onClick={handleClick}>
              <SearchIcon />
              <span>검색</span>
            </SearchBtn>
          </div>
          {inputValue ? (
            <AutoResult text={inputValue}>
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
      ) : (
        <GuideWrap>
          <GuideBox>
            <GuideTop>
              <button type='button' onClick={pickSingleValue}>
                아세트아미노펜
              </button>
              <div />
              <h3>
                알레르기 등록 후에
                <br />
                <span>게보린</span>을 검색해보세요!
              </h3>
            </GuideTop>
            <GuideBottom>테스트를 위한 가이드입니다!</GuideBottom>
          </GuideBox>
        </GuideWrap>
      )}
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
  @media screen and (max-width: 1700px) {
    min-width: 1024px;
  }
  width: 100%;
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
  @media screen and (max-width: 1700px) {
    width: 70%;
  }
  width: 860px;
  margin-bottom: 70px;
  border-radius: 163px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  z-index: 9999;
  position: relative;

  .wrap {
    position: relative;
    z-index: 9999;
  }
`;

const SearchInput = styled.input`
  @media screen and (max-width: 1700px) {
    height: 50px;
    font-size: 16px;
    width: 670px;
  }
  width: 860px;
  height: 65px;
  outline: none;
  border: none;
  border-radius: 163px;
  text-indent: 30px;
  background-color: #f6f7fa;

  &:focus {
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.15);
    background-color: white;
  }

  ::placeholder {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    color: #b7b7b7;
    font-size: 24px;
  }
`;

const SearchBtn = styled.button`
  @media screen and (max-width: 1700px) {
    width: 110px;
    height: 50px;
  }
  width: 130px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 210px;
  box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.15);
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  background: linear-gradient(to left, #3366ff, #6690ff);
  span {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
      margin-top: -2px;
    }
    font-size: 24px;
    font-weight: 500;
    color: #ffffff;
    margin-left: 5px;
    margin-top: -3px;
  }
`;

const SearchIcon = styled.div`
  @media screen and (max-width: 1700px) {
    width: 26px;
    height: 26px;
  }
  width: 37px;
  height: 37px;
  background-image: url(/assets/image/searchIcon.png);
  background-size: cover;
  background-position: center;
`;

const AutoResult = styled.div`
  @media screen and (max-width: 1700px) {
    width: 670px;
    height: 360px;
    padding: 30px 35px;
  }
  background-color: #f6f7fa;
  width: 860px;
  height: 470px;
  position: absolute;
  top: 30px;
  border-bottom-right-radius: 33px;
  border-bottom-left-radius: 33px;
  box-sizing: border-box;
  padding: 50px 40px 30px 40px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
`;

const SingleResult = styled.div`
  @media screen and (max-width: 1700px) {
    height: 40px;
  }
  width: 100%;
  height: 50px;
  cursor: pointer;
`;

const ResultSum = styled.div`
  width: 100%;
  margin: 25px 0;
`;

const ListWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SearchKeyword = styled.span`
  @media screen and (max-width: 1700px) {
    font-size: 18px;
  }
  color: #242424;
  font-weight: bold;
  font-size: 20px;
`;

const SearchSum = styled.span`
  @media screen and (max-width: 1700px) {
    font-size: 18px;
  }
  color: #868686;
  font-weight: bold;
  font-size: 20px;
`;

const GuideWrap = styled.div`
  width: 860px;
  height: 70vh;
  display: flex;
  align-items: center;
`;
const GuideBox = styled.div`
  width: 100%;
  height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const GuideTop = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    width: 144px;
    height: 43px;
    border-radius: 40px;
    background-color: #f6f7fa;
    font-size: 16px;
    font-weight: medium;
    border: none;
  }

  div {
    width: 229px;
    height: 24px;
    background-image: url('/assets/image/LongArrow.png');
    background-size: cover;
  }

  h3 {
    font-size: 35px;
  }

  span {
    color: #3366ff;
    font-weight: bold;
  }
`;

const GuideBottom = styled.span`
  font-size: 16px;
  color: #868686;
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
