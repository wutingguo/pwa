import styled from 'styled-components';

export const Container = styled.div`
  padding: 0 46px;
  .znoRadio {
    max-height: 200px;
    overflow-y: auto;
    .rc-radio-wrapper {
      display: block;
      margin-bottom: 10px;
    }
  }
  .noData {
    fost-size: 20px;
    text-align: center;
  }
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
  }
`;

export const Title = styled.div`
  font-weight: 400;
  font-size: 20px;
  color: #222222;
  line-height: 20px;
  text-align: right;
  font-style: normal;
  text-align: center;
  margin-top: 20px;
`;

export const Footer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  .btn {
    width: 160px;
    border-radius: 0;
  }
  .btn[disabled] {
    opacity: 0.4;
  }
  .pm-upload-img {
    padding: 0;
    .btn {
      background: transparent;
    }
  }
`;
