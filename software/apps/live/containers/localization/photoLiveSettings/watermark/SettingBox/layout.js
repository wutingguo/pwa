import styled from 'styled-components';

import { positionKey } from '../opts';

export const Container = styled.div`
  width: 430px;
`;

export const Line = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
`;
export const NewLine = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;
export const Lable = styled.div``;
export const Title = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 16px;
`;

export const SliderItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 10px;
`;

export const SliderLabel = styled.div``;

export const SliderContatiner = styled.div`
  display: flex;
  align-items: center;
  .rc-slider {
    padding: 0;
    margin: 0;
  }
  .rc-slider-track {
    height: 4px;
    top: 0px;
    background: #222;
  }
  .rc-slider-handle {
    border-color: #222;
  }
  span {
    margin-left: 10px;
  }
`;
export const Space = styled.div`
  width: ${props => (typeof props.width === 'string' ? props.width : props.width + 'px')};
`;

export const DefaultLabel = styled.div`
  width: 120px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f6f6f6;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  cursor: pointer;
  box-sizing: border-box;
  border: ${({ active }) => (active ? '1px solid #222222' : 'none')};
`;
export const DefaultItem = styled.div`
  display: flex;
  justify-content: center;
  width: ${({ type }) => (type === positionKey[3] ? '380px' : 'auto')};
  margin-bottom: 10px;
`;
export const DefaultLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* margin-top: 20px; */
`;

export const Text = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 18px;
  &.top-10 {
    white-space: break-spaces;
    margin-top: 10px;
  }
`;

export const InputMarginBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  .margin_item {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .margin_label {
      margin-bottom: 5px;
    }

    .margin_input {
      display: flex;
      align-items: center;
      .input_unit {
        margin-left: 10px;
        user-select: none;
      }
    }
  }
`;

export const BannerMarginBox = styled.div`
  width: 380px;
  height: 140px;
  border: 1px dashed #d8d8d8;
  position: relative;
  margin-bottom: 22px;

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    height: 40px;
    background-color: #f6f6f6;
    position: absolute;
    font-size: 14px;
    font-weight: 400;
    color: #222;
    line-height: 20px;
    box-sizing: border-box;
    cursor: pointer;
    &.active {
      border: 1px solid #222;
    }
    &.top {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    &.bottom {
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    &.left {
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
    &.right {
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
`;
