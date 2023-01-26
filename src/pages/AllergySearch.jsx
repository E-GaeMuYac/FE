import React, { useState } from 'react';
import { useCallback } from 'react';
import styled from 'styled-components';
import { userApi } from '../apis/apiInstance';
import MaterialList from '../contents/MaterialList';

const AllergySearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  //검색키워드
  const [keyword, setKeyword] = useState('');
  //자동완성 관련 state
  const [autoValueList, setAutoValueList] = useState([]);
  const [isRes, setIsRes] = useState(false);

  //검색결과
  const [result, setResult] = useState([]);

  //검색 버튼으로 검색 시
  const [inputValue, setInputValue] = useState('');

  //검색결과 수
  const [sumCount, setSumCount] = useState(0);

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
      console.log(res);
      setAutoValueList(res.data.rows);
      setIsRes(true);
    } catch (error) {
      setIsRes(false);
      console.log(error);
    }
  };

  const searchValue = useCallback(
    debounceFunction((value) => autoSearch(value), 200),
    []
  );

  const handleChange = (e) => {
    searchValue(e.target.value);
    setInputValue(e.target.value);
  };

  //검색 버튼 클릭 시
  const handleClick = async () => {
    setKeyword(inputValue);
    try {
      const res = await userApi.get(
        `/api/allergies/search?value=${inputValue}&page=1&pageSize=5`
      );
      console.log(res);
      setResult(res.data.rows);
      setSumCount(res.data.count);
      setIsRes(false);
    } catch (error) {
      console.log(error);
    }
  };

  //자동완성 리스트에서 1개 선택 시
  const pickSingleValue = async (e) => {
    const value = e.target.innerText;
    setKeyword(e.target.innerText);
    try {
      const res = await userApi.get(
        `/api/allergies/search?value=${value}&page=1&pageSize=5`
      );
      console.log(res);
      setResult(res.data.rows);
      setSumCount(res.data.count);
      setIsRes(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Wrapper>
      <Wrap>
        <InputWrap>
          <SearchInput
            placeholder='알레르기 성분을 검색하여 등록해보세요!'
            onChange={handleChange}
          />
          <BtnWrap>
            <SearchBtn type='button' onClick={handleClick}>
              <SearchIcon />
            </SearchBtn>
          </BtnWrap>
          {isRes ? (
            <AutoResult>
              {autoValueList ? (
                autoValueList.map((i) => (
                  <SingleResult onClick={pickSingleValue}>
                    {i.name}
                  </SingleResult>
                ))
              ) : (
                <SingleResult>검색결과가 없습니다</SingleResult>
              )}
            </AutoResult>
          ) : null}
        </InputWrap>
      </Wrap>
      <ResultSum>
        <SearchKeyword>'{keyword}'</SearchKeyword>
        <SearchSum> 검색결과 {sumCount}개</SearchSum>
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
      </ListWrap>
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

const InputWrap = styled.div`
  width: 860px;
  margin: 80px 0 70px 0;
  border-radius: 163px;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  z-index: 9999;
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
export default AllergySearch;
