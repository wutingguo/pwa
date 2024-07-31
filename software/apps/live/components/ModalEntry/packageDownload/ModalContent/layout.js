import styled from 'styled-components';

export const Container = styled.div`
  .react-tabs {
    .react-tabs__tab-list {
      display: flex;
      border-bottom: 1px solid #ccc;
      .react-tabs__tab {
        border: 1px solid transparent;
        cursor: pointer;
        padding: 0 10px;
      }
      .react-tabs__tab--selected {
        background: #fff;
        border-bottom-color: #222;
        color: #3a3a3a;
        border-radius: 5px 5px 0 0;
      }
    }
    .react-tabs__tab-panel {
      .x-checkbox {
        .icon {
          width: 16px;
          height: 18px;
        }
      }
    }
  }
  .text {
    color: #3a3a3a !important;
  }
  .text:hover {
    color: #3a3a3a !important;
  }
`;
