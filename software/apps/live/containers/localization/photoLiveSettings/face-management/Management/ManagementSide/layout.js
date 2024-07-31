import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 300px;
  background: #f6f6f6;
  padding: 24px 40px;
  box-sizing: border-box;
  overflow-y: auto;
`;

export const Title = styled.div`
  font-size: 16px;
  color: #3a3a3a;
  line-height: 19px;
  text-align: center;
`;
export const MenuList = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
`;
