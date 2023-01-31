import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGetLikeQuery } from '../query/likeQuery';
import ProductList from '../components/common/productList';

const MyLikeList = () => {
  const [likeList, setLikeList] = useState([]);

  const { data } = useGetLikeQuery();

  useEffect(() => {
    if (data) {
      setLikeList(data.data);
    }
  }, [data]);
  return (
    <>
      <LikelistHeader>
        <span className='title'>'나의 찜'</span>
        <span className='sum'>총 {likeList.length}개</span>
      </LikelistHeader>
      <LikeList>
        {likeList.map((list) => (
          <ProductList key={list.medicineId} list={{ ...list, dibs: true }} />
        ))}
      </LikeList>
    </>
  );
};

const LikelistHeader = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;

  .title {
    font-size: 20px;
    font-weight: 700;
  }

  .sum {
    font-size: 20px;
    font-weight: 700;
    text-indent: 15px;
    color: #868686;
  }
`;

const LikeList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 218px;
`;
export default MyLikeList;
