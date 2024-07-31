import styled from 'styled-components';

export const Container = styled.div`
  td,
  th {
    padding: 10px;
  }
  td {
    height: 40px;
  }

  th[scope='col'] {
    background-color: #f6f6f6;
  }

  th[scope='row'] {
    background-color: #d7d9f2;
  }

  caption {
    padding: 10px;
    caption-side: bottom;
  }

  table {
    border-collapse: collapse;
    border: 1px solid #d8d8d8;
    letter-spacing: 1px;
    font-family: sans-serif;
    width: 100%;
    text-align: left;
    tr {
      border-bottom: 1px solid #d8d8d8;
    }
  }
`;
