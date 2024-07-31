import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  padding: 20px;
  background: #f6f6f6;
  width: 490px;
`;

export const ColorPickerBox = styled.div`
  width: 110px;
  margin-left: 10px;
  .color-picker {
    width: 100%;
    .swatch {
      opacity: 1;
      .color {
        display: none;
      }
    }
  }
`;

export const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  .box_line {
    margin-top: 60px;
    .btns {
      display: flex;
    }
    .btn_text {
      margin-top: 8px;
      color: #7b7b7b;
      p {
        padding: 0;
        margin: 0;
      }
    }
  }
`;
