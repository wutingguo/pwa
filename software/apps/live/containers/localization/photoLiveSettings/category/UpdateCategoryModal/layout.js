import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 16px;
`;

export const Tips = styled.div`
  font-weight: 400;
  font-size: 12px;
  color: #7b7b7b;
  line-height: 18px;
  text-align: left;
  font-style: normal;
  margin-top: 8px;
  .tip {
    margin: 0;
    word-break: break-word;
  }
`;

export const Title = styled.div`
  font-weight: 400;
  font-size: 24px;
  color: #222222;
  line-height: 24px;
  text-align: right;
  font-style: normal;
  text-align: center;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  .btn {
    width: 140px;
  }
`;
