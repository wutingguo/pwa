import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  background: #d8d8d8;
`;

export const Loading = styled.div`
  display: flex;
  .loading-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
`;

export const Text = styled.div`
  color: #fff;
  font-size: 24px;
  margin-top: 16px;
`;
