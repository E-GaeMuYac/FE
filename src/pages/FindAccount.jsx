import React, { useState } from 'react';
import styled from 'styled-components';
import FindId from '../contents/FindId';
import FindPassword from '../contents/FindPassword';

const FindAccount = () => {
  const [isClicked, setIsClicked] = useState(true);

  return (
    <BackGround>
      <Wrapper>
        <SignupWrapper>
          <SignupInfo>
            <PrimarySpan>내 계정의 ID/PW 찾기</PrimarySpan>
            <SecondarySpan>
              내 계정 ID를 복구하려면 복구용 이메일 주소 또는 핸드폰 번호를
              입력하세요.
            </SecondarySpan>
          </SignupInfo>
          <BtnWrap>
            <FindIdBtn isClicked={isClicked} onClick={() => setIsClicked(true)}>
              아이디 찾기
            </FindIdBtn>
            <FindPwBtn
              isClicked={isClicked}
              onClick={() => setIsClicked(false)}>
              비밀번호 찾기
            </FindPwBtn>
          </BtnWrap>
          {isClicked ? <FindId /> : <FindPassword />}
        </SignupWrapper>
      </Wrapper>
    </BackGround>
  );
};

const BackGround = styled.div`
  min-height: 95vh;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebf0ff;
`;

const Wrapper = styled.div`
  width: 800px;
  padding: 60px 0;
  display: flex;
  justify-content: center;
  background-color: white;
  border-radius: 40px;
  box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.15);
`;

const SignupWrapper = styled.div`
  width: 480px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  input {
    border-bottom: 1px solid #919191;
    :focus {
      outline: none;
      box-shadow: none;
      border-bottom: 1px solid #919191;
    }
  }

  .successs {
    input {
      /* margin-top: 10px;
      height: 50px; */
      width: 350px;
      border: none;
      border-bottom: 1px solid #3366ff;
      border-radius: 0;
      :focus,
      :active {
        outline: none;
        box-shadow: none;
        border-color: #3366ff;
      }
    }
  }
  .errorr {
    input {
      /* margin-top: 10px;
      height: 50px; */
      width: 350px;
      border: none;
      border-bottom: 1px solid #919191;
      border-radius: 0;
      :focus,
      :active {
        outline: none;
        box-shadow: none;
      }
    }
  }
  .message {
    &.success {
      color: #3366ff;
    }
    &.error {
      color: #e71c1c;
    }
  }
  label {
    color: #919191;
  }
  .form-width {
    width: 100%;
    input {
      width: 100%;
    }
  }
  .mb-3 {
    margin-bottom: 0 !important;
  }
  .form-floating {
    text-indent: -10px;
  }
`;

const SignupInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const PrimarySpan = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #242424;
`;

const SecondarySpan = styled.span`
  font-size: 15px;
  color: #868686;
`;

const BtnWrap = styled.div`
  width: 480px;
  display: flex;
`;

const FindIdBtn = styled.button`
  width: 100%;
  height: 56px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  background-color: white;
  border-bottom: ${({ isClicked }) =>
    isClicked ? '4px solid #3366FF' : '2px solid #868686'};
  color: ${({ isClicked }) => (isClicked ? '#3366FF' : '#868686')};
`;

const FindPwBtn = styled.button`
  width: 100%;
  height: 56px;
  font-size: 20px;
  font-weight: bold;
  border: none;
  background-color: white;
  border-bottom: ${({ isClicked }) =>
    !isClicked ? '4px solid #3366FF' : '2px solid #868686'};
  color: ${({ isClicked }) => (!isClicked ? '#3366FF' : '#868686')};
`;

export default FindAccount;
