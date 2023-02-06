import { AxiosError } from 'axios';
import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { postSignup } from '../query/signupQuery';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useRef } from 'react';

const Timer = ({
  phoneCodeConfirmMessage,
  setPhoneCodeConfirmMessage,
  setSendPhoneCode,
  sendPhoneCode,
  setIsPhoneCode,
  setPhoneCodeBtn,
  completedPhoneCode,
  setPhoneCodeConfirmBtn,
  setPhoneCodebtnLabel,
}) => {
  const [min, setMin] = useState(3);
  const [sec, setSec] = useState(0);
  const time = useRef(180);
  const timerId = useRef(null);

  useEffect(() => {
    if (sendPhoneCode) {
      if (time.current > 0) {
        timerId.current = setInterval(() => {
          setMin(parseInt(time.current / 60));
          setSec(time.current % 60);
          // setPhoneCodeConfirmMessage(' ');
          setPhoneCodeConfirmBtn(true);
          time.current -= 1;
        }, 1000);
        return () => clearInterval(timerId.current);
      }
    }
    // 만약 타임 아웃이 발생했을 경우
    if (time.current <= 0) {
      // console.log('타임아웃');
      setPhoneCodeConfirmMessage(
        '인증 시간이 만료되었습니다. 다시 시도해 주세요.'
      );
      setPhoneCodebtnLabel('인증번호 재전송');
      setSendPhoneCode(false);
      setIsPhoneCode(false);
      setPhoneCodeBtn(true);
      setPhoneCodeConfirmBtn(false);
      clearInterval(timerId.current);
      setMin(3);
      setSec(0);
      // dispatch event
    }
    // if (completedPhoneCode === true) {
    //   console.log(phoneCodeConfirmMessage);
    //   console.log(completedPhoneCode);
    //   clearInterval(timerId.current);
    //   setMin(3);
    //   setSec(0);
    // }
  }, [
    sec,
    sendPhoneCode,
    setPhoneCodeBtn,
    setIsPhoneCode,
    setSendPhoneCode,
    phoneCodeConfirmMessage,
    setPhoneCodeConfirmMessage,
    completedPhoneCode,
    setPhoneCodeConfirmBtn,
    setPhoneCodebtnLabel,
  ]);

  return (
    <div className='timer'>
      {min}:{sec < 10 ? `0${sec}` : sec}
    </div>
  );
};

