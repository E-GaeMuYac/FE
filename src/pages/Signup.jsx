import axios, { AxiosError } from 'axios';
import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { postSignup } from '../query/signupQuery';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  // 기본 input 상태값
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  // 유효성 검사 문구
  const [emailMessage, setEmailMessage] = useState('');
  const [emailCodeConfirmMessage, setEmailCodeConfirmMessage] = useState('');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [phoneCodeConfirmMessage, setPhoneCodeConfirmMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');

  // input 양식 유효성 검사 통과 여부(에 따라 문구 색상 등 지정)
  const [isEmail, setIsEmail] = useState(false);
  const [isEmailCode, setIsEmailCode] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [isPhoneCode, setIsPhoneCode] = useState(false);
  const [isNickname, setIsNickname] = useState(false);

  // 이메일, 휴대폰번호 인증코드
  const [responseEmailCode, setResponseEmailCode] = useState();
  const [responsePhoneCode, setResponsePhoneCode] = useState();
  const [errorEmailCode, setErrorEmailCode] = useState();

  // 유효성 검사 통과 시 인증버튼 라벨 변경
  const [emailCodeBtnLabel, setEmailCodeBtnLabel] = useState('중복확인');
  const [phoneCodebtnLabel, setPhoneCodebtnLabel] = useState('인증번호 전송');

  // 유효성 검사 통과 시 인증버튼 활성화
  const [emailCodeBtn, setEmailCodeBtn] = useState(false);
  const [emailCodeConfirmBtn, setEmailCodeConfirmBtn] = useState(false);
  const [phoneCodeBtn, setPhoneCodeBtn] = useState(false);
  const [phoneCodeConfirmBtn, setPhoneCodeConfirmBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyEmailCode, setReadOnlyEmailCode] = useState(false);
  const [readOnlyPhoneCode, setReadOnlyPhoneCode] = useState(false);
  const [readOnlyPhoneNumber, setReadOnlyPhoneNumber] = useState(false);

  const [emailBtnColor, setEmailBtnColor] = useState('#8bc790');
  const [emailCodeBtnColor, setEmailCodeBtnColor] = useState('#8bc790');

  // 이메일 중복확인 api 호출 함수
  const getVerifyEmail = async (params) => {
    try {
      const data = await api.get(
        `/api/users/signup?email=${params.queryKey[1]}`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError)
        // console.log(error.response?.status);
        // console.log(error);
        setErrorEmailCode(error.response?.status);
    }
  };

  // query hooks

  // 이메일 중복확인 query hook
  const useGetVerifyEmailQuery = (email) => {
    const { isSuccess, isError, isLoading, isFetching, data, error } = useQuery(
      {
        // query 키
        queryKey: ['getVerifyEmail', email],
        // query 함수
        queryFn: (params) => {
          return getVerifyEmail(params);
        },
        // 자동 랜더링 삭제
        // enabled: true,
        // 자동 리랜더링 삭제
        refetchOnWindowFocus: false,
      }
    );
    // if (isFetching) {
    //   console.log('fetching...');
    // }
    // if (isLoading) {
    //   console.log('loading...');
    // }
    // if (isError) {
    //   console.log('error', error);
    // }
    // if (isSuccess) {
    //   console.log('success', data);
    // }
    return data;
  };

  // 이메일 주소 입력
  const data = useGetVerifyEmailQuery(email);

  const onChangeEmail = (e) => {
    const emailRegExp =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegExp.test(emailCurrent)) {
      setEmailMessage('올바른 형식의 이메일을 입력해 주세요.');
      setIsEmail(false);
      // setEmailBtnColor('#8bc790');
      // setEmailCodeBtnLabel('인증번호 전송');
      setEmailCodeBtn(false);
    } else {
      setEmailMessage('이메일 중복 확인이 필요합니다.');
      setEmailCodeBtnLabel('중복확인');
      setIsEmail(false);
      setEmailCodeBtn(true);
      // setEmailBtnColor('#4fc759');
    }
  };

  // 이메일 인증번호 전송 api 호출 함수
  const postSendEmailCode = async (payload) => {
    const header = { 'x-api-key': process.env.REACT_APP_EMAIL_X_API_KEY };
    try {
      const data = await axios.post(
        'https://vns95wu8w0.execute-api.ap-northeast-2.amazonaws.com/default/email-HelloWorldFunction-tNcmw2rS5dhV',
        { email: payload.email }, //data(req.body)
        {
          headers: header,
        } //config
      );
      // console.log('인증번호 전송 성공', data);
      // console.log('인증번호', data.data.body.code);
      setResponseEmailCode(data.data.body.code);
    } catch (error) {
      return error;
    }
  };

  // 이메일 중복확인 및 인증번호 전송 버튼
  const onClickIsSendEmailCode = (e) => {
    e.preventDefault();
    if (emailCodeBtnLabel === '중복확인') {
      setEmailCodeBtn(true);
      if (data?.status === 200) {
        setEmailMessage('사용 가능한 이메일입니다. 이메일을 인증해 주세요.');
        setIsEmail(true);
        setEmailCodeBtn(true);
        setEmailCodeBtnLabel('인증번호 전송');
        // alert('인증번호가 전송되었습니다. 이메일을 확인해 주세요.');
        // postSendEmailCode({ email: email });
        setEmailCode('');
        setEmailCodeConfirmMessage('');
      } else if (errorEmailCode === 412) {
        setEmailMessage('이미 존재하는 이메일입니다. 다시 시도해 주세요.');
        setIsEmail(false);
        setEmailCodeBtn(false);
      }
    }
    if (
      emailCodeBtnLabel === '인증번호 전송' ||
      emailCodeBtnLabel === '인증번호 재전송'
    ) {
      alert('인증번호가 전송되었습니다. 이메일을 확인해 주세요.');
      postSendEmailCode({ email: email });
      setEmailCodeBtnLabel('인증번호 재전송');
      // setEmailCode('');
      // setEmailCodeConfirmMessage('');
    }
  };

  // 이메일 인증번호 입력
  const onChangeEmailCodeConfirm = (e) => {
    const emailCodeRegExp = /[0-9]{6}$/g;
    const emailCodeCurrent = e.target.value;
    setEmailCode(emailCodeCurrent);

    if (!emailCodeRegExp.test(emailCodeCurrent)) {
      setEmailCodeConfirmMessage('인증번호 숫자 6자리를 입력해 주세요.');
      setIsEmailCode(false);
      setEmailCodeConfirmBtn(false);
      // setEmailCodeBtnColor('#8bc790');
      setEmailCode(emailCodeCurrent);
    } else {
      setEmailCodeConfirmMessage('');
      setIsEmailCode(true);
      setEmailCodeConfirmBtn(true);
      // setEmailCodeBtnColor('#4fc759');
    }
  };

  // 이메일 인증번호 입력 후 인증번호 확인 버튼
  const onClickIsConfirmEmailCode = (e) => {
    if (Number(responseEmailCode) === Number(emailCode)) {
      alert('이메일 인증이 완료되었습니다.');
      // setEmailCode('');
      setEmailCodeConfirmMessage('인증 완료!');
      setEmailCodeConfirmBtn(false);
      setReadOnlyEmailCode(!readOnlyEmailCode);
      setEmailCodeBtn(false);
      setEmailCodeBtnLabel('중복확인');
      setEmailMessage('');
    } else {
      setEmailCodeConfirmMessage('인증번호가 틀렸습니다. 다시 입력해 주세요.');
      setIsEmailCode(false);
    }
    if (!responseEmailCode) {
      setEmailCodeConfirmMessage(
        '전송된 인증번호가 없습니다. 인증번호를 전송해주세요.'
      );
      setIsEmailCode(false);
    }
  };

  // 휴대폰 번호 입력
  const onChangePhoneNumber = (e) => {
    const phoneNumberRegExp = /^(\d{3})-(\d{3,4})-(\d{4})$/;
    const phoneNumberCurrent = e.target.value;

    const Num2 = phoneNumberCurrent
      .replace(/[^0-9]/g, '') // 공백이 들어있다면 지워주고
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`); // 숫자그룹을 나눠 사이에 하이픈(-)추가

    setPhoneNumber(Num2);

    if (!phoneNumberRegExp.test(Num2)) {
      setPhoneNumberMessage('올바른 형식의 휴대폰 번호를 입력해 주세요.');
      setIsPhoneNumber(false);
      // setEmailBtnColor('#8bc790');
      setPhoneCodebtnLabel('인증번호 전송');
    } else {
      setPhoneNumberMessage(' ');
      setIsPhoneNumber(true);
      setPhoneCodeBtn(true);
      // setEmailCodeBtn(true);
      // setEmailBtnColor('#4fc759');
    }
  };

  const postSendPhoneCode = async (payload) => {
    const header = { 'x-api-key': process.env.REACT_APP_PHONE_X_API_KEY };
    try {
      const data = await axios.post(
        'https://7s5fem53oh.execute-api.ap-northeast-2.amazonaws.com/default/phone-HelloWorldFunction-LuB9PruLAanW',
        { phoneNumber: payload.phoneNumber }, //data(req.body)
        {
          headers: header,
        } //config
      );
      // console.log('인증번호 전송 성공', data);
      setResponsePhoneCode(data.data.code);
    } catch (error) {
      return error;
    }
  };

  // 휴대폰 인증번호 전송 버튼
  const onClickIsSendPhoneCode = (e) => {
    const regExp = /[^0-9/]/g;
    const strPhoneNumber = phoneNumber.replace(regExp, '');
    // setPhoneNumber(strPhoneNumber);
    e.preventDefault();
    alert('인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.');
    setReadOnlyPhoneCode(false);
    setPhoneCode('');
    setPhoneCodebtnLabel('인증번호 재전송');
    postSendPhoneCode({ phoneNumber: strPhoneNumber });
  };

  // 휴대폰 인증번호 입력
  const onChangePhoneCodeConfirm = (e) => {
    const PhoneCodeRegExp = /[0-9]{6}$/g;
    const PhoneCodeCurrent = e.target.value;
    setPhoneCode(PhoneCodeCurrent);

    if (!PhoneCodeRegExp.test(PhoneCodeCurrent)) {
      setPhoneCodeConfirmMessage('인증번호 6자리를 입력해 주세요.');
      setIsPhoneCode(false);
      setPhoneCodeConfirmBtn(false);
      // setEmailCodeBtnColor('#8bc790');
      setPhoneCode(PhoneCodeCurrent);
    } else {
      setPhoneCodeConfirmMessage('');
      setIsPhoneCode(true);
      setPhoneCodeConfirmBtn(true);
      // setEmailCodeBtnColor('#4fc759');
    }
  };

  // 휴대폰 인증번호 입력 후 인증확인 버튼
  const onClickIsConfirmPhoneCode = (e) => {
    if (Number(responsePhoneCode) === Number(phoneCode)) {
      alert('휴대폰 인증이 완료되었습니다.');
      setPhoneCodeConfirmMessage('인증 완료!');
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(!readOnlyPhoneCode);
      setPhoneCodeBtn(false);
      setPhoneCodebtnLabel('인증번호 전송');
    } else {
      setPhoneCodeConfirmMessage('인증번호가 틀렸습니다. 다시 입력해 주세요.');
      setIsPhoneCode(false);
    }
    if (!responsePhoneCode) {
      setPhoneCodeConfirmMessage(
        '전송된 인증번호가 없습니다. 인증번호를 전송해주세요.'
      );
      setIsPhoneCode(false);
    }
  };

  // 비밀번호
  const onChangePassword = useCallback(
    (e) => {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/;
      const passwordCurrent = e.target.value;
      setPassword(passwordCurrent);

      if (!passwordRegex.test(passwordCurrent)) {
        // 비밀번호 정규식 불일치
        setPasswordMessage(
          '8~15자 영문 대소문자, 숫자 조합의 비밀번호를 입력해 주세요.'
        );
        if (passwordCurrent !== passwordConfirm) {
          // 비밀번호 정규식 불일치 & confirm 비밀번호와 불일치
          setIsPassword(false);
          setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
          setIsPasswordConfirm(false);
        } else {
          // 비밀번호 정규식 불일치 & confirm 비밀번호와 일치
          setPasswordMessage(
            '8~15자 영문 대소문자, 숫자 조합의 비밀번호를 입력해 주세요.'
          );
          setIsPassword(false);
          setIsPasswordConfirm(false);
        }
      } else {
        // 비밀번호 정규식 일치
        if (passwordCurrent !== passwordConfirm) {
          // 비밀번호 정규식 일치 & confirm 비밀번호와 불일치
          setPasswordMessage('안전한 비밀번호입니다.');
          setIsPassword(true);
          setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
          setIsPasswordConfirm(false);
        } else {
          // 비밀번호 정규식 일치 & confirm 비밀번호와 일치
          setPasswordMessage('안전한 비밀번호입니다.');
          setPasswordConfirmMessage('비밀번호가 일치합니다.');
          setIsPasswordConfirm(true);
          setIsPassword(true);
        }
      }
    },
    [passwordConfirm]
  );

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e) => {
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmMessage('비밀번호가 일치합니다.');
        setIsPasswordConfirm(true);
      } else {
        //   console.log(password);
        //   console.log(passwordConfirmCurrent);
        //   console.log(passwordConfirm);
        setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
        setIsPasswordConfirm(false);
      }
    },
    [password, passwordConfirm]
  );

  // 닉네임 입력
  const onChangeNickname = (e) => {
    const nicknameRegExp = /^.{1,20}$/;
    const nicknameCurrent = e.target.value;
    setNickname(nicknameCurrent);

    if (!nicknameRegExp.test(nicknameCurrent)) {
      setNicknameMessage('1-20자의 닉네임을 입력해 주세요.');
      setIsNickname(false);
      // setEmailBtnColor('#8bc790');
      // setEmailCodebtn('인증번호 전송');
    } else {
      setNicknameMessage('사용 가능한 닉네임입니다. (중복 허용)');
      setIsNickname(true);
      // setEmailCodeBtn(true);
      // setEmailBtnColor('#4fc759');
    }
  };

  // 회원가입 폼 Submit
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    const regExp = /[^0-9/]/g;
    const strPhoneNumber = phoneNumber.replace(regExp, '');
    e.preventDefault();
    if (
      email === '' ||
      password === '' ||
      passwordConfirm === '' ||
      nickname === ''
    ) {
      alert('빈칸을 입력해 주세요!');
    } else if (
      !isEmail ||
      !isPhoneNumber ||
      !isPassword ||
      !isPasswordConfirm
    ) {
      alert('조건에 맞게 입력해 주세요!');
    } else if (!isEmailCode) {
      alert('이메일을 인증해 주세요!');
    } else if (!isPhoneCode) {
      alert('휴대폰을 인증해 주세요!');
    } else {
      postSignup({
        email: email,
        password: password,
        confirm: passwordConfirm,
        nickname: nickname,
        phoneNumber: strPhoneNumber,
      });
      navigate('/login');
      alert('회원가입 완료!\npillnuts에 오신 것을 환영합니다 :)');
    }
  };

  return (
    <BackGround>
      <Wrapper>
        <SignupWrapper>
          <SignupInfo>
            <PrimarySpan>서비스 계정 만들기</PrimarySpan>
            <SecondarySpan>계정으로 사용할 이메일을 입력하세요.</SecondarySpan>
          </SignupInfo>

          {/* 이메일 주소 입력 */}
          <CombinedForm>
            <div
              className={`form-floating mb-3 ${
                isEmail ? 'successs' : 'errorr'
              }`}>
              <input
                type='email'
                className='form-control'
                value={email}
                onChange={onChangeEmail}
                // onBlur={onBlurEmail}
                placeholder='이메일'
                // style={{
                //   borderBottom: `1px solid ${borderEmailColor}`,
                //   background: 'none',
                // }}
              />
              <label htmlFor='floatingInput'>이메일</label>
            </div>

            {/* 이메일 인증번호 전송 버튼 */}
            <ButtonSt
              className={`${isEmail ? 'successBtn' : 'errorrBtn'}`}
              disabled={!emailCodeBtn}
              // style={{
              //   backgroundColor: `${emailBtnColor}`,
              // }}
              onClick={onClickIsSendEmailCode}>
              {emailCodeBtnLabel}
            </ButtonSt>
          </CombinedForm>

          {/* 이메일 입력 유효성 검사 문구 */}
          <FormBox>
            {email?.length > 0 && (
              <span className={`message ${isEmail ? 'success' : 'error'}`}>
                {emailMessage}
              </span>
            )}
          </FormBox>

          {/* 이메일 인증번호 입력 */}
          <CombinedForm>
            <div
              className={`form-floating mb-3 ${
                isEmailCode ? 'successs' : 'errorr'
              }`}>
              <input
                type='text'
                className='form-control'
                value={emailCode}
                onChange={onChangeEmailCodeConfirm}
                readOnly={readOnlyEmailCode}
                maxLength={6}
                placeholder='이메일 인증번호'
              />
              <label htmlFor='floatingInput'>이메일 인증번호</label>
            </div>

            {/* 이메일 인증번호 입력 후 인증확인 버튼 */}
            <ButtonSt
              disabled={!emailCodeConfirmBtn}
              // style={{
              //   backgroundColor: `${emailCodeBtnColor}`,
              // }}
              onClick={onClickIsConfirmEmailCode}>
              인증번호 확인
            </ButtonSt>
          </CombinedForm>

          {/* 이메일 인증번호 입력 유효성 검사 문구 */}
          <FormBox>
            {emailCode.length > 0 && (
              <span className={`message ${isEmailCode ? 'success' : 'error'}`}>
                {emailCodeConfirmMessage}
              </span>
            )}
          </FormBox>

          {/* 휴대폰 번호 입력 */}
          <CombinedForm>
            <div
              className={`form-floating mb-3 ${
                isPhoneNumber ? 'successs' : 'errorr'
              }`}>
              <input
                type='text'
                className='form-control'
                value={phoneNumber}
                onChange={onChangePhoneNumber}
                readOnly={readOnlyPhoneCode}
                maxLength={13}
                placeholder='휴대폰 번호'
                autoComplete='one-time-code'
              />
              <label htmlFor='floatingInput'>휴대폰 번호</label>
            </div>

            {/* 휴대폰 인증번호 발송 버튼 */}
            <ButtonSt disabled={!phoneCodeBtn} onClick={onClickIsSendPhoneCode}>
              {phoneCodebtnLabel}
            </ButtonSt>
          </CombinedForm>

          {/* 휴대폰 번호 입력 유효성 검사 문구 */}
          <FormBox>
            {phoneNumber.length > 0 && (
              <span
                className={`message ${isPhoneNumber ? 'success' : 'error'}`}>
                {phoneNumberMessage}
              </span>
            )}
          </FormBox>

          {/* 휴대폰 인증번호 입력 */}
          <CombinedForm>
            <div
              className={`form-floating mb-3 ${
                isPhoneCode ? 'successs' : 'errorr'
              }`}>
              <input
                type='text'
                className='form-control'
                value={phoneCode}
                onChange={onChangePhoneCodeConfirm}
                readOnly={readOnlyPhoneCode}
                maxLength={6}
                placeholder='휴대폰 인증번호'
                autoComplete='one-time-code'
              />
              <label htmlFor='floatingInput'>휴대폰 인증번호</label>
            </div>

            {/* 휴대폰 인증번호 입력 후 인증확인 버튼 */}
            <ButtonSt
              disabled={!phoneCodeConfirmBtn}
              // style={{
              //   backgroundColor: `${emailCodeBtnColor}`,
              // }}
              onClick={onClickIsConfirmPhoneCode}>
              인증번호 확인
            </ButtonSt>
          </CombinedForm>

          {/* 휴대폰 인증번호 입력 유효성 검사 문구 */}
          <FormBox>
            {phoneCode.length > 0 && (
              <span className={`message ${isPhoneCode ? 'success' : 'error'}`}>
                {phoneCodeConfirmMessage}
              </span>
            )}
          </FormBox>

          {/* 비밀번호 입력 */}
          <div
            className={`form-floating form-width ${
              isPassword ? 'successs' : 'errorr'
            }`}>
            <input
              type='password'
              className='form-control'
              value={password}
              onChange={onChangePassword}
              minLength={8}
              maxLength={15}
              placeholder='비밀번호'
              autoComplete='new-password'
            />
            <label htmlFor='floatingPassword' autoComplete='new-password'>
              비밀번호
            </label>
          </div>

          {/* 비밀번호 입력 유효성 검사 문구 */}
          <FormBox>
            {password.length > 0 && (
              <span className={`message ${isPassword ? 'success' : 'error'}`}>
                {passwordMessage}
              </span>
            )}
          </FormBox>

          {/* 비밀번호 확인 */}
          <div
            className={`form-floating form-width ${
              isPasswordConfirm ? 'successs' : 'errorr'
            }`}>
            <input
              type='password'
              className='form-control'
              onChange={onChangePasswordConfirm}
              minLength={8}
              maxLength={15}
              placeholder='비밀번호 확인'
              autoComplete='new-password'
            />
            <label htmlFor='floatingPassword' autoComplete='new-password'>
              비밀번호 확인
            </label>
          </div>

          {/* 비밀번호 확인 유효성 검사 문구 */}
          <FormBox>
            {passwordConfirm.length > 0 && (
              <span
                className={`message ${
                  isPasswordConfirm ? 'success' : 'error'
                }`}>
                {passwordConfirmMessage}
              </span>
            )}
          </FormBox>

          {/* 닉네임 입력 */}
          <div
            className={`form-floating mb-3 form-width ${
              isNickname ? 'successs' : 'errorr'
            }`}>
            <input
              type='text'
              className='form-control'
              // id='floatingNum'
              onChange={onChangeNickname}
              minLength={1}
              maxLength={20}
              placeholder='닉네임'
            />
            <label htmlFor='floatingInput'>닉네임</label>
          </div>

          {/* 닉네임 유효성 검사 문구 */}
          <FormBox>
            {nickname.length > 0 && (
              <span className={`message ${isNickname ? 'success' : 'error'}`}>
                {nicknameMessage}
              </span>
            )}
          </FormBox>
          <NavBtnWrapper>
            <NavBackBtn to='/'>뒤로</NavBackBtn>
            <NavSubmitBtn type='submit' onClick={onSubmitHandler}>
              가입하기
            </NavSubmitBtn>
          </NavBtnWrapper>
        </SignupWrapper>
      </Wrapper>
    </BackGround>
  );
};

const BackGround = styled.div`
  min-height: 95vh;
  padding: 60px 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ebf0ff;
`;

const Wrapper = styled.div`
  width: 800px;
  height: 1050px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 40px;
  box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.15);
