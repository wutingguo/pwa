import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
`;

export const SettingBlock = styled.div`
 
  .switch_item {
    display: flex;
    .switch_label {
      font-weight: 400;
      font-size: 16px;
      color: #222222;
      line-height: 32px;
      text-align: left;
      font-style: normal;
      text-wrap: nowrap;
      width: 75px;
    }
    .switch_setting {
      flex: 1;
      .switch_tip {
        font-weight: 400;
        font-size: 14px;
        color: #222222;
        line-height: 14px;
        text-align: left;
        font-style: normal;
        margin: 20px 0;
      }
      .switch_input_tip {
        font-weight: 400;
        font-size: 14px;
        color: #7b7b7b;
        line-height: 14px;
        text-align: left;
        font-style: normal;
        white-space: nowrap;
      }
    }
    .switch_title{
      width:230px
    }
  }
`

export const ViewBlock = styled.div`
  .instantEffect {
    background: #f6f6f6;
    margin-top: 20px;
    border-radius: 4px;
    padding: 20px;
    .title {
      color: #222222;
      font-size: 14px;
      margin-bottom: 20px;
      font-weight: 400;
    }
    .tabWrpper {
      display: flex;
      position: relative;
      top: 1px;
      .tab {
        cursor: pointer;
        text-align: center;
        background: #ffffff;
        color: #7b7b7b;
        border: 1px solid #d8d8d8;
        border-radius: 4px 4px 0px 0px;
        line-height: 40px;
        font-size: 16px;
        width: 100px;
        height: 40px;
        margin-right: 5px;
        &.cur {
          color: #222222;
          border-bottom: 1px solid #fff;
        }
      }
    }
    .effectContent {
      background: #ffffff;
      border: 1px solid #d8d8d8;
      width: 300px;
      padding: 40px 32px;
      .default_box {
        display: flex;
        align-items: center;
        .image_box {
          display: flex;
          width: 120px;
          height: 120px;
          border: 1px dashed #d8d8d8;
          align-items: center;
          .image {
            width: 100%;
          }
        }
        .image_text {
          margin-left: 20px;
        }
      }

      .costom_box {
        display: flex;
        align-items: start;
        .image_box {
          display: flex;
          width: 120px;
          height: 120px;
          border: 1px dashed #d8d8d8;
          align-items: center;
          justify-content: center;
          .costom_img {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
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
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .upload {
            width: 100%;
            height: 100%;
          }
        }
        .image_text_rows {
          margin-left: 20px;
          flex: 1;
          .image_text_col {
            font-weight: 400;
            font-size: 14px;
            color: #7b7b7b;
            line-height: 20px;
            text-align: left;
            font-style: normal;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
`;
