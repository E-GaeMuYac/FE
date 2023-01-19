import axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { Link, useNavigate } from 'react-router-dom';

const FindId = () => {
  // 기본 input 상태값
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');

  // 유효성 검사 문구
  const [phoneNumberMessage, setPhoneNumberMessage] = useState('');
  const [phoneCodeConfirmMessage, setPhoneCodeConfirmMessage] = useState('');

  // input 양식 유효성 검사 통과 여부(에 따라 문구 색상 등 지정)
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [isPhoneCode, setIsPhoneCode] = useState(false);

  // 이메일, 휴대폰번호 인증코드
  const [responsePhoneCode, setResponsePhoneCode] = useState();

  // 유효성 검사 통과 시 인증버튼 라벨 변경
  const [phoneCodebtnLabel, setPhoneCodebtnLabel] = useState('인증번호 전송');

  // 유효성 검사 통과 시 인증버튼 활성화
  const [phoneCodeBtn, setPhoneCodeBtn] = useState(false);
  const [phoneCodeConfirmBtn, setPhoneCodeConfirmBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyPhoneCode, setReadOnlyPhoneCode] = useState(false);

  // API 응답값
  const [resMsg, setResMsg] = useState('');
  const [resImg, setResImg] = useState('');
  const [resEmail, setResEmail] = useState('');

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
      setPhoneCodebtnLabel('인증번호 전송');
    } else {
      setPhoneNumberMessage(' ');
      setIsPhoneNumber(true);
      setPhoneCodeBtn(true);
    }
  };

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

  // 휴대폰 인증번호 입력
  const onChangePhoneCodeConfirm = (e) => {
    const PhoneCodeRegExp = /[0-9]{6}$/g;
    const PhoneCodeCurrent = e.target.value;
    setPhoneCode(PhoneCodeCurrent);

    if (!PhoneCodeRegExp.test(PhoneCodeCurrent)) {
      setPhoneCodeConfirmMessage('인증번호 6자리를 입력해 주세요.');
      setIsPhoneCode(false);
      setPhoneCodeConfirmBtn(false);
      setPhoneCode(PhoneCodeCurrent);
    } else {
      setPhoneCodeConfirmMessage('');
      setIsPhoneCode(true);
      setPhoneCodeConfirmBtn(true);
    }
  };

  // 휴대폰 인증번호 입력 후 인증확인 버튼
  const onClickIsConfirmPhoneCode = (e) => {
    if (Number(responsePhoneCode) === Number(phoneCode)) {
      alert('휴대폰 인증이 완료되었습니다.');
      setPhoneCodeConfirmMessage('인증 완료!');
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(readOnlyPhoneCode);
      setPhoneCodeBtn(false);
      setPhoneCodebtnLabel('인증번호 전송');
    } else {
      setPhoneCodeConfirmMessage('인증번호가 틀렸습니다. 다시 입력해 주세요.');
      setIsPhoneCode(false);
    }
  };

  // 아이디 찾기 Submit
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    const regExp = /[^0-9/]/g;
    const strPhoneNumber = phoneNumber.replace(regExp, '');
    e.preventDefault();
    if (phoneNumber === '' || phoneCode === '') {
      alert('빈칸을 입력해 주세요!');
    } else if (!isPhoneNumber) {
      alert('조건에 맞게 입력해 주세요!');
    } else if (!isPhoneCode) {
      alert('휴대폰을 인증해 주세요!');
    } else {
      submitPhoneNum({
        phoneNumber: strPhoneNumber,
      });
      navigate('/login');
      alert('회원가입 완료!\npillnuts에 오신 것을 환영합니다 :)');
    }
  };

  //API 호출
  const submitPhoneNum = (phoneNumber) => {
    console.log(phoneNumber);
  };

  return (
    <IdWrapper>
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
      <ResponseBox>
        <MessageBox>
          <span>{resMsg}아이디 찾기를 완료하였습니다.</span>
        </MessageBox>
        <EmailBox>
          <ProfileImg resImg={resImg} />
          <span>{resEmail}test@gmail.com</span>
        </EmailBox>
      </ResponseBox>
      <NavBtnWrapper>
        <NavSubmitBtn type='submit' onClick={onSubmitHandler}>
          아이디찾기
        </NavSubmitBtn>
      </NavBtnWrapper>
    </IdWrapper>
  );
};

const IdWrapper = styled.div`
  width: 480px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  input {
    display: block;
    border-bottom: 1px solid #919191;
    :focus {
      outline: none;
      box-shadow: none;
      border-bottom: 1px solid #919191;
    }
  }
`;

const FormBox = styled.div`
  width: 100%;
  height: 28px;
  padding: 8px 5px 0;
  font-size: 13px;
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

const ResponseBox = styled.div`
  width: 100%;
  height: 128px;
`;

const MessageBox = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 24px;
  }
`;

const EmailBox = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 30px;
    font-weight: bold;
  }
`;

const ProfileImg = styled.div`
  background-color: #919191;
  background-image: ${({ resImg }) => `url(${resImg})`};
  background-size: cover;
  background-position: center;
  margin: 4.5px 4.5px;
  width: 41px;
  height: 41px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  /* z-index: 2; */
`;

const NavBtnWrapper = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NavSubmitBtn = styled.button`
  width: 100%;
  height: 70px;
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

export default FindId;
