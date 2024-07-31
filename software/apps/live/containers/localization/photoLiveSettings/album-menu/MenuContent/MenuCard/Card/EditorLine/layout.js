import styled from 'styled-components';

export const Line = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  &.block {
    display: block;
  }
`;
export const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  line-height: 14px;
  margin-right: 10px;
`;
export const Bottom = styled.div`
  text-align: center;
`;

export const Tip = styled.div`
  display: flex;
  margin-top: 20px;
  .label {
    width: 100px;
    font-size: 12px;
    font-weight: 400;
    color: #7b7b7b;
    line-height: 18px;
  }
  .textContent {
    font-size: 12px;
    font-weight: 400;
    color: #7b7b7b;
    line-height: 18px;
    p {
      margin: 0;
      padding: 0;
    }
  }
`;
