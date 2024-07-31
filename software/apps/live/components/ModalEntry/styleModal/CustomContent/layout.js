import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  padding: 20px 0;
  flex-wrap: wrap;
`;

export const AddBox = styled.div`
  min-width: 150px;
  height: 256px;
  border: 1px dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;

  div {
    margin-top: 70px;
    margin-bottom: 20px;
  }
`;

export const ThemeBox = styled.div`
  position: relative;
`;

export const Btns = styled.div`
  position: absolute;
  bottom: 24px;
  height: 36px;
  background: #000000;
  opacity: 0.8;
  width: 100%;
  line-height: 36px;
  color: #fff;
  display: flex;
  justify-content: space-evenly;
  display: none;
  ${ThemeBox}:hover & {
    display: flex;
  }
  span {
    cursor: pointer;
  }
  svg {
    vertical-align: middle;
    margin-right: 5px;
  }
`;
