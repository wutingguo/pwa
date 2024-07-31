import styled from 'styled-components';

export const Container = styled.div`
  width: 390px;
  margin-top: 100px;
  margin-left: 94px;
  .btn {
    border: 1px solid #0077cc;
    color: #0077cc;
    background: #fff;
    font-size: 14px;
    font-weight: 500;
  }
`;

export const Content = styled.div`
  background: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const BtnBox = styled.div`
  text-align: center;
  padding-top: 16px;
  padding-bottom: 16px;
`;

export const Text = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 18px;
  &.top-10 {
    margin-top: 10px;
  }
`;
