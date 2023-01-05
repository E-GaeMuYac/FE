import React from 'react';
import styled from 'styled-components';

const Signup = () => {
  return (
    <BackGround>
      <Wrapper>
        <SignupWrapper>
          <SignupInfo>
            <PrimarySpan>서비스 계정 만들기</PrimarySpan>
            <SecondarySpan>계정으로 사용할 이메일을 입력하세요.</SecondarySpan>
          </SignupInfo>
          <CombinedForm>
            <InputSt type='text' placeholder='이메일'></InputSt>
            <ButtonSt>인증번호 발송</ButtonSt>
          </CombinedForm>
          <CombinedForm>
            <InputSt
              type='text'
              placeholder='인증번호를 입력해주세요'></InputSt>
            <ButtonSt>인증번호 확인</ButtonSt>
          </CombinedForm>
          <PwInput type='password' placeholder='비밀번호'></PwInput>
          <PwInput type='password' placeholder='비밀번호 확인'></PwInput>
          <CombinedForm>
            <InputSt type='text' placeholder='닉네임'></InputSt>
            <ButtonSt>중복확인</ButtonSt>
          </CombinedForm>
          <NavBtnWrapper>
            <NavBtn>뒤로</NavBtn>
            <NavBtn>다음</NavBtn>
          </NavBtnWrapper>
        </SignupWrapper>
      </Wrapper>
    </BackGround>
  );
};

const BackGround = styled.div`
  min-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebebeb;
`;

const Wrapper = styled.div`
  width: 800px;
  height: 820px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 40px;
`;

const SignupWrapper = styled.div`
  width: 480px;
  height: 660px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 16px;
  color: #868686;
`;

const CombinedForm = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 30px;
`;

const InputSt = styled.input`
  width: 360px;
  height: 50px;
  border: none;
  border-bottom: 1px solid #919191;
  text-indent: 10px;
  text-shadow: 0 0 0 black;
  font-size: 20px;
  color: transparent;
  ::placeholder {
    color: #919191;
    font-size: 20px;
  }
  &:focus {
    outline: none;
  }
`;

const ButtonSt = styled.button`
  width: 111px;
  height: 35px;
  border: none;
  border-radius: 50px;
  margin-left: 5px;
  background-color: #e7e7e7;
  color: #868686;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const PwInput = styled.input`
  width: 100%;
  height: 50px;
  margin-top: 30px;
  border: none;
  border-bottom: 1px solid #919191;
  text-indent: 10px;
  text-shadow: 0 0 0 black;
  font-size: 20px;
  color: transparent;
  ::placeholder {
    color: #919191;
    font-size: 20px;
  }
  &:focus {
    outline: none;
  }
`;

const NavBtnWrapper = styled.div`
  width: 100%;
  margin-top: 105px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NavBtn = styled.button`
  width: 228px;
  height: 44px;
  border: none;
  border-radius: 50px;
  background-color: #e7e7e7;
  cursor: pointer;
`;
export default Signup;
