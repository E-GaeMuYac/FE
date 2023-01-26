import React, { useState } from 'react';
import styled from 'styled-components';
import { userApi } from '../apis/apiInstance';

const MaterialList = (props) => {
  const { result, isOpen, setIsOpen } = props;

  const [isToggle, setIsToggle] = useState(result.allergy);

  const toggleMaterial = async (materialId) => {
    try {
      const res = await userApi.put(`/api/allergies/${materialId}`);
      console.log(res);
      alert(res.data.msg);
      if (res.data.msg === '알러지 등록에 성공하였습니다.') {
        setIsToggle(true);
      } else {
        setIsToggle(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ResultWrap>
      {result.materialId === isOpen ? (
        <MoreInfoWrap>
          <MoreInfoList key={result.materialId}>
            <PillTitle>{result.name}</PillTitle>
            <FoldBtn
              onClick={() => {
                setIsOpen(false);
              }}
            />
            {isToggle ? (
              <CancelBtn onClick={() => toggleMaterial(result.materialId)}>
                등록 해제
              </CancelBtn>
            ) : (
              <SelectBtn onClick={() => toggleMaterial(result.materialId)}>
                알레르기 등록
              </SelectBtn>
            )}
          </MoreInfoList>
          <MoreInfoContent>{result.content}</MoreInfoContent>
        </MoreInfoWrap>
      ) : (
        <ResultList key={result.materialId}>
          <PillTitle>{result.name}</PillTitle>
          <MoreBtn
            onClick={() => {
              setIsOpen(result.materialId);
            }}
          />
          {isToggle ? (
            <CancelBtn onClick={() => toggleMaterial(result.materialId)}>
              등록 해제
            </CancelBtn>
          ) : (
            <SelectBtn onClick={() => toggleMaterial(result.materialId)}>
              알레르기 등록
            </SelectBtn>
          )}
        </ResultList>
      )}
    </ResultWrap>
  );
};

const ResultWrap = styled.div`
  width: 1380px;
  display: flex;
  flex-direction: column;
`;

const ResultList = styled.div`
  background-color: white;
  width: 100%;
  height: 95px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  position: relative;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
`;

const PillTitle = styled.span`
  color: #242424;
  font-weight: bold;
  font-size: 24px;
`;

const SelectBtn = styled.button`
  width: 130px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background-color: #ffecea;
  color: #ff392b;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CancelBtn = styled.button`
  width: 130px;
  height: 44px;
  border-radius: 10px;
  border: none;
  background-color: #ff392b;
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
`;

const MoreBtn = styled.div`
  background-image: url('/assets/image/arrow_down_big.png');
  background-size: cover;
  width: 50px;
  height: 50px;
  position: absolute;
  right: 230px;
`;

const MoreInfoWrap = styled.div`
  width: 100%;
  height: 316px;
  border-radius: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.15);
`;

const MoreInfoList = styled.div`
  width: 100%;
  height: 120px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px;
  position: relative;
`;

const MoreInfoContent = styled.div`
  background-color: #f6f7fa;
  width: 100%;
  height: 196px;
  box-sizing: border-box;
  padding: 40px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: #242424;
  font-size: 24px;
`;

const FoldBtn = styled.div`
  background-image: url('/assets/image/arrow_up_big.png');
  background-size: cover;
  width: 50px;
  height: 50px;
  position: absolute;
  right: 230px;
`;

export default MaterialList;
