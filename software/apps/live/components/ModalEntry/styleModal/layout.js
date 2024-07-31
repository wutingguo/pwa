import styled from 'styled-components';

export const Container = styled.div`
  .my-materials-header {
    overflow: hidden;
    padding-bottom: rem(14px);
    border-bottom: 1px solid #d6d6d6;
    .label {
      float: left;
      font-size: rem(20px);
      font-weight: 500;
    }
  }
  .react-tabs__tab-list {
    overflow: hidden;
    margin-bottom: 24px;
    border-bottom: 1px solid #d6d6d6;
    li {
      float: left;
      font-size: rem(16px);
      padding: 8px 0;
      outline: none;
      position: relative;
      -webkit-appearence: none;
      cursor: pointer;
      &:focus {
        outline: none;
      }
      &.react-tabs__tab--selected {
        font-weight: 500;
        &:after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: #222;
        }
      }
      & + li {
        margin-left: 64px;
      }
    }
  }
`;
