import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  .operator_line_show {
    bottom: 0px;
  }

  .operator_line_hide {
    bottom: -222px;
  }
`;

export const Line = styled.div`
  color: #fff;
  padding: 5px;
  white-space: nowrap;
`;
