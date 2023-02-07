import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '../apis/apiInstance';
import { useEffect } from 'react';
import { useRef } from 'react';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
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
  setPhoneNumberMessage,
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
      setPhoneNumberMessage('');
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
    setPhoneNumberMessage,
  ]);

  return (
    <div className='timer'>
      {min}:{sec < 10 ? `0${sec}` : sec}
    </div>
  );
};

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

  // 이메일, 휴대폰번호 중복검사
  const [errorPhoneNumber, setErrorPhoneNumber] = useState();

  // 유효성 검사 통과 시 인증버튼 라벨 변경
  const [phoneCodebtnLabel, setPhoneCodebtnLabel] = useState('인증번호 전송');

  // 유효성 검사 통과 시 인증버튼 활성화
  const [phoneCodeBtn, setPhoneCodeBtn] = useState(false);
  const [phoneCodeConfirmBtn, setPhoneCodeConfirmBtn] = useState(false);

  // 인증완료 시 input 비활성화
  const [readOnlyPhoneCode, setReadOnlyPhoneCode] = useState(false);

  const [sendPhoneCode, setSendPhoneCode] = useState(false);

  const [disabledSubmit, setDisabledSubmit] = useState(true);

  // API 응답값
  const [resMsg, setResMsg] = useState('');
  const [resImg, setResImg] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [msgState, setMsgState] = useState(false);

  // 휴대폰 번호 중복확인 api 호출 함수
  const getVerifyPhone = async (params) => {
    try {
      const data = await api.get(
        `/api/users/signup/phone?phoneNumber=${params.queryKey[1]}`
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // const errMsgPhoneNumber = error.response?.data.errorMessage;
        // setErrorPhoneNumber(errMsgPhoneNumber);
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
  const onChangePhoneNumber = debounce((e) => {
    const phoneNumberRegExp = /^(\d{3})-(\d{3,4})-(\d{4})$/;

    e.target.value = e.target.value
      .replace(/[^0-9]/g, '') // 공백이 들어있다면 지워주고
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3') // 숫자그룹을 나눠 사이에 하이픈(-)추가
      .replace(/(\-{1,2})$/g, '');
    const hyphenNumber = e.target.value;
    setPhoneNumber(hyphenNumber);

    if (!phoneNumberRegExp.test(hyphenNumber)) {
      setPhoneNumberMessage('올바른 형식의 휴대폰 번호를 입력해 주세요.');
      setIsPhoneNumber(false);
      setPhoneCodebtnLabel('인증번호 전송');
      setPhoneCodeBtn(false);
    } else {
      setPhoneNumberMessage(' ');
      setIsPhoneNumber(true);
      setPhoneCodeBtn(true);
    }
  }, 400);

  const postSendPhoneCode = async (payload) => {
    try {
      const data = await api.post('/api/users/authentication/phone', {
        phoneNumber: payload.phoneNumber,
      });
      // setResponsePhoneCode(data.data.code);
      if (data?.response?.status === 429) {
        setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
        setIsPhoneCode(false);
        setSendPhoneCode(false);
        setPhoneCodeBtn(true);
        setPhoneNumberMessage('');
        setIsPhoneNumber(true);
      }
      if (
        dataPhone?.response?.data?.errorMessage === '중복인 유저가 있습니다.' &&
        data?.response?.status !== 429
      ) {
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
      // setErrorPhoneCode(data?.response?.status);
      setResponsePhoneCode(data?.data?.code);
      // else if (data?.status === 201) {
      //   setPhoneCodeConfirmMessage(
      //     '인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.'
      //   );
      //   setPhoneCodeBtn(false);
      //   setPhoneCodeBtn(false);
      //   setReadOnlyPhoneCode(false);
      //   setPhoneCode('');
      //   setSendPhoneCode(true);
      // }
      // setPhoneCodeBtn(false);
      // setReadOnlyPhoneCode(false);
      // setPhoneCode('');
      // setSendPhoneCode(true);
    } catch (error) {
      // if (error.response?.status === 429) {
      //   setResponsePhoneCode(error.response?.status);
      //   setPhoneCodeConfirmMessage('3분에 1번만 요청이 가능합니다.');
      //   setIsPhoneCode(false);
      //   setSendPhoneCode(false);
      //   setPhoneCodeBtn(true);
      //   setPhoneNumberMessage('');
      //   setIsPhoneNumber(true);
      // }
      return error;
    }
  };

  // 휴대폰 인증번호 전송 버튼
  const onClickIsSendPhoneCode = (e) => {
    const regExp = /[^0-9/]/g;
    const strPhoneNumber = phoneNumber.replace(regExp, '');
    e.preventDefault();
    if (
      dataPhone?.response?.data?.errorMessage === '중복인 유저가 있습니다.' &&
      responsePhoneCode !== 429
    ) {
      // setPhoneNumberMessage(
      //   '인증번호가 전송되었습니다. 문자메시지를 확인해 주세요.'
      // );
      // setIsPhoneNumber(true);
      // setReadOnlyPhoneCode(false);
      // setPhoneCode('');
      // setPhoneCodeBtn(false);
      postSendPhoneCode({ phoneNumber: strPhoneNumber });
      // setSendPhoneCode(true);
    } else if (dataPhone?.status === 200) {
      setPhoneNumberMessage('해당 휴대폰 번호로 가입된 계정이 없습니다.');
      setSendPhoneCode(false);
      setIsPhoneNumber(false);
    } else if (
      dataPhone?.response?.data?.errorMessage ===
      '데이터 형식이 잘못되었습니다.'
    ) {
      setPhoneNumberMessage('잘못된 데이터 형식입니다.');
      setSendPhoneCode(false);
      setIsPhoneNumber(false);
    }
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
      // setIsPhoneCode(true);
      setPhoneCodeConfirmBtn(true);
    }
  };

  // 휴대폰 인증번호 입력 후 인증확인 버튼
  const onClickIsConfirmPhoneCode = (e) => {
    if (Number(responsePhoneCode) === Number(phoneCode)) {
      // alert('휴대폰 인증이 완료되었습니다.');
      setPhoneCodeConfirmMessage('인증 완료!');
      setPhoneCodeConfirmBtn(false);
      setReadOnlyPhoneCode(!readOnlyPhoneCode);
      setPhoneCodeBtn(false);
      setIsPhoneCode(true);
      setPhoneCodebtnLabel('인증번호 전송');
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

  // 아이디 찾기 Submit
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
      submitPhoneNum(strPhoneNumber);
    }
  };

  //API 호출
  const submitPhoneNum = async (phoneNumber) => {
    try {
      const res = await api.get(
        `/api/users/find/email?phoneNumber=${phoneNumber}`
      );
      setResEmail(res.data.email.email);
      setResImg(res.data.email.imageUrl);
      setResMsg('아이디 찾기를 완료하였습니다.');
      setMsgState(true);
    } catch (e) {
      console.log(e);
      setResMsg('해당하는 사용자가 없습니다.');
      setMsgState(false);
    }
  };

  useEffect(() => {
    if (isPhoneNumber && isPhoneCode) {
      setDisabledSubmit(false);
    } else {
      setDisabledSubmit(true);
    }
  }, [isPhoneNumber, isPhoneCode]);

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
            // value={phoneNumber}
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
              setPhoneNumberMessage={setPhoneNumberMessage}
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
      <ResponseBox>
        <MessageBox>
          <span className={`message ${msgState ? 'success' : 'error'}`}>
            {resMsg}
          </span>
        </MessageBox>
        <EmailBox>
          {resImg ? (
            <BackgroundUserImage>
              <ProfileImg resImg={resImg} />
            </BackgroundUserImage>
          ) : null}
          <span>{resEmail}</span>
        </EmailBox>
      </ResponseBox>
      <NavBtnWrapper>
        <NavSubmitBtn
          disabled={disabledSubmit}
          type='submit'
          onClick={onSubmitHandler}>
          아이디찾기
        </NavSubmitBtn>
      </NavBtnWrapper>
    </IdWrapper>
  );
};

const IdWrapper = styled.div`
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
  :active {
    /* box-shadow: 0px 0px 0 rgb(0, 0, 0, 0.3);
    background-color: #bebebe !important; */
  }
`;

const ResponseBox = styled.div`
  width: 100%;
  height: 130px;
  padding-top: 10px;
`;

const MessageBox = styled.div`
  @media screen and (max-width: 1700px) {
    height: 40px;
    margin-top: 20px;
  }
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
    }
    font-size: 24px;
    font-weight: 600;
  }
`;

const EmailBox = styled.div`
  @media screen and (max-width: 1700px) {
    height: 60px;
    /* background-color: aqua; */
    margin-top: 00px;
  }
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    @media screen and (max-width: 1700px) {
      font-size: 20px;
    }
    font-size: 30px;
    font-weight: bold;
  }
`;

const BackgroundUserImage = styled.div`
  @media screen and (max-width: 1700px) {
    width: 44px;
    height: 44px;
  }
  width: 56px;
  height: 56px;
  margin: 10px;
  border-radius: 50%;
  background-color: #f6f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileImg = styled.div`
  @media screen and (max-width: 1700px) {
    width: 36px;
    height: 36px;
  }
  background-image: ${({ resImg }) => `url(${resImg})`};
  background-size: cover;
  background-position: center;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const NavBtnWrapper = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: 20px;
  }
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const NavSubmitBtn = styled.button`
  @media screen and (max-width: 1700px) {
    height: 60px;
    font-size: 20px;
  }
  width: 100%;
  height: 70px;
  border: none;
  border-radius: 50px;
  background-color: #e7e7e7;
  /* cursor: pointer; */
  background-color: ${(props) => (props.disabled ? '#c2d1ff' : '#3366FF')};
  color: #ffffff;
  /* :active {
    background-color: #1d51ee;
    color: #ffffff;
  } */
`;

export default FindId;
