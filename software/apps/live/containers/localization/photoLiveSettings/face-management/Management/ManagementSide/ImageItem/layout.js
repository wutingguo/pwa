import styled from 'styled-components';

export const MenuListItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 12px;

  .text_name {
    width: 100%;
    height: 150px;
    line-height: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    background: #fff;
    cursor: pointer;
    border: 2px solid transparent;
    &.current {
      border: 2px solid #0095ff;
    }
  }
  .image_box {
    width: 100%;
    height: 150px;
    background: #fff;
    cursor: pointer;
    border: 2px solid transparent;
    &.current {
      border: 2px solid #0095ff;
    }
    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }
  .image_dec {
    text-align: center;
  }
`;
