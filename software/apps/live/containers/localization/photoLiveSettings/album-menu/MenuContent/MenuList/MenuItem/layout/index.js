import styled from 'styled-components';

export const Container = styled.div`
  height: 48px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  margin-bottom: 10px;
  display: flex;
  cursor: pointer;

  &.current {
    background: #f6f6f6;
    border-radius: 4px;
    border: 1px solid #3a3a3a;
  }
`;
export const MoveIcon = styled.div`
  width: 32px;
  height: 100%;
  line-height: 16px;
  margin-right: 10px;
  text-align: center;
  div {
    height: 100%;
    width: 100%;
    background-color: #cccccc;
    user-select: none;
    &.current {
      background-color: #3a3a3a;
    }
    & img {
      height: 18px;
      padding-top: 15px;
    }
  }
`;

export const Content = styled.div`
  line-height: 16px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .text {
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    line-height: 14px;
    width: 160px;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
  .iconR {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 120px;
    padding-right: 10px;
    .switch {
      padding-top: 12px;
    }
    span {
      height: 14px;
      width: 7px;
      font-size: 20px;
      margin-left: 19px;
    }
  }
`;
