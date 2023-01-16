import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoMdSettings } from 'react-icons/io';
import { FaPen } from 'react-icons/fa';
import { api, userApi } from '../apis/apiInstance';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGetLikeQuery } from '../query/likeQuery';

const User = (props) => {
  const navigate = useNavigate();
  const [likesArr, setLikesArr] = useState([]);
  const [isTextClicked, setIsTextClicked] = useState(false);
  const [isFileClicked, setIsFileClicked] = useState(false);
  const [nickname, setNickname] = useState('');
  const [imageUrl, setImageUrl] = useState('/assets/image/기본이미지.png');
  const [loginCount, setLoginCount] = useState('');
  const [prevImg, setPrevImg] = useState('');
  const [newImg, setNewImg] = useState();
  const [newNickname, setNewNickname] = useState(nickname);
  const [serviceMsg, setServiceMsg] = useState('');
  const SetUserImage = props.setuserimage;

  useEffect(() => {
    GetProfile();
    LikesList();
    UserMessage();
  }, []);

  const GetProfile = async () => {
    try {
      const res = await userApi.get('api/users/find');
      setNickname(res.data.user.nickname);
      setLoginCount(res.data.user.loginCount);
      setImageUrl(res.data.user.imageUrl);
    } catch (e) {
      console.log(e);
      alert('로그인 정보가 필요합니다.');
      navigate('/login');
    }
  };

  const LikesList = async () => {
    try {
      const res = await userApi.get('api/products/dibs');
      setLikesArr(res.data);
    } catch (e) {
      console.log(e);
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

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPrevImg(reader.result);
      };
      setNewImg(file);
    }
    setIsFileClicked(true);
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
      SetUserImage(prevImg);
    } catch (e) {
      alert(e);
    }
  };

  const cancelChange = () => {
    setIsTextClicked(false);
  };

  const cancelImgChange = () => {
    setIsFileClicked(false);
    setPrevImg(imageUrl);
  };

  // ---------------------------------------------------------------------------
  const [likeList, setLikeList] = useState([]);

  const { data } = useGetLikeQuery();

  useEffect(() => {
    if (data) {
      setLikeList(data.data);
    }
  }, [data]);
  // ---------------------------------------------------------------------------

  return (
    <Wrapper>
      <MyPageHeader>
        <span>마이페이지</span>
        <button>회원탈퇴</button>
      </MyPageHeader>
      <MyPageWrap>
        <ProfileImg>
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
            <input id='file-input' type='file' onChange={imageInput} />
          </UserImage>
          {isFileClicked ? (
            <ModifyBtnBox>
              <CancelBtn type='button' onClick={cancelImgChange}>
                취소
              </CancelBtn>
              <FinishBtn type='button' onClick={modifyImage}>
                변경완료
              </FinishBtn>
            </ModifyBtnBox>
          ) : null}
        </ProfileImg>
        <NicknameBox>
          {!isTextClicked ? (
            <Nickname>
              {nickname ? `${nickname}님` : 'OOO님'}
              <button onClick={changeNickname}>
                <FaPen />
              </button>
            </Nickname>
          ) : (
            <NicknameInput>
              <input type='text' defaultValue={nickname} onChange={nickInput} />
              <button onClick={changesDone}>변경완료</button>
              <button onClick={cancelChange}>취소</button>
            </NicknameInput>
          )}

          <ProfileMsg>필너츠를 이용해주셔서 감사합니다.</ProfileMsg>
        </NicknameBox>
        <Box>
          <EventBox to='/event'>
            <h1>EVENT</h1>
            <div>
              간단한 설문조사하고 <br /> <span>기프티콘</span> 받아가세요!
            </div>
            <div className='image' />
          </EventBox>
        </Box>
        <Box>
          <div className='messageBox'>
            <h1>건강꿀팁</h1>
            <div className='image' />
            <span>마우스를 가져다대보세요</span>
          </div>
          <div className='messagePopup'>
            <h2>건강꿀팁</h2>
            <span>{serviceMsg}</span>
          </div>
        </Box>
      </MyPageWrap>
      <LikelistHeader>
        <span>찜한 의약품 목록 ({likeList.length}개)</span>
      </LikelistHeader>
      <LikeList>
        {/* 임시 */}
        {likeList.map((list) => (
          <LikeCard key={list.medicineId}>
            <CardImg image={list.itemImage}></CardImg>
            <CardName>{list.itemName}</CardName>
            <CardDesc>
              <div>{list.etcOtcCode}</div>
              <hr />
              <div>{list.entpName}</div>
            </CardDesc>
            <CardTag>{list.productType}</CardTag>
            <ButtonWrap>
              <LikeBtnBg>
                <LikeBtnLg />
              </LikeBtnBg>
              <HoldBtn>비교함 담기</HoldBtn>
            </ButtonWrap>
          </LikeCard>
        ))}
      </LikeList>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const MyPageHeader = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    margin-left: 20px;
    font-size: 32px;
    font-weight: 700;
  }
  button {
    margin-right: 20px;
    width: 100px;
    height: 30px;
    border: none;
    border-radius: 50px;
    background-color: #d0d0d0;
    color: #868686;
  }
