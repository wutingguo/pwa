import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 20px;
  user-select: none;
  .image_box {
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #d6d6d6;
    height: 188px;
    padding: 10px;
    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
  .image_footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    margin-top: 10px;
    .image_name {
      user-select: text;
      width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .image_operator {
      font-size: 20px;
      cursor: pointer;
      line-height: 20px;
    }
  }
`;
