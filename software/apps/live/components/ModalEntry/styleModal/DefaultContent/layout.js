import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  .overlay_box {
    position: fixed;
    top: 0;
    z-index: 1;
  }
`;

export const ScrollList = styled.div`
  overflow-y: auto;
  // text-wrap: nowrap;
  padding-bottom: 20px;
  max-height: 350px;
`;

export const SkinCategory = styled.div`
  margin-bottom: 10px;
  padding-bottom: 10px;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  width: 100%;
`;

export const Item = styled.div`
  border-radius: 4px;
  padding: 7px 26px;
  font-size: 14px;
  font-weight: 400;
  color: ${({ active }) => (active ? '#fff' : '#222')};
  line-height: 14px;
  background-color: ${({ active }) => (active ? '#222' : '#f0f0f0')};
  margin-right: 8px;
  cursor: pointer;
  white-space: nowrap;
`;
