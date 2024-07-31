import styled from 'styled-components';

export const Container = styled.div`
  height: 40px;
  border: 1px solid #d8d8d8;
  width: 100%;
  outline: none;
  font-size: 14px;
  padding: 0 10px;
  box-sizing: border-box;
  line-height: 40px;
  cursor: ${props => (props.disabled ? 'not-allowed' : '')};
  background: ${props => (props.disabled ? '#f2f2f2' : '')};
`;
