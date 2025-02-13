import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid #d8d8d8;
  .input_number {
    outline: none;
    border: none;
    flex: 1;
    padding: 0px 10px;
  }
`;

export const Operator = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  user-select: none;
  .icon_top {
    background: #f6f6f6;
    border: 1px solid #d8d8d8;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:active {
      .icon {
        transform: rotate(90deg) scale(0.8);
      }
    }
    .icon {
      transform: rotate(90deg);
    }
  }
  .icon_down {
    background: #f6f6f6;
    border: 1px solid #d8d8d8;
    border-top: none;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .icon {
      transform: rotate(-90deg);
    }
    &:active {
      .icon {
        transform: rotate(-90deg) scale(0.8);
      }
    }
  }
`;
