import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  background: #fff;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Overlay = styled.div`
  position: absolute;
  display: ${props => (props.show ? 'block' : 'none')};
  top: 0;
  left: 155px;
  z-index: 1;
`;
