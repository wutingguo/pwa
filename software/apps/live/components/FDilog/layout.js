import styled, { keyframes } from 'styled-components';

const moveIn = keyframes`
    from {
        opacity: 0;
        transform: scale(0);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
`;

export const Container = styled.div`
  padding: 0;
  margin: 0;
`;

export const Close = styled.div`
  border: none;
  background-color: transparent;
  font-size: 30px;
  position: absolute;
  right: 10px;
  top: 0px;
  color: #888;
  cursor: pointer;
  &:active {
    transform: scale(0.9);
  }
`;

export const Mask = styled.div`
  position: fixed;
  z-index: 2023;
  height: 100%;
  width: 100%;
  top: 0;
  bottom: 0;
  inset-inline-end: 0;
  inset-inline-start: 0;
  background: rgba(248, 248, 248, 0.85);
`;

export const Dialog = styled.div`
  position: relative;
  top: 200px;
  max-width: calc(100vw - 32px);
  margin: 0 auto;
  padding: 20px 24px;
  background: #fff;
  font-size: 14px;
  width: ${props => (props.width ? props.width : '50%')};
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.12);
  pointer-events: auto;
  animation: ${moveIn} 0.3s linear;
`;

export const WrapContent = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 2023;
  overflow: auto;
  inset-inline-end: 0;
  inset-inline-start: 0;
`;

export const Title = styled.div`
  opacity: 1;
  min-height: 50px;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 10px;
`;

export const Content = styled.div`
  opacity: 1;
  color: #606266;
  font-size: 14px;
  // word-break: break-all;
  margin-bottom: 10px;
`;
export const Footer = styled.div`
  text-align: right;
  margin-bottom: 10px;
`;

export const Button = styled.button`
  color: ${props => (props.theme === 'primary' ? '#fff' : 'red')};
  background: #222;
  padding: 5px 25px;
  border-radius: 5px;
  cursor: pointer;
`;
Button.defaultProps = {
  theme: 'primary',
};
