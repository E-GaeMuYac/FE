import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { io } from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

const ChatBox = () => {
  const [isOpenchatBox, setIsOpenchatBox] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const [messageList, setMessageList] = useState([]);

  // ---------------------------------------------------------------

  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io.connect(process.env.REACT_APP_SOCKET_ENDPOINT));
  }, []);

  const OpenChatBox = async () => {
    if (!isOpenchatBox) {
      setIsOpenchatBox(true);
      await socket.emit('join', { room: socket.id });
    } else if (isOpenchatBox) {
      setIsOpenchatBox(false);
    }
  };

  const writeValue = useCallback(({ target: { value } }) => {
    setInputValue(value);
  });
  const sendMessage = async () => {
    await socket.emit('chatting', {
      room: socket.id,
      message: inputValue,
    });

    // 내가 쓴 글 추가
    const hour =
      new Date(Date.now()).getHours() > 10
        ? new Date(Date.now()).getHours()
        : '0' + new Date(Date.now()).getHours();
    const minute =
      new Date(Date.now()).getMinutes() > 10
        ? new Date(Date.now()).getMinutes()
        : '0' + new Date(Date.now()).getMinutes();
    setMessageList((list) => [
      ...list,
      {
        messageId: Date.now(),
        time: hour + ':' + minute,
        writer: '사용자',
        message: inputValue,
      },
    ]);

    setInputValue('');
  };

  useEffect(() => {
    socket?.on('join', (data) => console.log(socket.request));
    socket?.on('receive', (content, link) => {
      if (content) {
        const hour =
          new Date(Date.now()).getHours() > 10
            ? new Date(Date.now()).getHours()
            : '0' + new Date(Date.now()).getHours();
        const minute =
          new Date(Date.now()).getMinutes() > 10
            ? new Date(Date.now()).getMinutes()
            : '0' + new Date(Date.now()).getMinutes();

        setMessageList((list) => [
          ...list,
          {
            messageId: Date.now(),
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
    { tagName: '건의하기', comment: '어떤 이메일로 건의하면 좋을까요?' },
    { tagName: '개발자', comment: '와우! 이 사이트를 어떤 개발자가 만들었죠?' },
    {
      tagName: '설문조사',
      comment: '설문조사에 참여하고싶은데 어디에 하면 되나요?',
    },
  ];

  const tagChat = async (comment) => {
    await socket.emit('chatting', {
      room: socket.id,
      message: comment,
    });

    // 내가 쓴 글 추가
    const hour =
      new Date(Date.now()).getHours() > 10
        ? new Date(Date.now()).getHours()
        : '0' + new Date(Date.now()).getHours();
    const minute =
      new Date(Date.now()).getMinutes() > 10
        ? new Date(Date.now()).getMinutes()
        : '0' + new Date(Date.now()).getMinutes();
    setMessageList((list) => [
      ...list,
      {
        messageId: Date.now(),
        time: hour + ':' + minute,
        writer: '사용자',
        message: comment,
      },
    ]);
  };

  // ---------------------------------------------------------------
  return (
    <>
      <ChatBoxOpenBtn onClick={OpenChatBox}></ChatBoxOpenBtn>
      <ChatBoxWrap isOpenchatBox={isOpenchatBox}>
        <ChatHeader>
          <div className='title'>문의넛츠</div>
        </ChatHeader>
        <ChartBoxRoom>
          <div className='roomTagWrap'>
            {chatTag.map((tag) => (
              <li
                key={tag.tagName}
                onClick={() => {
                  tagChat(tag.comment);
                }}>
                {tag.tagName}
              </li>
            ))}
          </div>
          <ScrollToBottom className='room'>
            <ul>
              {messageList.map((list) =>
                list.writer === '사용자' ? (
                  <li className='me' key={list.messageId}>
                    <div className='messageTime'>{list.time}</div>
                    <div className='messageBox'>{list.message}</div>
                  </li>
                ) : (
                  <li key={list.messageId}>
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
                )
              )}
            </ul>
          </ScrollToBottom>
          <div className='inputWrap'>
            <input
              onChange={writeValue}
              placeholder='메세지 입력'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
              value={inputValue}
            />
            <button onClick={sendMessage}>send</button>
          </div>
        </ChartBoxRoom>
      </ChatBoxWrap>
    </>
  );
};

export default ChatBox;

const ChatBoxOpenBtn = styled.div`
  position: fixed;
  right: 100px;
  bottom: 100px;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: #3366ff;
  cursor: pointer;
`;
const ChatBoxWrap = styled.div`
  display: ${({ isOpenchatBox }) => (isOpenchatBox ? 'block' : 'none')};
  position: fixed;
  right: 100px;
  bottom: 170px;
  width: 300px;
  height: 400px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 3px 3px 10px 1px gray;
  background-color: white;
`;
const ChatHeader = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #3366ff;
  .title {
    font-size: 20px;
    padding: 10px;
    font-weight: bold;
    color: #ffffff;
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
    height: 250px;
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
