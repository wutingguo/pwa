import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #3a3a3a;
  line-height: 20px;
  text-align: center;
  margin-bottom: 32px;
`;

export const Content = styled.div`
  .viewModal__table {
    height: 380px;
    table {
      width: fit-content;
      max-width: 100%;
      border: none;
      thead {
        border-bottom: 1px solid #d8d8d8;
      }
      tr {
        border-bottom: none;
        th {
          background-color: transparent;
          font-size: 16px;
          font-weight: 400;
          color: #3a3a3a;
          line-height: 16px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        td {
          height: auto;
          font-size: 14px;
          color: #222;
          line-height: 14px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;

          .rc-table-expanded-row-fixed {
            width: 100% !important;
          }
        }
      }
    }
  }
`;

export const Footer = styled.div`
  margin-top: 20px;
  text-align: right;
  .excel-button {
    border-radius: 4px;
  }
`;

export const ItemsLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: -10px;
  .label::after {
    content: '*';
    color: red;
  }
`;
