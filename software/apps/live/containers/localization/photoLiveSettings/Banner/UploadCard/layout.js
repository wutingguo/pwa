import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
`;

export const Card = styled.div`
  width: 300px;
  height: 120px;
  border: 1px dashed #d8d8d8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fff;
  user-select: none;
  &.highlighted {
    transform: scale(0.95);
  }
  &:active {
    transform: scale(0.95);
  }
  .card_text {
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    line-height: 20px;
    margin-top: 10px;
  }
  .upload-button {
    background: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .upload {
    width: 100%;
    height: 100%;
  }
`;
export const Text = styled.div`
  margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  color: #7b7b7b;
  line-height: 18px;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Images = styled.div`
  display: flex;
  margin-top: 20px;
  flex-wrap: wrap;
`;
