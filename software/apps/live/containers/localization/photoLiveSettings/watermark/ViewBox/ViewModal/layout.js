import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const Item = styled.div`
  margin-left: 16px;
  margin-bottom: 32px;
`;

export const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 180px;
  background: #f6f6f6;
`;

export const Text = styled.label`
  font-size: 12px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 12px;
  text-align: center;
  margin-top: 8px;
  display: block;
`;