const Signup = () => {
  // 기본 input 상태값
  const [email, setEmail] = useState('');
  // const [emailCode, setEmailCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');

  // 유효성 검사 문구
  const [emailMessage, setEmailMessage] = useState('');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [phoneCodeConfirmMessage, setPhoneCodeConfirmMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');
  const [nicknameMessage, setNicknameMessage] = useState('');

  // input 양식 유효성 검사 통과 여부(에 따라 문구 색상 등 지정)
  const [isEmail, setIsEmail] = useState(false);
  // const [isEmailCode, setIsEmailCode] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [isPhoneCode, setIsPhoneCode] = useState(false);
  const [isNickname, setIsNickname] = useState(false);

  // 이메일, 휴대폰번호 인증코드
  const [responsePhoneCode, setResponsePhoneCode] = useState();
  const [errorPhoneCode, setErrorPhoneCode] = useState();

  // 이메일, 휴대폰번호 중복검사
  const [errorEmail, setErrorEmail] = useState();
  const [errorPhoneNumber, setErrorPhoneNumber] = useState();

  // 유효성 검사 통과 시 인증버튼 라벨 변경
  const [emailCodeBtnLabel, setEmailCodeBtnLabel] = useState('중복확인');
  const [phoneCodebtnLabel, setPhoneCodebtnLabel] = useState('중복확인');

  // 유효성 검사 통과 시 인증버튼 활성화
  const [emailCheckBtn, setEmailCheckBtn] = useState(false);
  const [phoneCodeBtn, setPhoneCodeBtn] = useState(false);
  const [phoneCodeConfirmBtn, setPhoneCodeConfirmBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyPhoneNumber, setReadOnlyPhoneNumber] = useState(false);
  const [readOnlyPhoneCode, setReadOnlyPhoneCode] = useState(true);

  const [disabledSubmit, setDisabledSubmit] = useState(true);

  const [sendPhoneCode, setSendPhoneCode] = useState(false);
  const [completedPhoneCode, setCompletedPhoneCode] = useState(false);

  const getVerifyEmail = async (params) => {
    try {
      const data = await api.get(
        `/api/users/signup/email?email=${params.queryKey[1]}`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errMsgEmail = error.response?.data.errorMessage;
        setErrorEmail(errMsgEmail);
      }
      // console.log(error.response?.status);
      console.log(error);
      // setErrorEmailCode(error.response?.status);
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
        staleTime: 3000,
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

  const data = useGetVerifyEmailQuery(email);

  // console.log(data);

  // 이메일 주소 입력
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
      // setEmailCodeBtn(false);
    } else {
      setEmailMessage('이메일 중복 확인이 필요합니다.');
      setEmailCodeBtnLabel('중복확인');
      setIsEmail(false);
      setEmailCheckBtn(true);
      // setEmailCodeBtn(true);
      // setEmailBtnColor('#4fc759');
    }
  };

  // 이메일 인증번호 전송 api 호출 함수
  // const postSendEmailCode = async (payload) => {
  //   try {
  //     const data = await api.post(
  //       `/api/users/authentication/email`,
  //       { email: payload.email } //data(req.body));
  //     );
  //     // console.log('인증번호 전송 성공', data);
  //     // console.log('인증번호', data.data.body.code);
  //     setResponseEmailCode(data.data.body.code);
  //   } catch (error) {
  //     return error;
  //   }
  // };

  // 이메일 중복확인 및 인증번호 전송 버튼
  const onClickIsSendEmailCode = (e) => {
    const errMsgEmail = data?.response?.data.errorMessage;
    setErrorEmail(errMsgEmail);
    // console.log(data?.response?.data.errorMessage);
    // console.log(errorEmail);
    e.preventDefault();
    if (emailCodeBtnLabel === '중복확인') {
      // setEmailCodeBtn(true);
      if (data?.status === 200) {
        setEmailMessage('사용 가능한 이메일입니다.');
        // setIsEmail(true);
        setEmailCheckBtn(false);
        // setEmailCodeBtn(true);
        // setEmailCodeBtnLabel('인증번호 전송');
        // alert('인증번호가 전송되었습니다. 이메일을 확인해 주세요.');
        // postSendEmailCode({ email: email });
        // setEmailCode('');
        // setEmailCodeConfirmMessage('');
      } else if (
        data?.response?.data.errorMessage === '중복인 유저가 있습니다.'
      ) {
        setEmailMessage('이미 존재하는 이메일입니다. 다시 시도해 주세요.');
        setIsEmail(false);
        // setEmailCodeBtn(false);
      } else if (
        data?.response?.data.errorMessage === '데이터 형식이 잘못되었습니다.'
      ) {
        setEmailMessage('잘못된 형식입니다. 다시 시도해 주세요.');
        setIsEmail(false);
        // setEmailCodeBtn(false);
      }
      if (emailMessage === '사용 가능한 이메일입니다.') {
        setEmailCheckBtn(false);
      }
    }
  };

  // 휴대폰 번호 중복확인 api 호출 함수
  const getVerifyPhone = async (params) => {
    try {
      const data = await api.get(
        `/api/users/signup/phone?phoneNumber=${params.queryKey[1]}`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        const errMsgPhoneNumber = error.response?.data.errorMessage;
        setErrorPhoneNumber(errMsgPhoneNumber);
      }
      // console.log(error.response?.status);
      //   console.log(error.response?.data.errorMessage);
      // console.log(error);
    }
  };

  // query hooks

  // 휴대폰 번호 중복확인 query hook
  const useGetVerifyPhoneQuery = (strPhoneNumber) => {
    const { isSuccess, isError, isLoading, isFetching, data, error } = useQuery(
      {
        // query 키
        queryKey: ['getVerifyPhone', strPhoneNumber],
        // query 함수
        queryFn: (params) => {
          return getVerifyPhone(params);
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

  const regExp = /[^0-9/]/g;
  const strPhoneNumber = phoneNumber.replace(regExp, '');

  const dataPhone = useGetVerifyPhoneQuery(strPhoneNumber);

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
      // setPhoneCodebtnLabel('인증번호 전송');
      setPhoneCodeBtn(false);
    } else {
      setPhoneNumberMessage('휴대폰 번호 중복 확인이 필요합니다.');
      setPhoneCodebtnLabel('중복확인');
      setIsPhoneNumber(false);
      setPhoneCodeBtn(true);
      // setEmailCodeBtn(true);
      // setEmailBtnColor('#4fc759');
    }
  };

  const postSendPhoneCode = async (payload) => {
    try {
      const data = await api.post(
        '/api/users/authentication/phone',
        { phoneNumber: payload.phoneNumber } //data(req.body)
      );
      // console.log('인증번호 전송 성공', data);
      // console.log(data?.response?.status);
      // if (data.response.data.message === '3분에 1번만 요청이 가능합니다.') {
      //   setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
      //   setIsPhoneCode(false);
      // }
      if (data?.response?.status === 429) {
        setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
        setIsPhoneCode(false);
        setSendPhoneCode(false);
      }
      if (data?.status === 201) {
        setPhoneNumberMessage(
          '인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.'
        );
        setIsPhoneNumber(true);
        setPhoneCodeBtn(false);
        setPhoneCodeBtn(false);
        setReadOnlyPhoneCode(false);
        setPhoneCodeConfirmMessage('');
        setPhoneCode('');
        setSendPhoneCode(true);
      }
      setErrorPhoneCode(data?.response?.status);
      setResponsePhoneCode(data?.data?.code);

      // // setPhoneCodebtnLabel('인증번호 재전송');
    } catch (error) {
      console.log(error);
      // console.log(error.response?.status);
      setErrorPhoneCode(error.response?.status);
      if (error.response?.status === 429) {
        setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
        setIsPhoneCode(false);
      }
      return error;
    }
  };

  // 휴대폰 번호 중복확인 및 휴대폰 인증번호 전송 버튼
  const onClickIsSendPhoneCode = useCallback(
    (e) => {
      // console.log(errorPhoneCode);
      const regExp = /[^0-9/]/g;
      const strPhoneNumber = phoneNumber.replace(regExp, '');
      // setPhoneNumber(strPhoneNumber);
      e.preventDefault();
      if (phoneCodebtnLabel === '중복확인') {
        if (dataPhone?.status === 200) {
          setPhoneNumberMessage(
            '사용 가능한 휴대폰 번호입니다. 해당 번호를 인증해 주세요.'
          );
          setIsPhoneNumber(true);
          setPhoneCodeBtn(true);
          setPhoneCodebtnLabel('인증번호 전송');
          setPhoneCode('');
          // setPhoneCodeConfirmMessage('');
        } else if (
          dataPhone?.response?.data.errorMessage === '중복인 유저가 있습니다.'
        ) {
          setPhoneNumberMessage(
            '이미 존재하는 번호입니다. 다시 시도해 주세요.'
          );
          setIsPhoneNumber(false);
          setPhoneCodeBtn(false);
        } else if (
          dataPhone?.response?.data.errorMessage ===
          '데이터 형식이 잘못되었습니다.'
        ) {
          setPhoneNumberMessage('잘못된 형식입니다. 다시 시도해 주세요.');
          setIsPhoneNumber(false);
          setPhoneCodeBtn(false);
        }
      }
      if (
        phoneCodebtnLabel === '인증번호 전송' ||
        phoneCodebtnLabel === '인증번호 재전송'
      ) {
        postSendPhoneCode({ phoneNumber: strPhoneNumber });
        // if (responsePhoneCode === 201) {
        //   setPhoneCodeConfirmMessage(
        //     '인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.'
        //   );
        //   setReadOnlyPhoneCode(false);
        //   // setPhoneCodebtnLabel('인증번호 재전송');
        //   setPhoneCode('');
        //   setSendPhoneCode(true);
        // } else if (errorPhoneCode === 429) {
        //   setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
        //   setIsPhoneCode(false);
        // }
      }
      // if (errorPhoneCode === 429) {
      //   setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
      //   setIsPhoneCode(false);
      // }
    },
    [
      phoneCodebtnLabel,
      dataPhone?.status,
      // errorPhoneCode,
      errorPhoneNumber,
      phoneNumber,
      responsePhoneCode,
    ]
  );

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
      setIsPhoneCode(false);
      setPhoneCodeConfirmBtn(true);
      // setEmailCodeBtnColor('#4fc759');
    }
  };

  // 휴대폰 인증번호 입력 후 인증확인 버튼
  const onClickIsConfirmPhoneCode = (e) => {
    if (Number(responsePhoneCode) === Number(phoneCode)) {
      // alert('휴대폰 인증이 완료되었습니다.');
      setPhoneCodeConfirmMessage('인증 완료!');
      setPhoneNumberMessage('');
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(!readOnlyPhoneCode);
      setPhoneCodeBtn(false);
      setPhoneCodebtnLabel('인증번호 전송');
      setReadOnlyPhoneNumber(!readOnlyPhoneCode);
      setIsPhoneCode(true);
      setSendPhoneCode(false); // 인증번호 인증 완료 되면 false로 바꾸기
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
    // if (phoneCodeConfirmMessage === '인증 완료!') {
    //   setIsPhoneCode(true);
    // }
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

  useEffect(() => {
    if (
      isEmail &&
      isPhoneNumber &&
      isPhoneCode &&
      isPassword &&
      isPasswordConfirm &&
      isNickname
    ) {
      setDisabledSubmit(false);
    } else {
      setDisabledSubmit(true);
    }
    if (phoneCodeConfirmMessage === '인증 완료!') {
      setIsPhoneCode(true);
    }
    if (emailMessage === '사용 가능한 이메일입니다.') {
      setIsEmail(true);
    }
    if (email === '') {
      setEmailCheckBtn(false);
    } else {
      // setEmailCheckBtn(true);
    }
  }, [
    isEmail,
    isPhoneNumber,
    isPhoneCode,
    isPassword,
    isPasswordConfirm,
    isNickname,
    phoneCodeConfirmMessage,
    emailMessage,
    email,
  ]);

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
    } else if (emailMessage === '이메일 중복 확인이 필요합니다.') {
      alert('이메일 중복 확인이 필요합니다.');
    } else if (phoneNumberMessage === '휴대폰 번호 중복 확인이 필요합니다.') {
      alert('휴대폰 번호 중복 확인이 필요합니다.');
    } else if (
      !isEmail ||
      !isPhoneNumber ||
      !isPassword ||
      !isPasswordConfirm ||
      // !isEmailCode ||
      !isPhoneCode
    ) {
      alert('조건에 맞게 입력해 주세요!');
    }
    // else if (emailCodeConfirmMessage !== '인증 완료!') {
    //   alert('이메일을 인증해 주세요!');
    // }
    else if (phoneCodeConfirmMessage !== '인증 완료!') {
      alert('휴대폰 인증번호를 확인해 주세요!');
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

            {/* 이메일 중복확인 버튼 OOO 이메일 인증번호 전송 버튼 XXX*/}
            <ButtonSt
              className={`${isEmail ? 'successBtn' : 'errorrBtn'}`}
              disabled={!emailCheckBtn}
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
          {/* <CombinedForm>
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
            </div> */}

          {/* 이메일 인증번호 입력 후 인증확인 버튼 */}
          {/* <ButtonSt
              disabled={!emailCodeConfirmBtn}
              // style={{
              //   backgroundColor: `${emailCodeBtnColor}`,
              // }}
              onClick={onClickIsConfirmEmailCode}>
              인증번호 확인
            </ButtonSt>
          </CombinedForm> */}

          {/* 이메일 인증번호 입력 유효성 검사 문구 */}
          {/* <FormBox>
            {emailCode.length > 0 && (
              <span className={`message ${isEmailCode ? 'success' : 'error'}`}>
                {emailCodeConfirmMessage}
              </span>
            )}
          </FormBox> */}

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
                readOnly={readOnlyPhoneNumber}
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
              className={`form-floating mb-3 phoneForm ${
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
              {sendPhoneCode ? (
                <Timer
                  setPhoneCodeConfirmMessage={setPhoneCodeConfirmMessage}
                  setSendPhoneCode={setSendPhoneCode}
                  sendPhoneCode={sendPhoneCode}
                  setIsPhoneCode={setIsPhoneCode}
                  setPhoneCodeBtn={setPhoneCodeBtn}
                  phoneCodeConfirmMessage={phoneCodeConfirmMessage}
                  completedPhoneCode={completedPhoneCode}
                  setPhoneCodeConfirmBtn={setPhoneCodeConfirmBtn}
                  setPhoneCodebtnLabel={setPhoneCodebtnLabel}
                />
              ) : null}
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
            {phoneCode.length >= 0 && (
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
            <NavSubmitBtn
              disabled={disabledSubmit}
              type='submit'
              onClick={onSubmitHandler}>
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
  @media screen and (max-width: 1700px) {
    width: 600px;
    height: 900px;
  }
  width: 800px;
  height: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 40px;
  box-shadow: 2px 2px 32px 2px rgba(10, 32, 98, 0.15);
  .timer {
    height: 30px;
    margin-top: auto;
    float: right;
  }
  .phoneForm {
    @media screen and (max-width: 1700px) {
      width: 310px !important;
    }
    width: 350px !important;
    border-bottom: 1px solid #919191;
    display: flex;
    input {
      @media screen and (max-width: 1700px) {
        width: 260px;
      }
      margin-right: 10px;
      border: 0 !important;
      width: 310px !important;
    }
  }
`;

const SignupWrapper = styled.div`
  @media screen and (max-width: 1700px) {
    width: 420px;
    /* background-color: #e71c1c; */
  }
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
    border-bottom: 1px solid #3366ff;
    input {
      @media screen and (max-width: 1700px) {
        width: 310px;
      }
      margin-top: 10px;
      height: 50px;
      width: 350px;
      border: none;
      /* border-bottom: 1px solid #3366ff; */
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
    border-bottom: 1px solid #919191;
    input {
      @media screen and (max-width: 1700px) {
        width: 310px;
      }
      margin-top: 10px;
      height: 50px;
      width: 350px;
      border: none;
      /* border-bottom: 1px solid #919191; */
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
  @media screen and (max-width: 1700px) {
    font-size: 27px;
  }
  font-size: 32px;
  font-weight: 700;
  color: #242424;
`;

const SecondarySpan = styled.span`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
  }
  font-size: 16px;
  color: #868686;
`;

const CombinedForm = styled.div`
  @media screen and (max-width: 1700px) {
    width: 420px;
    justify-content: space-between;
  }
  width: 480px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /* background-color: aliceblue; */
  /* .successBtn {
    background-color: #4fc759;
  }
  .errorrBtn {
    background-color: #4fc759;
  } */
`;

const ButtonSt = styled.button`
  @media screen and (max-width: 1700px) {
    width: 100px;
    font-size: 12px;
  }
  margin-top: auto;
  width: 125px;
  height: 35px;
  border: none;
  border-radius: 50px;
  margin-left: 5px;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => (props.disabled ? '' : '#3366FF')};
  background-color: ${(props) => (props.disabled ? '' : '#f6f7fa')};
  :active {
    /* box-shadow: 0px 0px 0 rgb(0, 0, 0, 0.3);
    background-color: #bebebe !important; */
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
  @media screen and (max-width: 1700px) {
    width: 47%;
  }
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
  @media screen and (max-width: 1700px) {
    width: 47%;
  }
  width: 228px;
  height: 44px;
  border: none;
  border-radius: 50px;
  background-color: ${(props) => (props.disabled ? '#c2d1ff' : '#3366FF')};
  color: #ffffff;
  :active {
    /* background-color: #1d51ee;
    color: #ffffff; */
  }
`;
export default Signup;
