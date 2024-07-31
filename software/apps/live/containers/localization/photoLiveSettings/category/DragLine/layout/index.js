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
  .name {
    font-weight: 400;
    color: #222222;
    text-align: left;
    font-style: normal;
    width: 160px;
    word-wrap: break-word;
  }
`;
