import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Login = () => {
  const kakaoHandler = () => {
    const redirectUri = process.env.REACT_APP_REDIRECT_URI;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  };

  const naverHandler = () => {
    const redirectUri_n = process.env.REACT_APP_N_REDIRECT_URI;
    const clientId_n = process.env.REACT_APP_N_CLIENT_ID;
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId_n}&state=test&redirect_uri=${redirectUri_n}`;
  };

  // const { naver } = window;
  // const naverLogin = new naver.LoginWithNaverId({
  //   clientId: process.env.REACT_APP_N_CLIENT_ID,
  //   callbackUrl: process.env.REACT_APP_N_REDIRECT_URI,
  //   isPopup: false,
  //   loginButton: {
  //     color: 'green',
  //     type: 3,
  //     height: 50,
  //   },
  // });
  // console.log(process.env.REACT_APP_N_REDIRECT_URI);

  // useEffect(() => {
  //   naverLogin.init();
  // });

  return (
    <div>
      <BackGround>
        <Wrapper>
          <LoginWrapper>
            <LogoWrapper>LOGO 서비스 네임</LogoWrapper>
            <FormWrapper>
              <Input type='text' placeholder='아이디'></Input>
              <Input type='password' placeholder='패스워드'></Input>
              <SubmitBtn>로그인</SubmitBtn>
              <SaveId>
                <CheckBox type='checkbox' id='saveId' />
                <label for='saveId'>아이디 저장</label>
              </SaveId>
            </FormWrapper>
            <ManageAccount>
              <SignUp>회원가입</SignUp>
              <FindAccount>아이디 / 비밀번호 찾기</FindAccount>
            </ManageAccount>
            <SocialLogin>
              <SocialBtn type='button' onClick={kakaoHandler}>
                카카오로 로그인
              </SocialBtn>
              <SocialBtn type='button' onClick={naverHandler}>
                NAVER로 로그인
              </SocialBtn>
              <SocialBtn>GOOGLE로 로그인</SocialBtn>
            </SocialLogin>
          </LoginWrapper>
        </Wrapper>
      </BackGround>
    </div>
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
  border: 1px solid black;
  border-radius: 40px;
`;

const LoginWrapper = styled.div`
  width: 480px;
  height: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoWrapper = styled.div`
  width: 413px;
  height: 95px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  font-size: 35px;
  font-weight: 700;
`;

const FormWrapper = styled.div`
  width: 100%;
  height: 350px;
  margin-top: 30px;
`;

const Input = styled.input`
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

const SubmitBtn = styled.button`
  width: 100%;
  height: 70px;
  margin-top: 30px;
  background-color: #b7b7b7;
  color: white;
  font-size: 24px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
`;

const SaveId = styled.div`
  height: 35px;
  margin-top: 30px;
  display: flex;
  align-items: center;
`;

const CheckBox = styled.input`
  appearance: none;
  width: 25px;
  height: 25px;
  margin: 8px;
  display: inline-block;
  border: 3px solid #bcbcbc;
  border-radius: 3px;
  cursor: pointer;

  &:checked {
    width: 25px;
    height: 25px;
    margin: 8px;
    display: inline-block;
    background-color: #bcbcbc;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    cursor: pointer;
  }
`;

const ManageAccount = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 30px;
`;

const SignUp = styled(Link)`
  width: 90px;
  border-right: 2px solid #eaeaea;
  font-size: 16px;
  text-decoration: none;
  color: black;
`;

const FindAccount = styled(Link)`
  margin-left: 28px;
  font-size: 16px;
  text-decoration: none;
  color: black;
`;

const SocialLogin = styled.div`
  width: 100%;
  height: 150px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
`;

const SocialBtn = styled.button`
  width: 100%;
  height: 44px;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #e7e7e7;
  cursor: pointer;
`;
export default Login;
