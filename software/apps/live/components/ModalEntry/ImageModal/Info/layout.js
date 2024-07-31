import styled from 'styled-components';

export const Container = styled.div`
  width: 320px;
  background: #f6f6f6;
  /* color: #fff; */
`;

export const Row = styled.div`
  padding: 40px 0px;
  margin: 0px 20px;
  border-bottom: 1px solid #d8d8d8;
  border-bottom-color: ${props => (props.index === 2 ? 'transparent' : '#D8D8D8')};
`;

export const Title = styled.div`
  /* padding: 0 20px; */
  font-size: 16px;
  font-weight: 500;
  padding-bottom: 4px;
  color: #222222;
`;

export const Col = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /* padding: 0 20px; */
  margin-top: 16px;
  .operation {
    flex: none;
    cursor: pointer;
    color: #0077cc;
    margin-left: auto;
  }
`;

export const Label = styled.div`
  font-size: 12px;
  color: #7b7b7b;
  font-weight: 400;
  flex-shrink: 0;
  width: 135px;
`;

export const Text = styled.div`
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  font-size: 12px;
  color: #222222;
  font-weight: 400;
`;

export const Footer = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 320px;
  .pm-upload-img {
    padding: 0;
  }
  .pm-replace-btn {
    // width: 100px;
    // margin: 0;
    padding: 0;
    // height: 40px;
  }
  .bgc-red {
    background-color: #ff0000;
  }
  .pm-replace-btn:hover {
    background: transparent;
  }
  .icon {
    position: relative;
    top: 2px;
    right: 2px;
  }

  .pm-btn {
    width: 77px;
    height: 40px;
    border-radius: 2px;
    margin: 0;
    color: #fff;
    font-size: 13px;
    background-color: #3a3a3a;
  }

  .pm-delete-btn {
    background-color: #cc0200;
    &:hover {
      opacity: 0.4;
      background-color: #cc0200;
    }
  }
`;

export const Header = styled.div`
  height: 42px;
  text-align: right;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  svg {
    cursor: pointer;
  }
`;

export const Content = styled.div`
  height: calc(100% - 92px);
  overflow-y: auto;
`;

export const Item = styled.div`
  width: 100px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  color: #222222;
  font-weight: 400;

  &:hover {
    background: #f0f0f0;
  }
`;
