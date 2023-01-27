import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { userApi } from '../apis/apiInstance';

const Allergy = () => {
  const navigate = useNavigate();

  //내 알러지 성분
  const [myAllergy, setMyAllergy] = useState([]);

  //성분 설명 여닫기
  const [isOpen, setIsOpen] = useState(0);

  const getAllergyList = async () => {
    try {
      const res = await userApi.get('/api/allergies/user');
      console.log(res);
      setMyAllergy(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllergyList();
  }, []);

  const toggleMaterial = async (materialId) => {
    try {
      const res = await userApi.put(`/api/allergies/${materialId}`);
      console.log(res);
      alert(res.data.msg);
      getAllergyList();
    } catch (error) {
      console.log(error);
    }
  };

  //   const arrowHandler = (a) => {
  //     setIsOpen(a);
  //   };

  return (
    <Wrapper>
      {myAllergy.length > 0 ? (
        <AllergyListWrap>
          <ModalBtnWrap>
            <ModalOpenBtn type='button' onClick={() => navigate('/allergy')}>
              알레르기 등록
              <div />
            </ModalOpenBtn>
          </ModalBtnWrap>
          <Listsum>
            <Title>내가 등록한 알레르기 성분</Title>
            <Count>{myAllergy.length}개</Count>
          </Listsum>
          <ListWrap>
            {myAllergy.map((result) => (
              <>
                {result.materialId === isOpen ? (
                  <MoreInfoWrap>
                    <MoreInfoList key={result.materialId}>
                      <PillTitle>{result.name}</PillTitle>
                      <FoldBtn
                        key={result.materialId}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                      />
                      <CancelBtn
                        onClick={() => toggleMaterial(result.materialId)}>
                        등록 해제
                      </CancelBtn>
                    </MoreInfoList>
                    <MoreInfoContent>
                      {result.content !== null
                        ? result.content
                        : '추가 정보 없음'}
                    </MoreInfoContent>
                  </MoreInfoWrap>
                ) : (
                  <ResultList key={result.materialId}>
                    <PillTitle>{result.name}</PillTitle>
                    <MoreBtn onClick={() => setIsOpen(result.materialId)} />
                    <CancelBtn
                      onClick={() => toggleMaterial(result.materialId)}>
                      등록 해제
                    </CancelBtn>
                  </ResultList>
                )}
              </>
            ))}
          </ListWrap>
        </AllergyListWrap>
      ) : (
        <NoneListWrap>
          <NoneBtnWrap>
            <span>등록된 알레르기 성분이 없습니다.</span>
            <ModalOpenBtn type='button' onClick={() => navigate('/allergy')}>
              알레르기 등록
              <div />
            </ModalOpenBtn>
          </NoneBtnWrap>
          <GuideWrap>
            <GuideComment>
              <h2>약 알레르기가 있으신가요?</h2>
              <span>알레르기를 유발한 성분을 등록해보세요.</span>
            </GuideComment>
            <ExampleTitle>알레르기 포함 의약품 예시</ExampleTitle>
            <ExampleBox>
              <FirstCard />
              <SecondCard />
            </ExampleBox>
          </GuideWrap>
        </NoneListWrap>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const AllergyListWrap = styled.div`
  width: 100%;
  padding: 50px 0px;
  display: flex;
  flex-direction: column;
`;

const ModalBtnWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ModalOpenBtn = styled.div`
  width: 216px;
  height: 58px;
  border-radius: 10px;
  background-color: #ffecea;
  color: #ff392b;
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    background-image: url('/assets/image/add_btn_red.png');
    background-size: cover;
    width: 32px;
    height: 32px;
  }
`;

const Listsum = styled.div`
  width: 100%;
  padding: 30px 0px;
  display: flex;
  justify-content: flex-start;
`;

const Title = styled.span`
  color: #242424;
  font-size: 24px;
  font-weight: bold;
`;

const Count = styled.span`
  color: #868686;
  font-size: 24px;
  font-weight: bold;
  text-indent: 10px;
`;

const ListWrap = styled.div`
  width: 1380px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ResultList = styled.div`
  background-color: white;
  width: 100%;
  height: 120px;
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

const MoreBtn = styled.div`
  background-image: url('/assets/image/arrow_down_big.png');
  background-size: cover;
  width: 50px;
  height: 50px;
  position: absolute;
  right: 230px;
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

const NoneListWrap = styled.div`
  width: 100%;
  padding: 30px 0px 100px 0;
`;

const NoneBtnWrap = styled.div`
  width: 100%;
  height: 328px;
  padding: 60px;
  border-radius: 25px;
  border: 2px dashed #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  span {
    font-size: 24px;
    color: #868686;
    font-weight: bold;
  }
`;

const GuideWrap = styled.div`
  width: 100%;
`;

const GuideComment = styled.div`
  width: 100%;
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    color: #242424;
    font-size: 36px;
    font-weight: bold;
  }
  span {
    color: #868686;
    font-size: 24px;
    font-weight: bold;
  }
`;

const ExampleTitle = styled.div`
  width: 100%;
  margin: 60px 0 0 40px;
  color: #868686;
  font-size: 20px;
  font-weight: bold;
`;

const ExampleBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
`;

const FirstCard = styled.div`
  background-image: url('/assets/image/example_1.png');
  background-size: contain;
  width: 930px;
  height: 485px;
`;

const SecondCard = styled.div`
  background-image: url('/assets/image/example_2.png');
  background-size: cover;
  width: 380px;
  height: 485px;
`;
export default Allergy;
