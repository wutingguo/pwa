import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  padding-top: 40px;
`;

export const List = styled.div`
  .image_text_rows {
    .image_text_col {
      font-weight: 400;
      font-size: 14px;
      color: #7b7b7b;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      margin-top: -20px;
      margin-left: 90px;
    }
  }
`;
export const Info = styled.div`
  margin-left: 70px;
`;

export const Footer = styled.div`
  padding: 20px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 204px;
  background-color: #fff;
  box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.1);
  padding-left: 76px;
`;

export const SwitchInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  width: 200px;
`;
