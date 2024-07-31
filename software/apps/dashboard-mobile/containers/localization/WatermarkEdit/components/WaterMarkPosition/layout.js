import styled from 'styled-components';

export const Space = styled.div`
  width: ${props => (typeof props.width === 'string' ? props.width : props.width + 'px')};
`;

export const DefaultLabel = styled.div`
  width: 60px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f6f6;
  /* border-radius: 4px; */
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  cursor: pointer;
  box-sizing: border-box;
  /* border: 1px solid transparent; */
  border-right: 1px solid #dcdcdc;
  border-bottom: 1px solid #dcdcdc;
`;
export const DefaultItem = styled.div`
  display: flex;
  justify-content: center;
  /* margin-bottom: 10px; */
`;
export const DefaultLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* margin-top: 20px; */
`;
export const WaterMarkBox = styled.img`
  position: absolute;
  height: auto;
  z-index: 2;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  bottom: ${props => props.bottom}px;
  right: ${props => props.right}px;
  width: ${props => props.width}px;
  opacity: ${props => props.opacity};
  margin: auto;
`;
