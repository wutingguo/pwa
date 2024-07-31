import styled from 'styled-components';

export const Container = styled.div`
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 20px;
  width: ${props => (props.width ? props.width : '')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-weight: 400;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
`;

export const Text = styled.span``;

export const List = styled.div`
  padding: 4px 0px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 5px;
`;

export const ContainerItem = styled.div`
  box-boxsizing: border-box;
  padding: 6px 12px;
  margin: 2px 4px;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  &.current {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export const Icon = styled.span`
  display: flex;
  align-items: center;
  &.down {
    transform: rotate(-90deg);
  }
  &.up {
    transform: rotate(90deg);
  }
`;