`;

const MyPageWrap = styled.div`
  width: 100%;
  height: 225px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ProfileImg = styled.div`
  width: 178px;
  height: 225px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserImage = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background-image: ${(props) =>
    props.prevImg
      ? `url(${props.prevImg})`
      : props.userImg
      ? `url(${props.userImg})`
      : `url('https://mblogthumb-phinf.pstatic.net/MjAxODAzMTFfMTkw/MDAxNTIwNzE1NzE3NzA2.fnxmFYSU71Rdn_WXjEq1SmWXlltr0tMEY4ADB7iVqbkg.qk63bfvJvQPNzxdMEQnVH6n4cROAM4zXy8UR5ZybKKUg.PNG.osy2201/15.png?type=w800')`};
  background-size: cover;
  background-position: center;
  position: relative;

  label {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    position: absolute;
    top: 117px;
    left: 128px;
    background-color: #868686;
    cursor: pointer;
  }
  input {
    display: none;
  }
`;

const ModifyBtnBox = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelBtn = styled.button`
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

const NicknameBox = styled.div`
  background-color: #ebebeb;
  width: 466px;
  height: 225px;
  box-sizing: border-box;
  padding: 30px 40px;
  border-radius: 24px;
`;

const Nickname = styled.span`
  height: 42px;
  font-size: 36px;
  font-weight: 700;

  button {
    width: 25px;
    height: 25px;
    border: none;
    border-radius: 50%;
    background-color: transparent;
    cursor: pointer;
  }
`;

const NicknameInput = styled.div`
  height: 42px;
  display: flex;
  align-items: flex-end;

  input {
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
    margin-left: 8px;
    width: 100px;
    height: 30px;
    border: none;
    border-radius: 50px;
    background-color: #d0d0d0;
    cursor: pointer;
  }
`;

const ProfileMsg = styled.div`
  width: 250px;
  height: 72px;
  margin-top: 50px;
  font-size: 24px;
  font-weight: 700;
  color: #868686;
`;

const EventBox = styled(Link)`
  background-color: #cefbd8;
  width: 324px;
  height: 225px;
  border-radius: 24px;
  text-decoration: none;
  color: #0da27a;
  position: absolute;
  cursor: pointer;

  h1 {
    position: absolute;
    margin: 0;
    top: 20px;
    left: 110px;
  }
  div {
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    top: 100px;
    left: 20px;
    line-height: 30px;
  }
  span {
    color: #ff8365;
    font-weight: 900;
  }
  .image {
    width: 87px;
    height: 127px;
    background-image: url('/assets/image/설문아이콘.png');
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 60px;
    left: 210px;
  }
`;

const Box = styled.div`
  width: 324px;
  height: 225px;
  position: relative;

  .messageBox {
    position: absolute;
    background-color: #d6e4ff;
    width: 324px;
    height: 225px;
    border-radius: 24px;
    color: #2649d8;
    cursor: pointer;
    &:hover {
      filter: blur(10px);
    }

    h1 {
      position: absolute;
      margin: 0;
      top: 20px;
      left: 95px;
    }
    .image {
      width: 135px;
      height: 84px;
      background-image: url('/assets/image/꿀팁아이콘.png');
      background-size: cover;
      background-position: center;
      position: absolute;
      top: 75px;
      left: 95px;
    }
    span {
      position: absolute;
      bottom: 30px;
      left: 70px;
    }
  }

  .messagePopup {
    display: none;
    background-color: rgba(0, 0, 0, 0.5);
    width: 324px;
    height: 225px;
    padding: 20px;
    box-sizing: border-box;
    text-align: center;
    align-items: center;
    color: white;
    border-radius: 24px;
    position: absolute;
    top: 0;
    span {
      width: 500px;
      word-break: keep-all;
    }
  }

  .messageBox:hover + .messagePopup {
    display: block;
    pointer-events: none;
  }
`;

// const MessageBox = styled.div``;

// const MessagePopup = styled.div`
//   /* display: none; */
// `;

const LikelistHeader = styled.div`
  margin-top: 60px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;

  span {
    margin-left: 20px;
    font-size: 32px;
    font-weight: 700;
  }
`;

const LikeList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 218px;
`;

const LikeCard = styled.li`
  padding: 30px 34px;
  width: 324px;
  height: 360px;
  border-radius: 25px;
  box-shadow: 0px -2px 24px #c2c1c1;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const CardImg = styled.div`
  width: 100%;
  height: 110px;
  background-image: ${({ image }) =>
    image
      ? `url(${image})`
      : `url('data:image/png;base64,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')`};
  background-size: contain;
  background-position: center;
  margin-bottom: 24px;
  background-repeat: no-repeat;
`;

const CardName = styled.div`
  margin-bottom: 22px;
  width: 100%;
  height: 29px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDesc = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  margin-bottom: 14px;

  div {
    width: 125px;
    height: 22px;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
    color: #868686;
  }
  hr {
    width: 2px;
    height: 100%;
    border: none;
    background-color: #d9d9d9;
    margin: 0 8px;
  }
`;

const CardTag = styled.div`
  line-height: 15px;
  margin-bottom: 18px;
  padding: 10px;
  border-radius: 5px;
  background-color: #ebebeb;
  font-size: 14px;
  font-weight: bold;
`;

const ButtonWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 38px;
`;

const LikeBtnBg = styled.div`
  width: 38px;
  height: 100%;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LikeBtnLg = styled.div`
  width: 26px;
  height: 26px;
  background-image: url('/assets/image/icon_heart1.png');
  background-size: cover;
  background-position: center;
`;

const HoldBtn = styled.button`
  width: 214px;
  height: 100%;
  background-color: #868686;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

export default User;
