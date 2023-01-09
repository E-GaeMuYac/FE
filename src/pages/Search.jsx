import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { useGetSearchQuery } from '../query/searchQuery';

const Search = () => {
  const [searhArr, setSearhArr] = useState([]);

  //약 검색 종류 데이터 모음
  const [searchSortList, setSearchSortList] = useState([
    '약 이름',
    '약 효능',
    '약 분류',
  ]);
  const [searchKinds, setSearchKinds] = useState('약 이름');
  const [searchKindsCode, setSearchKindsCode] = useState('itemName');
  const [isOpenSearchSort, setIsOpenSearchSort] = useState(false);

  //약 검색 input 용 데이터모음
  const [inputValue, setInputValue] = useState('');
  const [searchedWord, setSearchedWord] = useState('');

  const [isActiveDeleteBtn, setIsActiveDeleteBtn] = useState(false);

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
  useEffect(() => {
    if (searchKinds === '약 이름') {
      setSearchKindsCode('itemName');
    } else if (searchKinds === '약 효능') {
      setSearchKindsCode('eeDocData');
    } else if (searchKinds === '약 분류') {
      setSearchKindsCode('productType');
    }
  }, [searchKinds]);

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

  //서치 훅 호출
  const [refetch, data] = useGetSearchQuery(searchKindsCode, searchedWord);

  //서치 시작
  const doingSearch = () => {
    if (inputValue.trim()) {
      // 결과 창 단어 교체
      setSearchedWord(inputValue);
    }
    deleteSearchValue();
  };

  // searchedWord가 변경될 때만 refetch
  useEffect(() => {
    if (searchedWord) {
      refetch();
    }
  }, [searchedWord]);

  // data가 undefined가 아닐 때 state 변경
  useEffect(() => {
    if (data) {
      setSearhArr(data.data);
    }
  }, [data]);

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
                    <div className='searchSortArrow'></div>
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
        </div>
        <div className='searchBtn' onClick={doingSearch}></div>
      </SearchBarWrap>
      <LatestSearchWrap>
        <div className='title'>최근검색어</div>
        <ul>
          <li>게보린</li>
          <li>게보린</li>
          <li>게보린</li>
        </ul>
        <div className='allDelete'>전체삭제</div>
      </LatestSearchWrap>
      {searchedWord ? (
        <SearchResultWrap>
          <div className='searchTop'>
            <div className='searchTitleWrap'>
              <div className='searchText'>'{searchedWord}'</div>
              <div className='searchListNum'>검색 결과 {searhArr.length}개</div>
            </div>
            <div className='searchSort'>추천순</div>
          </div>
          <ul className='searchList'>
            {searhArr.map((list) => (
              <SearchListWrap key={list.medicineId} image={list.itemImage}>
                <div className='listImg'></div>
                <div className='listName'>{list.itemName}</div>
                <div className='listSubTextWrap'>
                  <div className='listSubText'>{list.etcOtcCode}</div>
                  <hr />
                  <div className='listSubText'>{list.entpName}</div>
                </div>
                <div className='listTag'>{list.productType}</div>
                <div className='btnWrap'>
                  <div className='btnLike'>
                    <div className='btnLikeImg'></div>
                  </div>
                  <div className='btnInBox'>보관함 담기</div>
                </div>
              </SearchListWrap>
            ))}
          </ul>
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
    max-width: 860px;
    width: 60%;
    max-width: 860px;
    border: 1px solid #e7e7e7;
    background-color: #e7e7e7;
    border: none;
    border-radius: 60px;
    display: flex;
  }
  .searchSortWrap {
    border-radius: 32px;
    background-color: white;
    border: 2px solid #e7e7e7;
    width: 150px;
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
    display: ${({ isOpenSearchSort }) => (isOpenSearchSort ? 'flex' : 'none')};
    position: absolute;
    left: -2px;
    top: -2px;
    width: 121px;
    list-style: none;
    padding: 15px;
    margin: 0;
    flex-direction: column;
    gap: 14px;
    background-color: white;
    border-radius: 33px;
    border: 2px solid #e7e7e7;
  }
  .searchSortList li {
    display: flex;
    gap: 10px;
    color: #868686;
    cursor: pointer;
  }
  .searchSortList li.choice {
    color: #242424;
  }
  .searchSortArrow {
    width: 32px;
    height: 32px;
    background-image: url('/assets/image/arrow_down.png');
    background-size: cover;
    background-position: center;
  }
  .searchinput {
    width: 600px;
    font-size: 20px;
    font-weight: bold;
    line-height: 100%;
    background-color: transparent;
    outline: none;
    border: none;
  }
  .searchinput::placeholder {
    color: #868686;
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
  .searchBtn {
    width: 42px;
    height: 42px;
    background-image: url('/assets/image/icon_search.png');
    background-size: cover;
    background-position: center;
    cursor: pointer;
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
  margin-top: 118px;
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
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    list-style: none;
    padding: 0;
    margin: 0;
    margin-bottom: 218px;
  }
`;
const SearchListWrap = styled.li`
  padding: 30px 34px;
  width: 256px;
  height: 298px;
  border: 1px solid #d0d0d0;
  border-radius: 25px;
  display: flex;
  align-items: center;
  flex-direction: column;
  .listImg {
    width: 100%;
    height: 110px;
    background-image: ${({ image }) =>
      image
        ? `url(${image})`
        : `url('https://s3-alpha-sig.figma.com/img/917a/ce7b/9262f5da2e74cdc931cf2bd206ad200a?Expires=1673827200&Signature=nEazUdsurlwUoj0vV8Tq-wHew19d0LJCoEcz2EPKB-xjLVp79AHdcbWgefejMlP9tpKV8S~EwOrPsPFxVXXeEzt01PSwL5hO-4yymSZtPb24keioTp0nCQYVTjYgBARSpVryPiZEq9HSX-AT0VFy3vgFpRu-5bv0Mo0I1NJwFKP1kodqHMeLLbQOkbMg7KIvqczdsBgqTL0rrKtK6hBc9dhCPQq58sGHeN7dSdbFFjtKm3Uj61IKyvC476xpocW6bkp2buhdiroQKWNL-BkxrN7y0b~Pgh8JUfX86xIDGhpDNdFPlF-mhTRwE7mc~ooM2aqbfNcWAM59xBUjvF8maA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4')`};
    background-size: contain;
    background-position: center;
    margin-bottom: 24px;
    background-repeat: no-repeat;
  }
  .listSubTextWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    margin-bottom: 14px;
  }
  .listSubTextWrap hr {
    width: 2px;
    height: 100%;
    border: none;
    background-color: #d9d9d9;
    margin: 0 8px;
  }
  .listSubText {
    width: 126px;
    text-align: center;
    font-size: 15px;
    line-height: 22px;
    color: #868686;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .listName {
    font-size: 20px;
    line-height: 29px;
    font-weight: bold;
    margin-bottom: 22px;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .listTag {
    padding: 10px;
    border-radius: 5px;
    background-color: #ebebeb;
    font-size: 14px;
    font-weight: bold;
    line-height: 15px;
    margin-bottom: 18px;
  }
  .btnWrap {
    display: flex;
    align-items: center;
    gap: 14px;
    height: 38px;
  }
  .btnLike {
    width: 38px;
    height: 100%;
    background-color: #d9d9d9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btnLikeImg {
    width: 26px;
    height: 26px;
    background-image: url('/assets/image/icon_heart1.png');
    background-size: cover;
    background-position: center;
  }
  .btnInBox {
    width: 214px;
    height: 100%;
    background-color: #868686;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    line-height: 20px;
    font-weight: bold;
    cursor: pointer;
  }
`;

export default Search;
