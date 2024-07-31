import styled from 'styled-components';

export const Container = styled.div`
  .costom_box {
    display: flex;
    flex-direction: column;
    .image_box {
      display: flex;
      .costom_img {
        position: relative;
        width: 120px;
        height: 233px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #d8d8d8;
        margin-left: 20px;
        .costom_close_icon {
          position: absolute;
          right: -10px;
          top: -12px;
          display: none;
          cursor: pointer;
        }
        &:hover {
          .costom_close_icon {
            display: block;
          }
        }
        .image {
          max-height: 100%;
          max-width: 100%;
        }
      }
      .upload-button {
        background: #fff;
        width: 120px;
        height: 233px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #d8d8d8;
      }
      .upload {
        width: 100%;
        height: 100%;
      }
    }
    .image_text_rows {
      .image_text_col {
        font-weight: 400;
        font-size: 14px;
        color: #7b7b7b;
        line-height: 20px;
        text-align: left;
        font-style: normal;
        margin-top: 20px;
      }
    }
  }
`;
