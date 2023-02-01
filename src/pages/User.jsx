import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoMdSettings } from 'react-icons/io';
import { api, userApi } from '../apis/apiInstance';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MypageTab from '../contents/MypageTab';
import qs from 'qs';
import MyLikeList from '../contents/MyLikeList';
import Allergy from '../contents/Allergy';
import MyReviews from '../contents/MyReview';

import { Mobile, Laptop, PC } from '../query/useMediaQuery';

const User = (props) => {
  const navigate = useNavigate();
  const [isTextClicked, setIsTextClicked] = useState(false);
  const [isFileClicked, setIsFileClicked] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loginCount, setLoginCount] = useState('');
  const [prevImg, setPrevImg] = useState('');
  const [newImg, setNewImg] = useState();
  const [newNickname, setNewNickname] = useState(nickname);
  const [serviceMsg, setServiceMsg] = useState('');
  const [delPassword, setDelPassword] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [loginType, setLoginType] = useState('');
  const [userId, setUserId] = useState('');
  const setUserImage = props.setuserimage;
  const setIsToken = props.setistoken;

  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;

  useEffect(() => {
    GetProfile();
    UserMessage();
  }, []);

  const GetProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setNickname(res.data.user.nickname);
      setLoginCount(res.data.user.loginCount);
      setImageUrl(res.data.user.imageUrl);
      setLoginType(res.data.user.loginType);
      setUserId(res.data.user.userId);
      setEmail(res.data.user.email);
    } catch (e) {
      console.log(e);
      alert('로그인 정보가 필요합니다.');
      setIsToken(false);
      localStorage.clear();
      navigate('/login');
    }
  };

  const UserMessage = async () => {
    try {
      const res = await api.get('api/posts');
      setServiceMsg(res.data.post);
    } catch (e) {
      console.log(e);
    }
  };

  const changeNickname = () => {
    setIsTextClicked(true);
  };

  const changesDone = () => {
    modifyNickname({ nickname: newNickname });
  };

  const modifyNickname = async (payload) => {
    try {
      const res = await userApi.put('api/users/update/nickname', payload);
      setIsTextClicked(false);
      setNickname(payload.nickname);
      alert(res.data.message);
    } catch (e) {
      console.log(e);
      alert('정보 수정에 실패하였습니다.');
    }
  };

  const imageInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const sizeLimit = 3 * 1024 * 1024;

    if (file.size > sizeLimit) {
      alert('업로드 가능한 최대 용량은 3MB입니다.');
      e.target.value = '';
    } else if (!file.type.includes('image')) {
      alert('이미지 파일만 업로드 가능합니다.');
      e.target.value = '';
    } else {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPrevImg(reader.result);
      };
      setNewImg(file);
      setIsFileClicked(true);
    }
  };

  const nickInput = (e) => {
    setNewNickname(e.target.value);
  };

  //서버에서 presigned url 받아옴
  const modifyImage = async () => {
    try {
      const res = await userApi.put('/api/users/update/image', {
        filename: newImg.name,
      });
      const presignedUrl = res.data.presignedUrl;
      setIsFileClicked(false);
      S3Upload(presignedUrl);
    } catch (e) {
      console.log(e);
    }
  };
  //presigned url로 이미지 보내기
  const S3Upload = async (presignedUrl) => {
    try {
      await axios.put(presignedUrl, newImg);
      alert('이미지 수정이 완료되었습니다.');
      setUserImage(prevImg);
    } catch (e) {
      alert(e);
    }
  };

  const defaultImgHandler = async () => {
    try {
      await userApi.put('/api/users/update/image');
      window.location.reload('/mypage');
    } catch (e) {
      console.log(e);
    }
  };

  const cancelChange = () => {
    setIsTextClicked(false);
  };

  const cancelImgChange = () => {
    setIsFileClicked(false);
    setPrevImg(imageUrl);
  };

  const sortLoginType = async () => {
    try {
      if (loginType !== 'Local') {
        await deleteAccount();
      } else {
        setIsShow(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAccount = async (password) => {
    if (window.confirm('정말 탈퇴하시겠습니까?😢')) {
      try {
        await userApi.delete('/api/users/delete', {
          data: {
            password,
          },
          withCredentials: true,
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('nickname');
        setIsToken(false);
        alert('회원탈퇴가 완료되었습니다.');
        navigate('/');
      } catch (e) {
        alert('비밀번호를 알맞게 입력해주세요.');
      }
    }
  };

  return (
    <Wrapper>
      {isShow && (
        <ModalBackground>
          <Modal>
            <Content>
              <SignupInfo>
                <PrimarySpan>회원 탈퇴하기</PrimarySpan>
                <SecondarySpan>
                  회원을 탈퇴하시려면, 본인 확인을 위해 비밀번호를 입력하세요.
                </SecondarySpan>
              </SignupInfo>
              <EmailBox>
                <EmailBoxBg>
                  <EmailBoxImg imageUrl={imageUrl} />
                </EmailBoxBg>
                <span>{email}</span>
              </EmailBox>
              <div className='form-floating form-width'>
                <input
                  type='password'
                  className='form-control'
                  onChange={(e) => {
                    setDelPassword(e.target.value);
                  }}
                  minLength={8}
                  maxLength={15}
                  placeholder='비밀번호'
                />
                <label>비밀번호</label>
              </div>
              <ModalBtnWrap>
                <button
                  className='cancel'
                  onClick={() => {
                    setIsShow(false);
                  }}>
                  취소하기
                </button>
                <button
                  className='proceed'
                  onClick={() => deleteAccount(delPassword)}>
                  탈퇴하기
                </button>
              </ModalBtnWrap>
            </Content>
          </Modal>
        </ModalBackground>
      )}
      <MyPageHeader>
        <span>마이페이지</span>
        <div className='deleteAccount'>
          <button onClick={sortLoginType}>회원탈퇴</button>
        </div>
      </MyPageHeader>
      <MyPageWrap>
        <ProfileImg>
          <BackgroundUserImage>
            <UserImage userImg={imageUrl} prevImg={prevImg}>
              <label htmlFor='file-input'>
                <IoMdSettings
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    color: 'white',
                  }}
                  size='30'
                />
              </label>
              <input
                id='file-input'
                type='file'
                accept='image/*'
                onChange={imageInput}
              />
            </UserImage>
          </BackgroundUserImage>
          {isFileClicked ? (
            <ModifyBtnBox>
              <CancelBtn type='button' onClick={cancelImgChange}>
                취소
              </CancelBtn>
              <FinishBtn type='button' onClick={modifyImage}>
                변경완료
              </FinishBtn>
            </ModifyBtnBox>
          ) : (
            <DefaultImgBtn type='button' onClick={defaultImgHandler}>
              기본이미지로 변경
            </DefaultImgBtn>
          )}
        </ProfileImg>
        <ProfileWrap>
          <NicknameBox>
            {!isTextClicked ? (
              <div style={{ display: 'flex', height: '30px' }}>
                <Nickname>{nickname ? `${nickname}님` : 'OOO님'}</Nickname>
                <div className='wrapNickname'>
                  <button className='editNickname' onClick={changeNickname} />
                </div>
              </div>
            ) : (
              <NicknameInput>
                <input
                  type='text'
                  defaultValue={nickname}
                  onChange={nickInput}
                  maxLength={20}
                />
                <button className='o' onClick={changesDone}>
                  O
                </button>
                <button className='x' onClick={cancelChange}>
                  X
                </button>
              </NicknameInput>
            )}
            <PC>
              <ProfileMsg>
                필너츠에 오신 것을
                <br />
                환영합니다!
              </ProfileMsg>
            </PC>
          </NicknameBox>
          <div style={{ display: 'flex', marginTop: 'auto' }}>
            <Laptop>
              <ProfileMsg>
                필너츠에 오신 것을
                <br />
                환영합니다!
              </ProfileMsg>
            </Laptop>
            <CalenderWrap>
              <div className='calendar'>
                <span>출석일수</span>
                <h1>{`${loginCount}일`}</h1>
              </div>
            </CalenderWrap>
          </div>
        </ProfileWrap>
        <BoxWrap>
          <Box>
            <EventBox to='/event'>
              <h1>EVENT</h1>
              <PC>
                <div>
                  간단한 설문조사하고 <br /> <span>기프티콘</span> 받아가세요!
                </div>
              </PC>
              <Laptop>
                <div>
                  간단한
                  <br />
                  설문조사하고
                  <br /> <span>기프티콘</span>
                  <br /> 받아 가세요!
                </div>
              </Laptop>
              <div className='image' />
            </EventBox>
          </Box>
          <Box>
            <div className='messageBox'>
              <h1>필너츠 꿀팁</h1>
              <div className='image' />
              <span>마우스를 가져다 대보세요</span>
            </div>
            <div className='messagePopup'>
              <h2>필너츠 꿀팁</h2>
              <div>{serviceMsg}</div>
            </div>
          </Box>
        </BoxWrap>
      </MyPageWrap>
      <MypageTab query={query} />
      {query === '내가 찜한 의약품' && <MyLikeList />}
      {query === '나의 알레르기' && <Allergy />}
      {query === '내가 쓴 리뷰' && <MyReviews />}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const MyPageHeader = styled.div`
  @media screen and (max-width: 1700px) {
    margin-bottom: 20px;
    min-width: 1024px;
  }
  width: 100%;
  margin-bottom: 53px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    @media screen and (max-width: 1700px) {
      font-size: 26px;
    }
    font-size: 32px;
    font-weight: 700;
  }
  button {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
    }
    width: 100px;
    height: 30px;
    border: none;
    border-radius: 50px;
    background-color: #242424;
    color: #f0f0f0;
    font-size: 15px;
  }
  .deleteAccount {
    position: relative;
    .inputWrap {
      display: flex;
      flex-direction: column;
      width: 230px;
      margin: 25px 10px 10px 10px;
    }
    span {
      font-size: 18px;
      margin: auto;
    }
    input {
      background-color: #a3a3a3;
      border: none;
      border-radius: 50px;
      width: 230px;
      height: 40px;
      outline: none;
      text-indent: 10px;
      margin-top: 15px;
      margin-bottom: 3px;
      padding: 0 10px;
    }
    button {
      border: none;
      border-radius: 50px;
      width: 90px;
    }
  }
`;

const ModalBackground = styled.div`
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  min-height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
`;

const Modal = styled.div`
  @media screen and (max-width: 1700px) {
    width: 500px;
    height: 400px;
    /* background-color: aliceblue; */
  }
  background-color: #ffff;
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 660px;
  height: 564px;
  z-index: 2;
`;

const Content = styled.div`
  @media screen and (max-width: 1700px) {
    width: 80%;
    height: 80%;
    /* background-color: #bce253; */
  }
  width: 499px;
  height: 483px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .form-floating {
    margin-top: -20px;
  }
  .form-control {
    @media screen and (max-width: 1700px) {
      width: 100%;
      margin-bottom: 0px;
    }
    width: 480px;
    margin-bottom: 70px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #919191;
    :focus {
      outline: none;
      box-shadow: none;
      border-bottom: 1px solid #919191;
    }
  }
  label {
    color: #868686;
  }
`;

const ModalBtnWrap = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  .cancel {
    @media screen and (max-width: 1700px) {
      width: 180px;
      height: 40px;
    }
    width: 228px;
    height: 44px;
    border-radius: 50px;
    border: none;
    background-color: #e7e7e7;
  }
  .proceed {
    @media screen and (max-width: 1700px) {
      width: 180px;
      height: 40px;
    }
    width: 228px;
    height: 44px;
    border-radius: 50px;
    border: none;
    background-color: #ffb0aa;
    color: white;
  }
`;

const SignupInfo = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: 0px;
  }
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const PrimarySpan = styled.span`
  @media screen and (max-width: 1700px) {
    font-size: 27px;
    margin-bottom: 5px;
  }
  font-size: 32px;
  font-weight: 700;
  color: #242424;
`;

const SecondarySpan = styled.span`
  @media screen and (max-width: 1700px) {
    font-size: 14px;
  }
  font-size: 15px;
  color: #868686;
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

const EmailBoxBg = styled.div`
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

const EmailBoxImg = styled.div`
  @media screen and (max-width: 1700px) {
    width: 36px;
    height: 36px;
  }
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
  background-size: cover;
  background-position: center;
  width: 46px;
  height: 46px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
`;

const MyPageWrap = styled.div`
  @media screen and (max-width: 1700px) {
    gap: 18px;
    min-width: 1024px;
  }
  width: 100%;
  height: 225px;
  display: flex;
  align-items: center;
  gap: 30px;
`;

const BackgroundUserImage = styled.div`
  @media screen and (max-width: 1700px) {
    width: 130px;
    height: 130px;
  }
  width: 180px;
  height: 180px;
  border-radius: 150px;
  background-color: #f6f7fa;
`;

const ProfileImg = styled.div`
  @media screen and (max-width: 1700px) {
    height: 170px;
  }
  width: 178px;
  height: 225px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserImage = styled.div`
  @media screen and (max-width: 1700px) {
    width: 108px;
    height: 108px;
    margin: 11px 11px;
  }
  margin: 15px 15px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-image: ${(props) =>
    props.prevImg
      ? `url(${props.prevImg})`
      : props.userImg
      ? `url(${props.userImg})`
      : null};
  background-size: cover;
  background-position: center;
  position: relative;

  label {
    @media screen and (max-width: 1700px) {
      top: 76px;
      left: 84px;
    }
    width: 38px;
    height: 38px;
    border-radius: 50%;
    position: absolute;
    top: 110px;
    left: 120px;
    background-color: #868686;
    cursor: pointer;
  }
  input {
    display: none;
  }
`;

const ModifyBtnBox = styled.div`
  @media screen and (max-width: 1700px) {
    margin-top: auto;
    gap: 7px;
  }
  display: flex;
  gap: 10px;
`;

const CancelBtn = styled.button`
  @media screen and (max-width: 1700px) {
    margin-top: auto;
    width: 58px;
    height: 30px;
    font-size: 14px;
  }
  width: 84px;
  height: 34px;
  margin-top: 16px;
  border: none;
  border-radius: 50px;
  background-color: #d0d0d0;
  color: #242424;
  font-weight: 700;
  cursor: pointer;
`;

const FinishBtn = styled.button`
  @media screen and (max-width: 1700px) {
    margin-top: auto;
    height: 30px;
    font-size: 14px;
  }
  width: 84px;
  height: 34px;
  margin-top: 16px;
  border: none;
  border-radius: 50px;
  background-color: #242424;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const DefaultImgBtn = styled.button`
  @media screen and (max-width: 1700px) {
    margin-top: auto;
    height: 30px;
    font-size: 14px;
  }
  width: 150px;
  height: 34px;
  margin-top: 16px;
  border: none;
  border-radius: 50px;
  background-color: #d0d0d0;
  color: #242424;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
`;

const ProfileWrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 320px;
    height: 170px;
    padding: 20px 26px;
    /* background-color: aqua; */
    flex-direction: column;
  }
  background-color: #f6f7fa;
  width: 466px;
  height: 225px;
  display: flex;
  box-sizing: border-box;
  padding: 37px 40px;
  border-radius: 24px;
  align-content: space-around;
`;

const NicknameBox = styled.div`
  @media screen and (max-width: 1700px) {
    width: 100%;
    height: 35px;
    padding-top: 5px;
  }
  width: 60%;
  .wrapNickname {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  button {
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;
  }
  .editNickname {
    @media screen and (max-width: 1700px) {
      width: 26px;
      height: 26px;
    }
    width: 38px;
    height: 38px;
    background-image: url('/assets/image/닉네임수정아이콘.png');
    background-size: cover;
    background-position: center;
  }
`;

const Nickname = styled.div`
  @media screen and (max-width: 1700px) {
    font-size: 18px;
    margin-right: 3px;
  }
  height: 42px;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  float: left;
  margin-right: 5px;
`;

const NicknameInput = styled.div`
  @media screen and (max-width: 1700px) {
    height: 32px;
    margin-top: 5px;
    width: 100%;
    background-color: white;
    border-radius: 30px;
  }
  height: 42px;
  display: flex;
  align-items: flex-end;
  position: relative;

  input {
    @media screen and (max-width: 1700px) {
      height: 32px;
      width: 72%;
      padding-left: 12px;
    }
    width: 220px;
    height: 35px;
    border: none;
    border-radius: 30px;
    text-indent: 10px;

    &:focus {
      outline: none;
    }
  }
  button {
    padding: 0;
    width: 25px;
    height: 25px;
    border: none;
    border-radius: 50px;
    background-color: #d0d0d0;
    cursor: pointer;
  }
  .x {
    @media screen and (max-width: 1700px) {
      top: 4px;
      right: 5px;
    }
    position: absolute;
    top: 11px;
    right: 35px;
  }
  .o {
    @media screen and (max-width: 1700px) {
      top: 4px;
      right: 36px;
    }
    position: absolute;
    top: 11px;
    right: 63px;
  }
`;

const ProfileMsg = styled.div`
  @media screen and (max-width: 1700px) {
    width: 150px;
    font-size: 16px;
    margin-top: 40px;
  }
  width: 250px;
  height: 72px;
  margin-top: 38px;
  font-size: 18px;
  font-weight: 700;
  color: #868686;
`;

const CalenderWrap = styled.div`
  @media screen and (max-width: 1700px) {
    width: 40%;
    margin-left: auto;
  }
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .calendar {
    @media screen and (max-width: 1700px) {
      width: 80px;
      height: 85px;
      margin-top: 5px;
    }
    background-image: url('/assets/image/캘린더.png');
    background-size: cover;
    background-position: center;
    width: 130px;
    height: 138px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    span {
      @media screen and (max-width: 1700px) {
        font-size: 13px;
        margin-top: 34px;
      }
      margin-top: 40px;
      font-size: 18px;
      font-weight: 600;
      color: #868686;
    }
    h1 {
      @media screen and (max-width: 1700px) {
        font-size: 24px;
      }
      font-size: 40px;
      font-weight: bold;
    }
  }
`;
const EventBox = styled(Link)`
  @media screen and (max-width: 1700px) {
    width: 235px;
    height: 170px;
  }
  background-color: #cefbd8;
  width: 324px;
  height: 225px;
  border-radius: 24px;
  text-decoration: none;
  color: #0da27a !important;
  position: absolute;
  cursor: pointer;

  h1 {
    @media screen and (max-width: 1700px) {
      font-size: 24px;
      padding-top: 15px;
    }
    text-align: center;
    padding-top: 20px;
    font-size: 28px;
    font-weight: 700;
  }
  div {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
      top: 56px;
      left: 32px;
    }
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    top: 110px;
    left: 22px;
    line-height: 24px;
  }
  span {
    @media screen and (max-width: 1700px) {
      font-size: 15px;
    }
    color: #ff8365;
    font-weight: 900;
  }
  .image {
    @media screen and (max-width: 1700px) {
      top: 50px;
      left: 136px;
      width: 70px;
      height: 100px;
    }
    width: 87px;
    height: 127px;
    background-image: url('/assets/image/설문아이콘.png');
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 70px;
    left: 213px;
  }
`;

const BoxWrap = styled.div`
  @media screen and (max-width: 1700px) {
    gap: 18px;
  }
  display: flex;
  gap: 30px;
`;

const Box = styled.div`
  @media screen and (max-width: 1700px) {
    width: 235px;
    height: 170px;
  }
  width: 324px;
  height: 225px;
  position: relative;
  display: flex;
  .messageBox {
    @media screen and (max-width: 1700px) {
      width: 235px;
      height: 170px;
    }
    background-color: #d6e4ff;
    width: 324px;
    height: 225px;
    border-radius: 24px;
    color: #2649d8;
    cursor: pointer;

    h1 {
      @media screen and (max-width: 1700px) {
        font-size: 23px;
        padding-top: 15px;
      }
      text-align: center;
      padding-top: 20px;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .image {
      @media screen and (max-width: 1700px) {
        width: 86px;
        height: 54px;
      }
      width: 135px;
      height: 84px;
      background-image: url('/assets/image/꿀팁아이콘.png');
      background-size: cover;
      background-position: center;
      justify-content: center;
      align-items: center;
      margin: auto;
    }
    span {
      @media screen and (max-width: 1700px) {
        font-size: 15px;
      }
      margin-top: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 18px;
      color: #102492;
      font-weight: 700;
    }
  }

  .messagePopup {
    @media screen and (max-width: 1700px) {
      width: 100%;
      height: 100%;
    }
    display: none;
    background: rgba(255, 255, 255, 0.43);
    backdrop-filter: blur(15px);
    width: 324px;
    height: 225px;
    padding: 20px;
    overflow: hidden;
    box-sizing: border-box;
    text-align: center;
    align-items: center;
    color: #242424;
    border-radius: 24px;
    position: absolute;
    top: 0;
    h2 {
      @media screen and (max-width: 1700px) {
        font-size: 23px;
        margin-top: -5px;
        margin-bottom: 2px;
      }
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 20px;
    }
    div {
      @media screen and (max-width: 1700px) {
        font-size: 13px;
      }
      width: 100%;
      height: 125px;
      word-break: keep-all;
      display: flex;
      align-items: center;
      text-align: center;
    }
  }

  .messageBox:hover + .messagePopup {
    display: block;
    pointer-events: none;
  }
`;

export default User;
