import styled, { keyframes } from 'styled-components';

const move = keyframes`
   0% {
    transform: translateY(-50%);
  }

  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  position: fixed;
  top: 50px;
  left: 0;
  pointer-events: none;
  z-index: 9999999;
  font-size: 14px;
`;
export const Content = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0px 0px 15px 2px #eee;
  pointer-events: all;
  background: #fff;
  animation: ${move} 100ms;
`;

export const Icon = styled.span`
  margin-right: 5px;
  line-height: 10px;
  svg {
    width: 20px;
  }
`;

export const Text = styled.span`
  color: rgba(0, 0, 0, 0.88);
`;
