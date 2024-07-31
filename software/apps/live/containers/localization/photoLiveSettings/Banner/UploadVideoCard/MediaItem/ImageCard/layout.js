import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  .image {
    width: 100%;
    object-fit: contain;
    max-height: 100%;
    max-width: 100%;
  }
  .close {
    position: absolute;
    top: -5px;
    right: -5px;
    display: none;
    cursor: pointer;
  }
  &:hover .close {
    display: block;
  }
`;

export const Text = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 16px;
  margin-top: 20px;
`;
