import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;

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
        margin: 0px 10px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .current {
        border: 1px solid;
      }
    }
  }

  &.dark {
    background: transparent;
    margin-top: 0px;
    height: inherit;
    .image-box {
      .image-list {
        .review-item {
          display: inline-block;
          margin: 0px 10px;
          background-color: rgba(255, 255, 255, 1);
          border: none;
          opacity: 0.5;
        }
        .current {
          opacity: 1;
        }
      }
    }
  }
  &.hidden {
    margin-top: 0;
    height: 0px;
    animation: ease-out 0.3s;
  }
  &.show {
    height: 180px;
    animation: ease-in 0.3s;
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
