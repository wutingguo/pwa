import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 40px;
  display: flex;
  padding-bottom: 100px;
`;

export const SettingBox = styled.div`
  width: 500px;
  form {
    .registration-form-field {
      label.horizontal {
        margin-top: 18px;
      }
      &.banner_enabled {
        .switch-box {
          margin-left: auto;
          margin-right: 50px;
        }
      }
    }
  }
`;

export const View = styled.div`
  width: 540px;
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

export const Lable = styled.div``;

export const TextAlignRight = styled.div`
  text-align: right;
`;
