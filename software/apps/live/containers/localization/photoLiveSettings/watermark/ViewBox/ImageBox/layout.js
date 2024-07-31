import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  background-image: ${props => `url(${props.backgroundUrl})`};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
`;

export const ChildBox = styled.img`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  bottom: ${props => props.bottom}px;
  right: ${props => props.right}px;
  width: ${props => props.width}px;
  opacity: ${props => props.opacity};
  margin: auto;
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom + 'px' : '')};
  margin-top: ${props => (props.marginTop ? props.marginTop + 'px' : '')};
  margin-left: ${props => (props.marginLeft ? props.marginLeft + 'px' : '')};
  margin-right: ${props => (props.marginRight ? props.marginRight + 'px' : '')};
`;
