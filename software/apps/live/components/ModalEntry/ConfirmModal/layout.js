import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  font-weight: 400;
  font-size: 16px;
  color: #222222;
  line-height: 24px;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
  .btn_cancel {
    flex: 1;
    margin-right: 40px;
    color: #222;
    background: #fff;
    border: 1px solid #d8d8d8;
    padding: 10px 22px;
  }

  .btn_next {
    flex: 1;
  }
`;
