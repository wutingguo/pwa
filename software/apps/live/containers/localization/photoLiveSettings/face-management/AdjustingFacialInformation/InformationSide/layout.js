import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 300px;
  background: #f6f6f6;
  padding: 24px;
  box-sizing: border-box;
`;

export const Header = styled.div`
  .icon {
    cursor: pointer;
  }

  .header_title {
    font-weight: 500;
    font-size: 16px;
    color: #3a3a3a;
    line-height: 19px;
    margin-top: 24px;
  }
  .header_descript {
    margin-top: 8px;
    font-size: 14px;
    color: #3a3a3a;
    line-height: 22px;
  }
`;

export const MenuList = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 74px);
  grid-template-rows: repeat(auto-fill, 74px);
  height: calc(100% - 230px);
  overflow-y: auto;
  gap: 12px;
`;
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

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;

  .footer_tip {
    font-size: 14px;
    color: #7b7b7b;
    line-height: 17px;
  }

  .footer_btns {
    display: flex;
    margin-top: 12px;
  }
`;
