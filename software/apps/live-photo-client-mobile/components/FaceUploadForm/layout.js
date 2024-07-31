import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 10;
  padding: 72px 85px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  form {
    flex: none;

    .faceItem {
      margin-top: 28px;
      font-size: 24px;
      line-height: 24px;

      label {
        font-weight: 500;
        font-size: 28px;
        color: #3a3a3a;
        line-height: 28px;
      }

      .msg {
        margin-top: 8px;
        color: #cc0200;
      }
    }
  }
`;

export const Loading = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Input = styled.input`
  height: 68px;
  width: 100%;
  font-size: 24px;
  line-height: 24px;
  border: 1px solid #d8d8d8;
  border-radius: 10px;
  padding: 0 20px;
  outline: none;
  box-sizing: border-box;
`;

export const Content = styled.div`
  margin-top: auto;
  flex: none;
`;

export const Title = styled.div`
  font-size: 32px;
  line-height: 32px;
  color: #7b7b7b;
  text-align: center;
`;

export const UploadBody = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .upload_image_avatar {
    width: 240px;
    height: 240px;
    box-sizing: border-box;
    border: 2px dashed #3a3a3a;
  }
  .upload_image_avatar_msg {
    width: 493px;
    font-size: 24px;
    color: #222;
    line-height: 30px;
    text-align: center;
    margin-top: 20px;
  }
  .upload_image_btn {
    padding: 26px 45px;
    margin-top: 60px;
    font-weight: 500;
    font-size: 24px;
    line-height: 24px;
    &.disabled {
      background-color: #d8d8d8;
      color: #fff;
      pointer-events: none;
    }
  }
`;

export const Footer = styled.div`
  margin: 40px auto;
  display: flex;
  font-size: 24px;
  color: #222;
  line-height: 32px;

  .upload_image_clause_check {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
  .upload_image_clause_text {
    width: 455px;
    .upload_image_clause_area {
      color: #0077cc;
      white-space: nowrap;
    }
  }
`;
