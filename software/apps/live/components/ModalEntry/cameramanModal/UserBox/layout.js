import styled from 'styled-components';

export const Container = styled.div``;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;
export const Avatar = styled.div`
  width: 60px;
  height: 60px;
  background-image: ${props => (props.url ? `url(${props.url})` : '')};
  background-size: contain;
  background-repeat: no-repeat;
`;
export const Text = styled.div`
  font-size: 12px;
  color: #7b7b7b;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
`;
