import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
`;

export const Header = styled.div`
  font-size: 16px;
  color: #222222;
  line-height: 19px;
  display: flex;
  .header_count {
  }
  .header_name {
    margin-right: 20px;
  }
  .header_phone {
    margin-right: 20px;
  }
  .header_email {
    margin-right: 20px;
  }
  .header_edit {
    cursor: pointer;
  }
`;

export const Content = styled.div``;

export const List = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 188px);
`;
