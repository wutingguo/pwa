import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  padding-bottom: 120px;
`;

export const Line = styled.div`
  margin-top: 40px;

  .title {
    font-size: 16px;
    font-weight: 400;
    color: #222222;
    line-height: 16px;
  }
  .content {
    margin-top: 20px;
  }
`;

export const Footer = styled.div`
  padding: 20px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 204px;
  background-color: #fff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
  padding-left: 76px;
`;
