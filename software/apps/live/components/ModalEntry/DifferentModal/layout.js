import styled from 'styled-components';

export const Container = styled.div`
  .modal-title {
    font-size: 24px;
    font-weight: 400;
    color: #222222;
    line-height: 24px;
    margin-bottom: 24px;
  }
  .sub-title {
    font-size: 16px;
    font-weight: 400;
    color: #222222;
    line-height: 16px;
    margin-bottom: 16px;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const List = styled.div`
  height: 160px;
  ${'' /* width: 420px; */}
  overflow-y: auto;
  background: #f6f6f6;
  padding: 10px;
  margin-bottom: 24px;
`;