`;

const SignupWrapper = styled.div`
  width: 480px;
  /* height: 660px; */
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
      margin-top: 10px;
      height: 50px;
      width: 350px;
      /* height: 50px; */
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
      margin-top: 10px;
      height: 50px;
      width: 350px;
      /* height: 50px; */
      border: none;
      border-bottom: 1px solid #919191;
      border-radius: 0;
      :focus,
      :active {
        outline: none;
        box-shadow: none;
        /* border-color: #e71c1c; */
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
    /* font-size: 18px; */
    /* padding-bottom: 10px; */
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
    /* margin-bottom: 25px */
    text-indent: -10px;
  }
`;

const FormBox = styled.div`
  width: 100%;
  height: 28px;
  padding: 8px 5px 0;
  font-size: 13px;
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
  width: 480px;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* .successBtn {
    background-color: #4fc759;
  }
  .errorrBtn {
    background-color: #4fc759;
  } */
`;

const ButtonSt = styled.button`
  width: 125px;
  height: 35px;
  border: none;
  border-radius: 50px;
  margin-left: 5px;
  /* background-color: #8bc790; */
  /* color: #ffffff; */
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  :active {
    box-shadow: 0px 0px 0 rgb(0, 0, 0, 0.3);
    /* background-color: #4d9e54 !important; */
    background-color: #bebebe !important;
  }
`;

const NavBtnWrapper = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NavBackBtn = styled(Link)`
  width: 228px;
  height: 44px;
  border: none;
  border-radius: 50px;
  background-color: #e7e7e7;
  cursor: pointer;
  text-decoration: none;
  color: black !important;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const NavSubmitBtn = styled.button`
  width: 228px;
  height: 44px;
  border: none;
  border-radius: 50px;
  background-color: #e7e7e7;
  cursor: pointer;
  background-color: #3366ff;
  color: #ffffff;
  :active {
    background-color: #1d51ee;
    color: #ffffff;
  }
`;
export default Signup;
