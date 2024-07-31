import styled from 'styled-components';

export const Container = styled.div`
  padding-top: 9px;
`;
export const Message = styled.div`
  display: flex;
  align-items: center;
  background: #ffeddb;
  padding: 12px 56px;
  width: 476px;

  .icon {
  }

  .text {
    font-weight: 400;
    font-size: 14px;
    color: #222222;
    line-height: 16px;
  }
`;

export const Card = styled.div`
  .title_line {
    font-weight: 400;
    font-size: 14px;
    color: #7b7b7b;
    line-height: 14px;
    margin: 25px 0;
    .title {
      font-size: 16px;
      color: #222222;
      line-height: 16px;
      margin-right: 20px;
    }
    .tip {
      .tip_text {
        color: #7b7b7b;
      }
      .tip_clause {
        color: #0077cc;
        cursor: pointer;
      }
    }
  }

  .setting_card {
    width: 400px;
    background: #f6f6f6;
    padding: 40px;
    .setting_item {
      .setting {
        display: flex;
        align-items: center;
        .setting_item_label {
          font-weight: 400;
          font-size: 16px;
          color: #222222;
          line-height: 16px;
        }
        .setting_item_switch {
          padding-top: 12px;
          .switch-text {
            right: -30px;
          }
        }
      }
      .setting_message {
        font-weight: 400;
        font-size: 14px;
        color: #7b7b7b;
        line-height: 14px;
      }
    }
  }
`;
