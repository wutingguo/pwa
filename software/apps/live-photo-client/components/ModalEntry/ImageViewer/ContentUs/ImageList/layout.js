import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 180px;
  display: flex;
  align-items: center;
  transition: height 0.3s linear;
  margin-top: 24px;
  overflow: hidden;
  .image-box {
    overflow: hidden;
    margin-right: 15px;
    .image-list {
      white-space: nowrap;
      transition: transform 0.3s linear;
      .review-item {
        display: inline-block;
        height: 120px;
        width: 120px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 50%;
        border: 1px dashed #ccc;
        margin-left: 15px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .current {
        border: 1px solid;
      }
    }
  }
  &.hidden {
    height: 0;
    margin-top: 0;
  }
`;

export const PointerLeft = styled.span`
  margin-left: 10px;
  cursor: pointer;
  &.disabled {
    cursor: no-drop;
  }
`;
export const PointerRight = styled.span`
  margin-right: 10px;
  transform: rotateY(180deg);
  cursor: pointer;
  &.disabled {
    cursor: no-drop;
  }
`;
