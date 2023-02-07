import { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'react-query';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { alertModalState } from '../recoil/recoilStore';
import AlertModal from '../components/common/AlertModal';
import { debounce } from 'lodash';

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
  setReadOnlyPhoneCode,
  disabledSubmit,
  setDisabledSubmit,
  setPhoneCode,
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
      setPhoneCode('');
      setSendPhoneCode(false);
      setIsPhoneCode(false);
      setPhoneCodeBtn(true);
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(true);
      clearInterval(timerId.current);
      setMin(3);
      setSec(0);
      // dispatch event
    }
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
    setReadOnlyPhoneCode,
    setPhoneCode,
  ]);

  return (
    <div className='timer'>
      {min}:{sec < 10 ? `0${sec}` : sec}
    </div>
  );
};

const BottomContents = ({
  Num5,
  phoneNumber,
  phoneCode,
  setPhoneCode,
  phoneNumberMessage,
  setPhoneNumberMessage,
  isPhoneNumber,
  isPhoneCode,
  setIsPhoneCode,
  phoneCodeBtn,
  setPhoneCodeBtn,
  newPassword,
  setNewPassword,
  newPasswordConfirm,
  setNewPasswordConfirm,
  isNewPassword,
  setIsNewPassword,
  isNewPasswordConfirm,
  setIsNewPasswordConfirm,
  phoneCodeConfirmMessage,
  setPhoneCodeConfirmMessage,
  sendPhoneCode,
  setSendPhoneCode,
  disabledSubmit,
  setDisabledSubmit,
  setIsPhoneNumber,
}) => {
  // 유효성 검사 문구
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState('');

  // 휴대폰번호 인증코드
  const [responsePhoneCode, setResponsePhoneCode] = useState();

  // 유효성 검사 통과 시 인증버튼 라벨 변경
  const [phoneCodebtnLabel, setPhoneCodebtnLabel] = useState('인증번호 전송');

  // 유효성 검사 통과 시 인증버튼 활성화
  const [phoneCodeConfirmBtn, setPhoneCodeConfirmBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyPhoneCode, setReadOnlyPhoneCode] = useState(false);

  const postSendPhoneCode = async (payload) => {
    try {
      const data = await api.post('/api/users/authentication/phone', {
        phoneNumber: payload.phoneNumber,
      });
      // console.log(data);
      // console.log(data?.response?.status);
      setResponsePhoneCode(data?.data?.code);
      if (data?.response?.status === 429) {
        setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
        setIsPhoneCode(false);
        setSendPhoneCode(false);
        setPhoneCodeBtn(true);
        setPhoneNumberMessage('');
        setIsPhoneNumber(true);
      }
      if (data?.status === 201) {
        setPhoneNumberMessage(
          '인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.'
        );
        setIsPhoneNumber(true);
        setReadOnlyPhoneCode(false);
        setPhoneCode('');
        setPhoneCodeConfirmMessage('');
        setPhoneCodeBtn(false);
        setSendPhoneCode(true);
      }
    } catch (error) {
      console.log(error);
      // if (error.response?.status === 429) {
      //   setResponsePhoneCode(error.response?.status);
      //   setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
      //   setIsPhoneCode(false);
      //   setSendPhoneCode(false);
      //   setIsPhoneNumber(true);
      //   setPhoneCodeBtn(true);
      //   setPhoneNumberMessage('휴대폰 번호를 인증해주세요.');
      // }
      return error;
    }
  };

  // 휴대폰 인증번호 전송 버튼
  const onClickIsSendPhoneCode = (e) => {
    const regExp = /[^0-9/]/g;
    const strPhoneNumber = phoneNumber.replace(regExp, '');
    e.preventDefault();
    // setPhoneNumberMessage(
    //   '인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.'
    // );
    // setIsPhoneNumber(true);
    // setReadOnlyPhoneCode(false);
    // setPhoneCode('');
    // setPhoneCodebtnLabel('인증번호 재전송');
    // setPhoneCodeConfirmMessage('');
    // postSendPhoneCode({ phoneNumber: strPhoneNumber });
    // setSendPhoneCode(true);
    // setPhoneCodeBtn(false);
    if (responsePhoneCode !== 429) {
      postSendPhoneCode({ phoneNumber: strPhoneNumber });
    }
  };

  //휴대폰 인증번호 입력
  const onChangePhoneCodeConfirm = (e) => {
    const PhoneCodeRegExp = /[0-9]{6}$/g;
    const PhoneCodeCurrent = e.target.value;
    setPhoneCode(PhoneCodeCurrent);
    if (!PhoneCodeRegExp.test(PhoneCodeCurrent)) {
      setPhoneCodeConfirmMessage('인증번호 6자리를 입력해 주세요.');
      setIsPhoneCode(false);
      setPhoneCodeConfirmBtn(false);
      // setPhoneCode(PhoneCodeCurrent);
    } else {
      setPhoneCodeConfirmMessage('');
      // setIsPhoneCode(true);
      setPhoneCodeConfirmBtn(true);
    }
  };

  //휴대폰 인증번호 입력 후 인증확인 버튼
  const onClickIsConfirmPhoneCode = (e) => {
    if (Number(responsePhoneCode) === Number(phoneCode)) {
      // alert('휴대폰 인증이 완료되었습니다.');
      setPhoneCodeConfirmMessage('인증 완료!');
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(!readOnlyPhoneCode);
      setPhoneCodeBtn(false);
      setPhoneCodebtnLabel('인증번호 전송');
      setPhoneNumberMessage('');
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
  };

  // 비밀번호
  const onChangePassword = useCallback(
    (e) => {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,15}$/;
      const passwordCurrent = e.target.value;
      setNewPassword(passwordCurrent);

      if (!passwordRegex.test(passwordCurrent)) {
        // 비밀번호 정규식 불일치
        setPasswordMessage(
          '8~15자 영문 대소문자, 숫자 조합의 비밀번호를 입력해 주세요.'
        );
        if (passwordCurrent !== newPasswordConfirm) {
          // 비밀번호 정규식 불일치 & confirm 비밀번호와 불일치
          setIsNewPassword(false);
          setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
          setIsNewPasswordConfirm(false);
        } else {
          // 비밀번호 정규식 불일치 & confirm 비밀번호와 일치
          setPasswordMessage(
            '8~15자 영문 대소문자, 숫자 조합의 비밀번호를 입력해 주세요.'
          );
          setIsNewPassword(false);
          setIsNewPasswordConfirm(false);
        }
      } else {
        // 비밀번호 정규식 일치
        if (passwordCurrent !== newPasswordConfirm) {
          // 비밀번호 정규식 일치 & confirm 비밀번호와 불일치
          setPasswordMessage('안전한 비밀번호입니다.');
          setIsNewPassword(true);
          setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
          setIsNewPasswordConfirm(false);
        } else {
          // 비밀번호 정규식 일치 & confirm 비밀번호와 일치
          setPasswordMessage('안전한 비밀번호입니다.');
          setPasswordConfirmMessage('비밀번호가 일치합니다.');
          setIsNewPasswordConfirm(true);
          setIsNewPassword(true);
        }
      }
    },
    [newPasswordConfirm]
  );

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e) => {
      const passwordConfirmCurrent = e.target.value;
      setNewPasswordConfirm(passwordConfirmCurrent);

      if (newPassword === passwordConfirmCurrent) {
        setPasswordConfirmMessage('비밀번호가 일치합니다.');
        setIsNewPasswordConfirm(true);
      } else {
        setPasswordConfirmMessage('비밀번호가 일치하지 않습니다.');
        setIsNewPasswordConfirm(false);
      }
    },
    [newPassword, newPasswordConfirm]
  );

  return (
    <>
      {/* 휴대폰 번호 입력 */}
      <CombinedForm>
        <div
          className={`form-floating mb-3 ${
            isPhoneNumber ? 'successs' : 'errorr'
          }`}>
          <input
            type='text'
            className='form-control'
            value={Num5}
            readOnly={!readOnlyPhoneCode}
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
          <span className={`message ${isPhoneNumber ? 'success' : 'error'}`}>
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
              // completedPhoneCode={completedPhoneCode}
              setPhoneCodeConfirmBtn={setPhoneCodeConfirmBtn}
              setPhoneCodebtnLabel={setPhoneCodebtnLabel}
              setReadOnlyPhoneCode={setReadOnlyPhoneCode}
              disabledSubmit={disabledSubmit}
              setDisabledSubmit={setDisabledSubmit}
              setIsPhoneNumber={setIsPhoneNumber}
              setPhoneCode={setPhoneCode}
            />
          ) : null}
        </div>

        {/* 휴대폰 인증번호 입력 후 인증확인 버튼 */}
        <ButtonSt
          disabled={!phoneCodeConfirmBtn}
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
          isNewPassword ? 'successs' : 'errorr'
        }`}>
        <input
          type='password'
          className='form-control'
          value={newPassword}
          onChange={onChangePassword}
          minLength={8}
          maxLength={15}
          placeholder='비밀번호'
          autoComplete='new-password'
        />
        <label htmlFor='floatingPassword' autoComplete='new-password'>
          새 비밀번호
        </label>
      </div>

      {/* 비밀번호 입력 유효성 검사 문구 */}
      <FormBox>
        {newPassword.length > 0 && (
          <span className={`message ${isNewPassword ? 'success' : 'error'}`}>
            {passwordMessage}
          </span>
        )}
      </FormBox>

      {/* 비밀번호 확인 */}
      <div
        className={`form-floating form-width ${
          isNewPasswordConfirm ? 'successs' : 'errorr'
        }`}>
        <input
          type='password'
          className='form-control'
          value={newPasswordConfirm}
          onChange={onChangePasswordConfirm}
          minLength={8}
          maxLength={15}
          placeholder='비밀번호 확인'
          autoComplete='new-password'
        />
        <label htmlFor='floatingPassword' autoComplete='new-password'>
          새 비밀번호 확인
        </label>
      </div>

      {/* 비밀번호 확인 유효성 검사 문구 */}
      <FormBox>
        {newPasswordConfirm.length > 0 && (
          <span
            className={`message ${isNewPasswordConfirm ? 'success' : 'error'}`}>
            {passwordConfirmMessage}
          </span>
        )}
      </FormBox>
    </>
  );
};
const FindPassword = () => {
  const [aboutAlert, setAboutAlert] = useRecoilState(alertModalState);
  // 기본 input 상태값
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  // 유효성 검사 문구
  const [emailMessage, setEmailMessage] = useState('');
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [phoneCodeConfirmMessage, setPhoneCodeConfirmMessage] = useState('');

  // input 양식 유효성 검사 통과 여부(에 따라 문구 색상 등 지정)
  const [isEmail, setIsEmail] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [isNewPasswordConfirm, setIsNewPasswordConfirm] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [isPhoneCode, setIsPhoneCode] = useState(false);

  // 이메일, 휴대폰번호 인증코드
  const [responseEmail, setResponseEmail] = useState();
  const [responsePhoneNumber, setResponsePhoneNumber] = useState();
  const [responsePassword, setResponsePassword] = useState();

  // 유효성 검사 통과 시 인증버튼 활성화
  const [emailCheckBtn, setEmailCheckBtn] = useState(false);
  const [phoneCodeBtn, setPhoneCodeBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyEmail, setReadOnlyEmail] = useState(false);

  // 이메일 확인 후 비밀번호 변경 input 띄워줌
  const [isVisible, setIsVisible] = useState(false);

  const [sendPhoneCode, setSendPhoneCode] = useState(false);

  const [disabledSubmit, setDisabledSubmit] = useState(true);

  // 이메일 주소 입력
  const onChangeEmail = debounce((e) => {
    const emailRegExp =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegExp.test(emailCurrent)) {
      setEmailMessage('올바른 형식의 이메일을 입력해 주세요.');
      setIsEmail(false);
    } else {
      setEmailMessage('');
      setIsEmail(false);
      setEmailCheckBtn(true);
    }
  }, 500);

  // 이메일 확인 api 호출 함수
  const getCheckEmail = async (params) => {
    try {
      const data = await api.get(
        `/api/users/find/phoneNumber?email=${params.queryKey[1]}`
      );
      // return setResponsePhoneNumber(data.status);
      if (data?.status === 200) {
        setResponsePhoneNumber(data.data.phoneNumber);
        setPhoneNumber(data.data.phoneNumber);
        setResponseEmail(data?.status);
        // setIsVisible(true);
        // setIsEmail(true);
        // setPhoneNumberMessage('휴대폰 번호를 인증해주세요.');
        // setIsPhoneNumber(false);
        // setEmailMessage('이메일 확인 완료!');
      }
    } catch (error) {
      if (error instanceof AxiosError)
        if (error.response?.status === 400) {
          // console.log(error.response?.status);
          // console.log(error);
          // setEmailMessage('해당하는 사용자가 없습니다.');
          // setReadOnlyEmail(false);
          // setIsEmail(false);
          // setEmailCheckBtn(true);
        }
    }
  };

  // 이메일 확인 query hook
  const useGetCheckEmailQuery = (email) => {
    const { isSuccess, isError, isLoading, isFetching, data, error } = useQuery(
      {
        // query 키
        queryKey: ['getCheckEmail', email],
        // query 함수
        queryFn: (params) => {
          return getCheckEmail(params);
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

  const data = useGetCheckEmailQuery(email);

  // 휴대폰 번호 가리기
  const replaceAt = function (input, index, character) {
    return (
      input.substr(0, index) +
      character +
      input.substr(index + character.length)
    );
  };

  const Num2 = responsePhoneNumber
    ?.replace(/[^0-9]/g, '') // 공백이 들어있다면 지워주고
    ?.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`); // 숫자그룹을 나눠 사이에 하이픈(-)추가
  const Num3 = String(Num2);
  const Num4 = replaceAt(Num3, 5, '●●●');
  const Num5 = replaceAt(Num4, 10, '●●●');

  // 이메일 확인 버튼
  const onClickIsCheckEmail = (e) => {
    e.preventDefault();
    // getCheckEmail(email);
    // console.log(responseEmail);
    if (responseEmail === 200) {
      setEmailCheckBtn(false);
      setEmailMessage('이메일 확인 완료!');
      setPhoneCodeBtn(true);
      setReadOnlyEmail(true);
      // setPhoneNumber(data.data.phoneNumber);
      // setIsVisible(true);
      // setEmailMessage('이메일 확인 완료!');
      setIsEmail(true);
      // setPhoneNumberMessage('휴대폰 번호를 인증해주세요.');
      // setIsPhoneNumber(false);
      setPhoneNumberMessage('휴대폰 번호를 인증해주세요.');
      setIsPhoneNumber(false);
    } else {
      setEmailMessage('해당하는 사용자가 없습니다.');
      setReadOnlyEmail(false);
      setIsEmail(false);
      setEmailCheckBtn(true);
    }

    // console.log(errorIsEmail);
  };

  // 비밀번호 찾기 api 호출 함수
  const putChangePassword = async (payload) => {
    try {
      const data = await api.put('/api/users/find/password', {
        email: payload.email,
        password: payload.password,
      });
      if (data?.status === 200) {
        setResponsePassword(data.data.code);
        navigate('/login');
        setAboutAlert({
          msg: '비밀번호 변경이 완료되었습니다.',
          btn: '확인하기',
          isOpen: true,
        });
        // alert('비밀번호 변경이 완료되었습니다.\n로그인 페이지로 이동합니다.');
      }
      if (data?.response?.data.errorMessage === '동일한 비밀번호입니다.') {
        // console.log(error.response?.data.errorMessage);
        setResponsePassword(data?.response?.data.errorMessage);
        setAboutAlert({
          msg: '동일한 비밀번호입니다.',
          btn: '확인하기',
          isOpen: true,
        });
      }
    } catch (error) {
      // if (error instanceof AxiosError)
      // if (error.response?.data.errorMessage === '동일한 비밀번호입니다.') {
      //   // console.log(error.response?.data.errorMessage);
      //   setResponsePassword(error.response?.data.errorMessage);
      //   alert('동일한 비밀번호입니다.');
      // }
      // console.log(error);
      return error;
    }
  };

  // 비밀번호 찾기 query hook
  const usePutChangePasswordMutation = () => {
    return useMutation({
      mutationFn: putChangePassword,
    });
  };

  const ChangePasswordMutate = usePutChangePasswordMutation();

  // 비밀번호 변경 Submit
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (email === '') {
      alert('이메일을 입력해 주세요!');
    } else if (
      (phoneCode === '') &
      (newPassword === '') &
      (newPasswordConfirm === '')
    ) {
      alert('빈칸을 입력해 주세요!');
    } else if (phoneCode === '') {
      alert('인증번호를 입력해 주세요!');
    } else if (!isPhoneCode) {
      alert('휴대폰 번호를 인증해 주세요!');
    } else if (phoneCodeConfirmMessage !== '인증 완료!') {
      alert('휴대폰 인증번호를 확인해 주세요!');
    } else if (newPassword === '') {
      alert('새 비밀번호를 입력해 주세요!');
    } else if (newPasswordConfirm === '') {
      alert('새 비밀번호를 확인해 주세요!');
    } else if (!isNewPassword || !isNewPasswordConfirm) {
      alert('조건에 맞게 입력해 주세요!');
    } else {
      ChangePasswordMutate.mutate({
        email: email,
        password: newPassword,
      });
      // if (responsePassword === '동일한 비밀번호입니다.') {
      //   alert('동일한 비밀번호입니다.');
      // } else if (responsePassword === 200) {
      //   navigate('/login');
      //   alert('비밀번호 변경이 완료되었습니다.\n로그인 페이지로 이동합니다.');
      // }
    }
  };
  // console.log(
  //   isEmail,
  //   isPhoneNumber,
  //   isPhoneCode,
  //   isNewPassword,
  //   isNewPasswordConfirm
  // );
  useEffect(() => {
    if (isEmail && isPhoneCode && isNewPassword && isNewPasswordConfirm) {
      setDisabledSubmit(false);
    } else {
      setDisabledSubmit(true);
    }
    if (emailMessage === '이메일 확인 완료!') {
      setEmailCheckBtn(false);
    }
    // if (phoneCodeConfirmMessage === '인증 완료!') {
    //   setIsPhoneCode(true);
    // }
    // if (emailMessage === '사용 가능한 이메일입니다.') {
    //   setIsEmail(true);
    // }
    if (email === '') {
      setEmailCheckBtn(false);
    }
    // if (responsePassword === '동일한 비밀번호입니다.') {
    //   alert('동일한 비밀번호입니다.');
    // } else if (responsePassword === 200) {
    //   navigate('/login');
    //   alert('비밀번호 변경이 완료되었습니다.\n로그인 페이지로 이동합니다.');
    // }
  }, [
    isEmail,
    isPhoneNumber,
    isPhoneCode,
    isNewPassword,
    isNewPasswordConfirm,
    phoneCodeConfirmMessage,
    emailMessage,
    email,
    responsePassword,
    navigate,
  ]);

  return (
    <PasswordWrapper>
      {aboutAlert.isOpen && <AlertModal />}
      {/* 이메일 주소 입력 */}
      <CombinedForm>
        <div
          className={`form-floating mb-3 ${isEmail ? 'successs' : 'errorr'}`}>
          <input
            type='email'
            className='form-control'
            // value={email}
            onChange={onChangeEmail}
            placeholder='이메일'
            readOnly={readOnlyEmail}
            // style={{
            //   borderBottom: `1px solid ${borderEmailColor}`,
            //   background: 'none',
            // }}
          />
          <label htmlFor='floatingInput'>이메일</label>
        </div>

        {/* 이메일 확인 버튼 */}
        <ButtonSt
          className={`${isEmail ? 'successBtn' : 'errorrBtn'}`}
          disabled={!emailCheckBtn}
          // style={{
          //   backgroundColor: `${emailBtnColor}`,
          // }}
          onClick={onClickIsCheckEmail}>
          이메일 확인
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
      <BottomWrapper>
        {isEmail ? (
          <BottomContents
            Num5={Num5}
            phoneNumber={phoneNumber}
            phoneCode={phoneCode}
            setPhoneCode={setPhoneCode}
            phoneNumberMessage={phoneNumberMessage}
            isPhoneNumber={isPhoneNumber}
            isPhoneCode={isPhoneCode}
            setIsPhoneCode={setIsPhoneCode}
            phoneCodeBtn={phoneCodeBtn}
            setPhoneCodeBtn={setPhoneCodeBtn}
            setPhoneNumberMessage={setPhoneNumberMessage}
            phoneCodeConfirmMessage={phoneCodeConfirmMessage}
            setPhoneCodeConfirmMessage={setPhoneCodeConfirmMessage}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            newPasswordConfirm={newPasswordConfirm}
            setNewPasswordConfirm={setNewPasswordConfirm}
            isNewPassword={isNewPassword}
            setIsNewPassword={setIsNewPassword}
            isNewPasswordConfirm={isNewPasswordConfirm}
            setIsNewPasswordConfirm={setIsNewPasswordConfirm}
            sendPhoneCode={sendPhoneCode}
            setSendPhoneCode={setSendPhoneCode}
            disabledSubmit={disabledSubmit}
            setDisabledSubmit={setDisabledSubmit}
            setIsPhoneNumber={setIsPhoneNumber}
          />
        ) : null}
      </BottomWrapper>
      <NavBtnWrapper>
        <NavBackBtn to='/login'>뒤로</NavBackBtn>
        <NavSubmitBtn
          disabled={disabledSubmit}
          type='submit'
          onClick={onSubmitHandler}>
          비밀번호 변경하기
        </NavSubmitBtn>
      </NavBtnWrapper>
    </PasswordWrapper>
  );
};

const PasswordWrapper = styled.div`
  @media screen and (max-width: 1700px) {
    width: 100%;
  }
  width: 480px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

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

const FormBox = styled.div`
  width: 100%;
  height: 28px;
  padding: 8px 5px 0;
  font-size: 13px;
  margin-bottom: 10px;
`;

const CombinedForm = styled.div`
  @media screen and (max-width: 1700px) {
    width: 100%;
  }
  width: 480px;
  display: flex;
  flex-direction: row;
  align-items: center;
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
  /* color: #868686;
  background: #f6f7fa; */
  :active {
    /* box-shadow: 0px 0px 0 rgb(0, 0, 0, 0.3); */
    /* background-color: #bebebe !important; */
  }
`;

const BottomWrapper = styled.div`
  width: 100%;
  height: 444px;
  .form-width {
    label {
      margin-top: 0px !important;
      height: 50px !important;
    }
  }
`;

const NavBtnWrapper = styled.div`
  width: 100%;
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
  background-color: #e7e7e7;
  /* cursor: pointer; */
  background-color: ${(props) => (props.disabled ? '#c2d1ff' : '#3366FF')};
  color: #ffffff;
  :active {
    /* background-color: #1d51ee;
    color: #ffffff; */
  }
`;

export default FindPassword;
