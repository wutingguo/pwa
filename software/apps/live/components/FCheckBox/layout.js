import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin-top: 7px;
  .rc-checkbox {
    margin-right: 4px;
    .rc-checkbox-input {
      margin: 0;
    }
    .rc-checkbox-inner {
      border-radius: 2px;
      border: 1px solid #d8d8d8;
      background-color: #fff;
      ::after {
        top: 0;
        width: 4px;
        height: 9px;
      }
    }
    &.rc-checkbox-checked .rc-checkbox-inner {
      background-color: #222;
      border-color: #222;
    }
    &:hover .rc-checkbox-inner,
    .rc-checkbox-input:focus + .rc-checkbox-inner {
      border-color: #222;
    }
  }
`;

export const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #222;
  line-height: 16px;
`;
