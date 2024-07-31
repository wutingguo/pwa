import styled from 'styled-components';

export const MenuListItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid transparent;
  margin-top: 12px;
  border-radius: 50%;

  box-sizing: border-box;
  height: 74px;
  position: relative;
  background-color: #fff;
  cursor: pointer;
  &.current {
    border: 2px solid #0095ff;
    box-shadow: 1px 1px 10px 4px #ccc;
  }
  &.add_user_btn:active {
    transform: scale(0.95);
  }
  .text_name {
    width: 74px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
  .image_box {
    width: 90%;
    height: 90%;
    background: #fff;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
`;
