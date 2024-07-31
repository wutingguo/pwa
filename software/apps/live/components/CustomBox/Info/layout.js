import styled from 'styled-components';

export const Container = styled.div`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border: ${props => (props.isBorder ? '1px dashed #7b7b7b' : '')};
  margin-bottom: 10px;
`;

// Title, SubTitle, List, Item, Tabs, Left, Right

export const Content = styled.div`
  transform: scale(0.8);
  margin-top: -10px;
  margin-left: -12px;
  margin-bottom: -10px;
`;

export const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin: 0;
`;
export const SubTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${props => (props.color ? props.color : '#222')};
`;
export const List = styled.div`
  font-size: 12px;
  font-weight: 400;
`;
export const Item = styled.div`
  display: flex;
  color: ${props => props.color || ''};
  .image {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    margin-top: 5px;
  }
  div {
    margin-left: 10px;
  }
`;
export const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
`;

export const Left = styled.div`
  display: flex;
  align-item: center;
`;

export const TabsItem = styled.div`
  color: ${props => (props.isCurrent ? props.color : '#222')};
  border-bottom: ${props => (props.isCurrent ? `1px solid ${props.color}` : '')};
  font-size: 12px;
  font-weight: 700;
  margin-right: 10px;
`;

export const Right = styled.div`
  border-left: 1px solid #ccc;
  padding-left: 10px;
  display: flex;
  .icon {
    width: 12px;
    margin-left: 10px;
  }
`;
