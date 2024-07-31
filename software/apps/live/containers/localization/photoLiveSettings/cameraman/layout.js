import styled from 'styled-components';

export const Container = styled.div``;

export const Title = styled.div`
  margin: 20px 10px;
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 16px;
`;

export const Card = styled.div`
  padding: 20px;
  background: #f6f6f6;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-gap: 10px;
`;

export const Item = styled.div`
  width: 120px;
  height: 120px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

export const Line = styled.div`
  font-size: 12px;
  color: #7b7b7b;
`;

export const Name = styled.div`
  font-size: 12px;
  color: #7b7b7b;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
`;

export const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background-image: ${props => (props.url ? `url(${props.url})` : '')};
  background-size: contain;
  background-repeat: no-repeat;
`;

export const Close = styled.div`
  position: absolute;
  font-size: 12px;
  color: #7b7b7b;
  top: -4px;
  right: -4px;
  display: none;
  ${Item}:hover & {
    display: block;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const Empty = styled.div`
  text-align: center;
  padding: 20px 0;
`;
