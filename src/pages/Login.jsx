import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { useCookies } from 'react-cookie';

const Login = (props) => {
  const setIsToken = props.setistoken;
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
      alert(res.data.msg);
      setIsToken(true);
      navigate('/');
    } catch (e) {
      console.log(e);
      alert('로그인에 실패하였습니다.');
    }
  };

  return (
    <div>
      <BackGround>
        <Wrapper>
          <LoginWrapper>
            <LogoWrapper>LOGO 서비스 네임</LogoWrapper>
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
              <SignUp>회원가입</SignUp>
              <FindAccount>아이디 / 비밀번호 찾기</FindAccount>
            </ManageAccount>
            <SocialLogin>
              <KakaoBtn>
                <div />
                카카오로 로그인
              </KakaoBtn>
              <NaverBtn>
                <div />
                네이버로 로그인
              </NaverBtn>
              <GoogleBtn>
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
  box-shadow: 2px 2px 32px #bdbcbc;
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

const FormWrapper = styled.form`
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
  background-color: #13bd7e;
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

const KakaoBtn = styled.button`
  width: 100%;
  height: 44px;
  position: relative;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #fee500;
  cursor: pointer;

  div {
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
  width: 100%;
  height: 44px;
  position: relative;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #03c75a;
  cursor: pointer;

  div {
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
  width: 100%;
  height: 44px;
  position: relative;
  margin-top: 10px;
  border: none;
  border-radius: 50px;
  background-color: #4285f4;
  cursor: pointer;

  div {
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
