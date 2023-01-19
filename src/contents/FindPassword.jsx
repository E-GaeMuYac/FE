import axios, { AxiosError } from 'axios';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';

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
    const header = { 'x-api-key': process.env.REACT_APP_PHONE_X_API_KEY };
    try {
      const data = await axios.post(
        'https://7s5fem53oh.execute-api.ap-northeast-2.amazonaws.com/default/phone-HelloWorldFunction-LuB9PruLAanW',
        { phoneNumber: payload.phoneNumber },
        {
          headers: header,
        }
      );
      setResponsePhoneCode(data.data.code);
    } catch (error) {
      return error;
    }
  };

  // 휴대폰 인증번호 전송 버튼
  const onClickIsSendPhoneCode = (e) => {
    const regExp = /[^0-9/]/g;
    const strPhoneNumber = phoneNumber.replace(regExp, '');
    e.preventDefault();
    alert('인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.');
    setReadOnlyPhoneCode(false);
    setPhoneCode('');
    setPhoneCodebtnLabel('인증번호 재전송');
    postSendPhoneCode({ phoneNumber: strPhoneNumber });
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
      alert('휴대폰 인증이 완료되었습니다.');
      setPhoneCodeConfirmMessage('인증 완료!');
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(!readOnlyPhoneCode);
      setPhoneCodeBtn(false);
      setPhoneCodebtnLabel('인증번호 전송');
      setPhoneNumberMessage('');
      setIsPhoneCode(true);
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
  const [responsePhoneNumber, setResponsePhoneNumber] = useState();

  // 유효성 검사 통과 시 인증버튼 활성화
  const [emailCheckBtn, setEmailCheckBtn] = useState(false);
  const [phoneCodeBtn, setPhoneCodeBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyEmail, setReadOnlyEmail] = useState(false);

  // 이메일 확인 후 비밀번호 변경 input 띄워줌
  const [isVisible, setIsVisible] = useState(false);

  // 이메일 주소 입력
  const onChangeEmail = (e) => {
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
  };

  // 이메일 확인 api 호출 함수
  const getCheckEmail = async (payload) => {
    try {
      const data = await api.get(
        `/api/users/find/phoneNumber?email=${payload}`
      );
      // console.log(data);
      // return setResponsePhoneNumber(data.status);
      if (data.status === 200) {
        setResponsePhoneNumber(data.data.phoneNumber);
        setPhoneNumber(data.data.phoneNumber);
        setIsVisible(true);
        setEmailMessage('이메일 확인 완료!');
        setIsEmail(true);
        setPhoneNumberMessage('휴대폰 번호를 인증해주세요.');
        setIsPhoneNumber(false);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        if (error.response?.status === 400) {
          // console.log(error.response?.status);
          // console.log(error);
          setEmailMessage('해당하는 사용자가 없습니다.');
          setReadOnlyEmail(false);
          setIsEmail(false);
          setEmailCheckBtn(true);
        }
    }
  };

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
    getCheckEmail(email);
    setEmailCheckBtn(false);
    setPhoneCodeBtn(true);
    setReadOnlyEmail(true);
    // console.log(errorIsEmail);
  };

  // 비밀번호 찾기 api 호출 함수
  const putChangePassword = async (payload) => {
    try {
      await api.put('/api/users/find/password', {
        email: payload.email,
        password: payload.password,
      });
      // setResponsePhoneCode(data.data.code);
    } catch (error) {
      if (error instanceof AxiosError)
        if (error.response?.data.errorMessage === '동일한 비밀번호입니다.') {
          // console.log(error.response?.data.errorMessage);
          alert('동일한 비밀번호입니다.');
        }
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
      navigate('/login');
      alert('비밀번호 변경이 완료되었습니다.\n로그인 페이지로 이동합니다.');
    }
  };

  return (
    <PasswordWrapper>
      {/* 이메일 주소 입력 */}
      <CombinedForm>
        <div
          className={`form-floating mb-3 ${isEmail ? 'successs' : 'errorr'}`}>
          <input
            type='email'
            className='form-control'
            value={email}
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
        {isVisible ? (
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
          />
        ) : null}
      </BottomWrapper>
      <NavBtnWrapper>
        <NavBackBtn to='/login'>뒤로</NavBackBtn>
        <NavSubmitBtn type='submit' onClick={onSubmitHandler}>
          비밀번호 변경하기
        </NavSubmitBtn>
      </NavBtnWrapper>
    </PasswordWrapper>
  );
};

const PasswordWrapper = styled.div`
  width: 480px;
  padding: 30px 0;
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
    display: block;
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
  width: 480px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonSt = styled.button`
  width: 125px;
  height: 35px;
  border: none;
  border-radius: 50px;
  margin-left: 5px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  :active {
    box-shadow: 0px 0px 0 rgb(0, 0, 0, 0.3);
    background-color: #bebebe !important;
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

export default FindPassword;
