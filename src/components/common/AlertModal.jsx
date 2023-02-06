import React from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { alertModalState, confirmModalState } from '../../recoil/recoilStore';

const AlertModal = () => {
  const [content, setContent] = useRecoilState(alertModalState);
  const [confirm, setConfirm] = useRecoilState(confirmModalState);

  return (
    <Background>
      <Wrap>
        {content.msg && <Message>{content.msg}</Message>}
        {confirm.msg && <Message>{confirm.msg}</Message>}
        <Button>
          {content.isOpen === true && (
            <button
              type='button'
              className='contentBtn'
              onClick={() => setContent({ msg: '', btn: '', isOpen: false })}>
              {content.btn}
            </button>
          )}
          {confirm.isOpen === true && (
            <>
              <button
                type='button'
                className='confirmBtn1'
                onClick={() =>
                  setConfirm({
                    msg: '',
                    btn: [],
                    isOpen: false,
                    isApprove: false,
                  })
                }>
                {confirm.btn[0]}
              </button>
              <button
                type='button'
                className='confirmBtn2'
                onClick={() =>
                  setConfirm({ ...confirm, isOpen: false, isApprove: true })
                }>
                {confirm.btn[1]}
              </button>
            </>
          )}
        </Button>
      </Wrap>
    </Background>
  );
};

const Background = styled.div`
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
`;

const Wrap = styled.div`
  background-color: white;
  width: 400px;
  height: 200px;
  box-sizing: border-box;
  padding: 22px 40px;
  border-radius: 20px;
  box-shadow: 2px 2px 32px rgba(10, 32, 98, 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Message = styled.div`
  height: 105px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 400;
  color: #242424;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  .contentBtn {
    width: 200px;
    height: 35px;
    border: none;
    border-radius: 50px;
    background-color: #242424;
    color: white;
    font-size: 16px;
    font-weight: 500;
  }
  .confirmBtn1 {
    width: 150px;
    height: 35px;
    background-color: #e7e7e7;
    color: #242424;
    border-radius: 50px;
    border: none;
    font-size: 16px;
    font-weight: 500;
  }
  .confirmBtn2 {
    width: 150px;
    height: 35px;
    background-color: #ff392b;
    color: #ffffff;
    border-radius: 50px;
    border: none;
    font-size: 16px;
    font-weight: 500;
  }
`;

export default AlertModal;
