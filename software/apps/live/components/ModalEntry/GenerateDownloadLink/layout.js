import styled from 'styled-components';

export const ModalContent = styled.div`
  .pic_version {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    color: #222;
    line-height: 16px;
    margin-bottom: 24px;

    .label {
      flex: none;
      margin-right: 12px;
      display: inline-block;
      width: 64px;
    }
    .Select {
      flex: auto;
      .Select-control {
        border-radius: 0;
      }
    }
  }
`;
