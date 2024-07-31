import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.div`
  min-width: 50px;
  font-size: 16px;
  font-weight: 400;
  color: #222222;
  line-height: 16px;
`;

export const Content = styled.div`
  width: 260px;
`;

export const InputBox = styled.div`
  display: flex;
  align-items: center;
`;

export const TextBox = styled.div`
  display: flex;
  align-items: center;
  line-height: 40px;
`;

export const Text = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
`;
export const Icon = styled.div`
  margin-left: 10px;
  cursor: pointer;
  svg {
    vertical-align: middle;
  }
`;
