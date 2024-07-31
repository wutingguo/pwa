import styled from 'styled-components';

export const Container = styled.div`
  background: #f6f6f6;
  border-radius: 4px;
  padding: 24px;
  width: ${props => (props?.width ? `${props.width}px` : '468px')};
`;
export const Title = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #222222;
  margin-bottom: 32px;
`;

export const Content = styled.div``;
