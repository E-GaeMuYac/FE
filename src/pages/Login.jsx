import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { useCookies } from 'react-cookie';

const Login = () => {
  const token = localStorage.getItem('accessToken');

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(['rememberEmail']);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(false);

  useEffect(() => {
    if (cookies.rememberEmail !== undefined) {
      setEmail(cookies.rememberEmail);
      setIsRemember(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  });

  const idHandler = (e) => {
    setEmail(e.target.value);
  };

  const pwHandler = (e) => {
    setPassword(e.target.value);
  };

  const checkboxHandler = (e) => {
    setIsRemember(e.target.checked);
    if (e.target.checked) {
      setCookie('rememberEmail', email);
    } else {
      removeCookie('rememberEmail');
    }
  };

  const loginHandler = (e) => {
    e.preventDefault();
    if (email === '' || password === '') {
      alert('아이디와 비밀번호를 모두 입력하세요!');
    } else {
      normalLogin({ email, password });
    }
  };

  const normalLogin = async ({ email, password }) => {
    try {
      const res = await api.post(`/api/users/login/normal`, {
        email,
        password,
      });
      const accesstoken = res.headers.accesstoken;
      const refreshtoken = res.headers.refreshtoken;
      localStorage.setItem('accessToken', accesstoken);
      localStorage.setItem('refreshToken', refreshtoken);
      navigate('/');
    } catch (e) {
      console.log(e);
      alert('로그인에 실패하였습니다.');
    }
  };

  const kakaoHandler = () => {
    window.location.href =
      process.env.REACT_APP_API_ENDPOINT + '/api/users/login/kakao';
  };

  const naverHandler = () => {
    window.location.href =
      process.env.REACT_APP_API_ENDPOINT + '/api/users/login/naver';
  };

  const googleHandler = () => {
    window.location.href =
      process.env.REACT_APP_API_ENDPOINT + '/api/users/login/google';
  };

  return (
    <div>
      <BackGround>
        <Wrapper>
          <LoginWrapper>
            <LogoWrapper />
            <FormWrapper>
              <Input
                type='email'
                placeholder='이메일'
                defaultValue={email}
                onChange={idHandler}></Input>
              <Input
                type='password'
                placeholder='패스워드'
                onChange={pwHandler}></Input>
              <SubmitBtn type='button' onClick={loginHandler}>
                로그인
              </SubmitBtn>
              <SaveId>
                <CheckBox
                  type='checkbox'
                  id='saveId'
                  checked={isRemember}
                  onChange={checkboxHandler}
                />
                <label htmlFor='saveId'>아이디 저장</label>
              </SaveId>
            </FormWrapper>
            <ManageAccount>
              <SignUp to='/signup'>회원가입</SignUp>
              <FindAccount to='/findaccount'>
                아이디 / 비밀번호 찾기
              </FindAccount>
            </ManageAccount>
            <SocialLogin>
              <KakaoBtn type='button' onClick={kakaoHandler}>
                <div />
                카카오로 로그인
              </KakaoBtn>
              <NaverBtn type='button' onClick={naverHandler}>
                <div />
                네이버로 로그인
              </NaverBtn>
              <GoogleBtn type='button' onClick={googleHandler}>
                <div />
                Google로 로그인
              </GoogleBtn>
            </SocialLogin>
          </LoginWrapper>
        </Wrapper>
      </BackGround>
    </div>
  );
};

const BackGround = styled.div`
  min-height: 96vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebf0ff;
`;
const Wrapper = styled.div`
  @media screen and (max-width: 1700px) {
    width: 590px;
    height: 620px;
  }
  width: 800px;
  height: 820px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 2px 2px 32px rgba(10, 32, 98, 0.15);
  border-radius: 40px;
`;

const LoginWrapper = styled.div`
  @media screen and (max-width: 1700px) {
    width: 350px;
    height: 480px;
  }
  width: 480px;
  height: 680px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const LogoWrapper = styled.div`
  @media screen and (max-width: 1700px) {
    background-size: 70%;
  }
  background-image: url('/assets/image/pillnutsLogo.png');
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 343px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
`;

const FormWrapper = styled.form`
  @media screen and (max-width: 1700px) {
    height: 240px;
    margin-top: 13px;
  }
  width: 100%;
  height: 350px;
  margin-top: 30px;
`;

const Input = styled.input`
  @media screen and (max-width: 1700px) {
    height: 35px;
    font-size: 16px;
    margin-top: 15px;
  }
  width: 100%;
  height: 50px;
  margin-top: 30px;
  border: none;
  border-bottom: 1px solid #919191;
  text-indent: 10px;
  font-size: 20px;
  ::placeholder {
    @media screen and (max-width: 1700px) {
      font-size: 16px;
    }
    color: #919191;
    font-size: 18px;
  }
  &:focus {
    outline: none;
  }
`;

const SubmitBtn = styled.button`
  @media screen and (max-width: 1700px) {
    height: 50px;
    font-size: 20px;
    margin-top: 22px;
  }
  width: 100%;
  height: 70px;
  margin-top: 30px;
  background-color: #3366ff;
  color: white;
  font-size: 24px;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
`;

const SaveId = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: 8px;
    font-size: 15px;
  }
  height: 35px;
  margin-top: 30px;
  display: flex;
  align-items: center;

  label {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
    }
    font-size: 16px;
    color: #868686;
    font-weight: 400;
  }
`;

const CheckBox = styled.input`
  @media screen and (max-width: 1700px) {
    width: 22px;
    height: 22px;
  }
  appearance: none;
  width: 25px;
  height: 25px;
  margin-right: 8px;
  display: inline-block;
  border: 2px solid #bcbcbc;
  border-radius: 3px;
  cursor: pointer;

  &:checked {
    @media screen and (max-width: 1700px) {
      width: 22px;
      height: 22px;
    }
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
  @media screen and (max-width: 1700px) {
    top: 298px;
  }
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 465px;
  left: 0;
`;

const SignUp = styled(Link)`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
  }
  width: 90px;
  border-right: 2px solid #eaeaea;
  font-size: 16px;
  text-decoration: none;
  color: black;
`;

const FindAccount = styled(Link)`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
    margin-left: 30px;
  }
  margin-left: 28px;
  font-size: 16px;
  text-decoration: none;
  color: black;
`;

const SocialLogin = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: 55px;
  }
  width: 100%;
  height: 150px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
`;

const KakaoBtn = styled.button`
  @media screen and (max-width: 1700px) {
    margin-top: 5px;
    height: 40px;
    font-size: 15px;
  }
  width: 100%;
  height: 44px;
  position: relative;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #fee500;
  color: #242424;
  cursor: pointer;

  div {
    @media screen and (max-width: 1700px) {
      left: 10px;
    }
    background-image: url('/assets/image/카카오로고.png');
    background-size: cover;
    background-position: center;
    width: 22px;
    height: 22px;
    position: absolute;
    border-radius: 50%;
    top: 10px;
    left: 12px;
  }
`;

const NaverBtn = styled.button`
  @media screen and (max-width: 1700px) {
    height: 40px;
    font-size: 15px;
  }
  width: 100%;
  height: 44px;
  position: relative;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #03c75a;
  color: #242424;
  cursor: pointer;

  div {
    @media screen and (max-width: 1700px) {
      left: 5px;
    }
    background-image: url('/assets/image/네이버로고.png');
    background-size: cover;
    background-position: center;
    width: 34px;
    height: 34px;
    position: absolute;
    border-radius: 50%;
    top: 3px;
    left: 7px;
  }
`;

const GoogleBtn = styled.button`
  @media screen and (max-width: 1700px) {
    height: 40px;
    font-size: 15px;
  }
  width: 100%;
  height: 44px;
  position: relative;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #4285f4;
  color: #242424;
  cursor: pointer;

  div {
    @media screen and (max-width: 1700px) {
      width: 28px;
      height: 28px;
      top: 6px;
      left: 7px;
    }
    background-image: url('/assets/image/구글로고.png');
    background-size: center;
    background-position: center;
    width: 30px;
    height: 30px;
    position: absolute;
    border-radius: 50%;
    top: 5px;
    left: 9px;
  }
`;
export default Login;
