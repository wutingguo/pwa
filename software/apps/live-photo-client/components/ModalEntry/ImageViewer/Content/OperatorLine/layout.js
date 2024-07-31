import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row-reverse;
  padding-right: 24px;
  background: transparent;
  &.hidden {
    display: none;
  }
`;

export const Line = styled.div`
  display: flex;
  .item {
    margin-right: 10px;
  }
`;

export const OperatorButton = styled.div`
  background-color: ${({ backgroundColor }) =>
    backgroundColor ? backgroundColor : 'rgba(0, 0, 0, 0.6)'};
  padding: 10px 20px;
  width: ${props => (props.width ? props.width : '')};
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  border-radius: 5px;
`;

export const OperatorButtonText = styled.span``;

export const OperatorButtonIcon = styled.span`
  display: flex;
  align-items: center;
  &.up {
    transform: rotate(180deg);
  }
`;
