import styled from 'styled-components';

export const Container = styled.div`
  border: 1px solid #d8d8d8;
  padding: 20px;
`;

export const Tip = styled.div`
  font-size: 14px;
  color: #7b7b7b;
  font-weight: 400;
  line-height: 20px;
`;

export const MenuList = styled.div`
  width: 340px;
`;

export const MenuItem = styled.div`
  height: 48px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  margin-top: 10px;
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
  line-height: 14px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
  color: #222;
  flex: auto;
  padding-right: 16px;

  .text {
    flex: auto;
    .required {
      color: red;
    }
  }

  .edit,
  .delete {
    flex: none;
    margin-left: 8px;
  }
`;
