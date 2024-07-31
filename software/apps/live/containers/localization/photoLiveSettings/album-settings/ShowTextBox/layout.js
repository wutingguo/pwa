import styled from 'styled-components';

export const Container = styled.div``;

export const Banner = styled.div`
  margin-bottom: ${props => (props.isBorder ? '' : '-5px')};
`;
export const GridImageBox = styled.div`
  background-repeat: repeat;
  border: ${props => (props.isBorder ? '1px dashed #7b7b7b' : '')};
  img {
    vertical-align: top;
  }
`;
