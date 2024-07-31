import styled, { keyframes } from 'styled-components';

const moveIn = keyframes`
    from{
        opacity: 0;
    }to{
        opacity: 1;
    }
`;
export const Container = styled.div`
  position: relative;
`;

export const List = styled.div`
  position: absolute;
  padding: 10px;
  background: #d8d8d8;
  background: #000;
  border-radius: 5px;
  animation: ${moveIn} 0.3s linear;
  z-index: 9999;
`;
