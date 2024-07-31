import styled from 'styled-components';

export const ModalContent = styled.div`
  .modal-body {
    margin-top: 20px;
    font-size: 16px;
    font-weight: 400;
    color: #222;
    line-height: 24px;
  }

  .modal-footer {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;

    button {
      width: 160px;
      height: 40px;
      border: 1px solid #d8d8d8;
      font-size: 16px;
      line-height: 16px;

      &.bg-white {
        background-color: #fff;
        color: #222;

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
`;
