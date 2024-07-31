import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 40px;
  display: flex;
  padding-bottom: 100px;
`;

export const SettingBox = styled.div`
  width: 500px;

  .setting_date {
    .setting_date_tip {
      font-weight: 400;
      font-size: 14px;
      color: #7b7b7b;
      line-height: 14px;
      margin-top: 16px;
    }
  }
`;

export const View = styled.div`
  width: 300px;
  margin-left: 84px;
  img {
    width: 100%;
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
