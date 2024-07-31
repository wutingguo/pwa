import styled from 'styled-components';

export const Containter = styled.div``;

export const List = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const AddItem = styled.div`
  width: 120px;
  height: 120px;
  background: #f6f6f6;
  border: 1px solid #d8d8d8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
`;

// export const Item = styled.div`
//   width: 120px;
//   height: 120px;
//   background: #f6f6f6;
//   border: 1px solid #d8d8d8;
//   margin: 0 10px;
// `;

export const Lable = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 20px;
`;

export const Icon = styled.div`
  font-size: 14px;
  font-weight: 400;
  width: 20px;
  line-height: 20px;
  margin-bottom: 4px;
`;

export const Tip = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 18px;
  padding: 10px;
  white-space: break-spaces;
  p {
    margin: 0;
    padding: 0;
  }
`;
