import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { userApi } from '../../apis/apiInstance';

import { io } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

const ChatBox = () => {
  const [socket, setSocket] = useState();

  const [isOpenchatBox, setIsOpenchatBox] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const [messageList, setMessageList] = useState([]);

  const [chatType, setChatType] = useState('챗봇');

  const [isAdmin, setIsAdmin] = useState(false);

  const [userId, setUserId] = useState(null);
  const [nickname, setNickname] = useState('');

  const [adminChatList, setAdminChatList] = useState([]);
  const [adminUser, setAdminUser] = useState('');
  const [adminRoom, setAdminRoom] = useState('');

  // ---------------------------------------------------------------

  //로그인한 경우 유저id, 닉네임 가져오기
  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      (async () => {
        const data = await userApi.get(
          `${process.env.REACT_APP_API_ENDPOINT}/api/users/find`
        );
        setUserId(data.data.user.userId);
        setNickname(data.data.user.nickname);
      })();
    }
  }, []);

  //어드민 id 배열
  const adminIdArr = process.env.REACT_APP_ADMIN_ID_ARR.split('|').map((i) =>
    Number(i)
  );
  //로그인한 유저의 id가 관리자 배열에 포함될 경우 admin화
  useEffect(() => {
    if (adminIdArr.includes(userId)) {
      setIsAdmin(true);
    }
  }, [userId]);

  //소켓 연결
  useEffect(() => {
    setSocket(io.connect(process.env.REACT_APP_SOCKET_ENDPOINT));
  }, []);

  //버튼 클릭 시 방에 입장
  const OpenChatBox = async () => {
    if (!isOpenchatBox) {
      setIsOpenchatBox(true);
      await socket.emit('join', {
        room: userId ? userId : null,
      });
      if (isAdmin) {
        setChatType('상담');
      }
    } else if (isOpenchatBox) {
      setIsOpenchatBox(false);
      setMessageList([]);
      setChatType('챗봇');
    }
  };
  // 방 입장 시 안내 문구
  useEffect(() => {
    socket?.on('join', (content, link) => {
      socket?.on('load', (chats) => {
        setMessageList(chats);
      });
      //챗 보내기
      if (content) {
        const hour =
          new Date(Date.now()).getHours() >= 10
            ? new Date(Date.now()).getHours()
            : '0' + new Date(Date.now()).getHours();
        const minute =
          new Date(Date.now()).getMinutes() >= 10
            ? new Date(Date.now()).getMinutes()
            : '0' + new Date(Date.now()).getMinutes();

        setMessageList((list) => [
          ...list,
          {
            _id: Date.now(),
            time: hour + ':' + minute,
            writer: '관리자',
            message: content,
            link: link,
          },
        ]);
      }
    });
  }, [socket]);
  // ---------------------------------------------------------------
  const chatTag = [
    {
      tagName: '건의하기',
      comment: '어떤 이메일로 건의하면 좋을까요?',
    },
    {
      tagName: '개발자',
      comment: '와우! 이 사이트를 어떤 개발자가 만들었죠?',
    },
    {
      tagName: '상담',
      comment: '채팅으로 직접 상담받고싶어요!',
    },
    {
      tagName: '설문조사',
      comment: '설문조사에 참여하고싶은데 어디에 하면 되나요?',
    },
  ];
  //input에 채팅 작성
  const writeValue = useCallback(({ target: { value } }) => {
    setInputValue(value);
  });
  //메세지 전송
  const sendFromUser = async (msg) => {
    if (isAdmin) {
      await socket.emit('adminSend', {
        room: adminRoom,
        message: msg,
        user: adminUser,
      });
    } else {
      if (msg.trim() !== '') {
        await socket.emit('chatting', {
          type: chatType,
          room: userId,
          message: msg,
          user: nickname ? nickname : socket.id,
        });
      }
    }
    // 내가 쓴 글 추가
    const hour =
      new Date(Date.now()).getHours() >= 10
        ? new Date(Date.now()).getHours()
        : '0' + new Date(Date.now()).getHours();
    const minute =
      new Date(Date.now()).getMinutes() >= 10
        ? new Date(Date.now()).getMinutes()
        : '0' + new Date(Date.now()).getMinutes();
    setMessageList((list) => [
      ...list,
      {
        _id: Date.now(),
        time: `${hour}:${minute}`,
        writer: nickname,
        message: msg,
      },
    ]);

    setInputValue('');
  };
  // 채팅 받기
  useEffect(() => {
    socket?.on('receive', (content, link) => {
      const hour =
        new Date(Date.now()).getHours() >= 10
          ? new Date(Date.now()).getHours()
          : '0' + new Date(Date.now()).getHours();
      const minute =
        new Date(Date.now()).getMinutes() >= 10
          ? new Date(Date.now()).getMinutes()
          : '0' + new Date(Date.now()).getMinutes();
      setMessageList((list) => [
        ...list,
        {
          _id: Date.now(),
          time: `${hour}:${minute}`,
          writer: 'another',
          message: content,
          link: link,
        },
      ]);
    });
  }, [socket]);
  // ---------------------------------------------------------------

  // 버튼 클릭 시 상담모드로 전환
  const callAdmin = () => {
    setChatType('상담');
  };
  const adminJoinRoom = async (roomData) => {
    await socket.emit('adminJoin', roomData.room);
    setAdminUser(roomData.user);
    setAdminRoom(roomData.room);
  };

  // 관리자 입장 문구 출력
  useEffect(() => {
    socket?.on('adminJoin', (msg) => {
      const hour =
        new Date(Date.now()).getHours() >= 10
          ? new Date(Date.now()).getHours()
          : '0' + new Date(Date.now()).getHours();
      const minute =
        new Date(Date.now()).getMinutes() >= 10
          ? new Date(Date.now()).getMinutes()
          : '0' + new Date(Date.now()).getMinutes();
      setMessageList((list) => [
        ...list,
        {
          _id: Date.now(),
          time: hour + ':' + minute,
          writer: 'another',
          message: msg,
        },
      ]);
    });
  }, [socket]);
  useEffect(() => {
    if (isAdmin) {
      socket?.on('getRooms', (data) => {
        setAdminChatList(data);
      });
    }
  }, [socket, isAdmin]);
  useEffect(() => {
    socket?.on('adminReceive', (msg) => {
      const hour =
        new Date(Date.now()).getHours() >= 10
          ? new Date(Date.now()).getHours()
          : '0' + new Date(Date.now()).getHours();
      const minute =
        new Date(Date.now()).getMinutes() >= 10
          ? new Date(Date.now()).getMinutes()
          : '0' + new Date(Date.now()).getMinutes();
      setMessageList((list) => [
        ...list,
        {
          _id: Date.now(),
          time: hour + ':' + minute,
          writer: 'another',
          message: msg,
        },
      ]);
    });
  }, [socket]);

  // ---------------------------------------------------------------
  return (
    <>
      <ChatBoxOpenBtn onClick={OpenChatBox}></ChatBoxOpenBtn>
      {isOpenchatBox && (
        <ChatBoxWrap isOpenchatBox={isOpenchatBox}>
          {isAdmin && (
            <div className='chattingList'>
              <div className='chatHeader'>
                <div className='title'>리스트</div>
              </div>
              <ul>
                {adminChatList?.map((list) => (
                  <li
                    key={list._id}
                    onClick={() => {
                      adminJoinRoom(list);
                    }}>
                    {list.room}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className='chattingZone'>
            <div className='chatHeader'>
              <div className='title'>문의넛츠</div>
            </div>
            <ChartBoxRoom isAdmin={isAdmin}>
              {!isAdmin && (
                <div className='roomTagWrap'>
                  {chatTag.map((tag) => (
                    <li
                      key={tag.tagName}
                      onClick={() => {
                        sendFromUser(tag.comment);
                      }}>
                      {tag.tagName}
                    </li>
                  ))}
                </div>
              )}
              <ScrollToBottom className='room'>
                <ul>
                  {messageList.map((list) =>
                    list.writer === nickname ? (
                      <li className='me' key={list._id}>
                        <div className='messageTime'>{list.time}</div>
                        <div className='messageBox'>{list.message}</div>
                      </li>
                    ) : (
                      <div key={list._id}>
                        <li>
                          <div className='messageBox'>
                            {list.message}
                            {list.link && (
                              <span
                                className='messageLink'
                                onClick={() => {
                                  window.open(list.link, '_blank');
                                }}>
                                이동하기
                              </span>
                            )}
                          </div>
                          <div className='messageTime'>{list.time}</div>
                        </li>
                        {list.message.includes('상담') && (
                          <button onClick={callAdmin}>연결하기</button>
                        )}
                      </div>
                    )
                  )}
                </ul>
              </ScrollToBottom>
              <div className='inputWrap'>
                <input
                  onChange={writeValue}
                  placeholder='메세지 입력'
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      e.nativeEvent.isComposing === false
                    ) {
                      sendFromUser(inputValue);
                    }
                  }}
                  value={inputValue}
                />
                <button onClick={() => sendFromUser(inputValue)}>send</button>
              </div>
            </ChartBoxRoom>
          </div>
        </ChatBoxWrap>
      )}
    </>
  );
};

export default ChatBox;

const ChatBoxOpenBtn = styled.div`
  position: fixed;
  right: 100px;
  bottom: 130px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: #3366ff;
  cursor: pointer;
`;
const ChatBoxWrap = styled.div`
  position: fixed;
  right: 100px;
  bottom: 200px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 3px 3px 10px 1px gray;
  background-color: white;
  display: flex;
  align-items: center;
  .chattingZone {
    width: 300px;
    height: 400px;
  }
  .chattingList {
    width: 200px;
    height: 400px;
    border-right: 1px solid #3366ff;
  }
  .chatHeader {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .chatHeader .title {
    font-size: 20px;
    padding: 10px;
    font-weight: bold;
    color: #ffffff;
  }
  .chattingZone .chatHeader {
    background-color: #3366ff;
    border-bottom: 1px solid #3366ff;
  }
  .chattingZone .chatHeader .title {
    color: #ffffff;
  }
  .chattingList .chatHeader {
    background-color: #ffffff;
    border-bottom: 1px solid #3366ff;
  }
  .chattingList .chatHeader .title {
    color: #3366ff;
  }
  .chattingList li {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 5px;
    cursor: pointer;
    border-bottom: 1px solid #d4d4d4;
  }
`;

const ChartBoxRoom = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .roomTagWrap {
    height: 50px;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    list-style: none;
  }
  .roomTagWrap li {
    display: inline;
    font-size: 13px;
    color: #ffffff;
    height: 30px;
    padding: 5px 10px;
    background-color: #3366ff;
    border-radius: 15px;
    cursor: pointer;
  }
  .room {
    width: 100%;
    height: ${({ isAdmin }) => (isAdmin ? '300px' : '250px')};
  }
  .room::-webkit-scrollbar {
    width: 10px;
  }
  .room::-webkit-scrollbar-thumb {
    border: 4px solid transparent;
    background-color: #535353;
    border-radius: 10px;
  }
  .room ul {
    list-style: none;
    padding: 5px;
    margin: 0;
  }
  .room li {
    display: flex;
    width: 100%;
    gap: 5px;
  }
  .room button {
    font-size: 14px;
    background-color: #3366ff;
    border: none;
    padding: 5px 15px;
    border-radius: 15px;
    color: #ffffff;
    margin-top: 10px;
  }
  .room li.me {
    justify-content: right;
  }
  .messageBox {
    display: block;
    max-width: 200px;
    padding: 10px;
    border-radius: 10px;
    background-color: #fcfdc7;
    margin-top: 5px;
    white-space: pre-wrap;
    word-break: break-all;
  }
  .messageLink {
    cursor: pointer;
    font-size: 13px;
    color: #3366ff;
    text-decoration: underline;
  }
  .room li.me .messageBox {
    background-color: #bab9f8;
  }
  .messageTime {
    font-size: 13px;
    color: #535353;
    display: flex;
    align-items: flex-end;
  }
  .inputWrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 5px;
    border-top: 1px solid #e5e5e5;
  }
  .inputWrap input {
    border: 1px solid #bab9f8;
    padding: 5px;
    border-radius: 5px;
    outline-color: #bab9f8;
    width: 230px;
  }
  .inputWrap button {
    background-color: #3366ff;
    border: none;
    color: #ffffff;
    padding: 5px;
    border-radius: 5px;
    outline-color: #bab9f8;
  }
`;
