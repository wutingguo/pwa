import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const Title = styled.div`
  text-align: left;
  font-weight: 400;
  font-size: 20px;
  color: #222222;
  line-height: 20px;
  margin-top: 20px;
  p {
    margin: 0;
  }
  .sub_title {
    margin-top: 8px;
    font-weight: 400;
    font-size: 14px;
    color: #7b7b7b;
    line-height: 18px;
  }
`;
export const Instructions = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  line-height: 14px;
  padding: 11px 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  text-wrap: nowrap;
`;

export const Article = styled.section`
  padding: 32px;
  height: 440px;
  overflow-y: auto;
  background: #f6f6f6;
  p {
    margin: 0;
    margin-bottom: 12px;
  }
  ul {
    li {
      margin-bottom: 12px;
      word-break: break-word;
    }
  }
`;

export const Footer = styled.div`
  text-align: right;
  .btn {
    border: 1px solid #d8d8d8;
    background: #fff;
    padding: 12px 48px;
    color: #222;
  }
  .success {
    margin-left: 40px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .disabled {
    background: #d8d8d8;
    color: #fff;
  }
  .isEN {
    padding: 12px 48px;
  }
`;
