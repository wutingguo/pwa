import styled from 'styled-components';

export const Container = styled.div`
  .select_line {
    display: flex;
    align-items: center;
    .select_lable {
      margin-right: 12px;
      font-weight: 400;
      font-size: 16px;
      color: #222222;
      line-height: 16px;
    }
    .select_item {
      flex: 1;
    }
  }

  .bottom_btns {
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
  }
`;
