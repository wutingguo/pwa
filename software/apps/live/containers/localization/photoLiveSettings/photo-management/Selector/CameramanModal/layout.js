import styled from 'styled-components';

export const Container = styled.div`
  height: 400px;
  overflow-y: auto;
  .pm-selector-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    grid-gap: 20px;

    > span {
    }

    .pm-selector-wrap {
      display: flex;
      justify-content: start;

      .pm-selector-input {
        width: 48px;
        height: 48px;
        margin-right: 16px;

        img {
          width: 100%;
          height: 100%;
        }

        .pm-selector-img-checked {
          width: 48px;
          height: 48px;
          display: inline-block;
          border-radius: 50px;
          // border: 1px solid pink;
        }

        .pm-selector-img {
          width: 48px;
          height: 48px;
          display: inline-block;
          border-radius: 50px;
          // border: 1px solid grey;
        }
      }

      .pm-selector-content {
        min-width: 100px;
        line-height: 26px;
        max-width: 200px;

        .pm-selector-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 16px;
          color: #222222;
        }

        .pm-selector-number {
          font-size: 14px;
          color: #7b7b7b;
        }
      }
    }
  }
`;

export const Footer = styled.div`
  .checkbox_line {
    display: flex;
    justify-content: start;
    align-items: center;
    .checkbox_label {
      display: flex;
      align-items: center;
      cursor: pointer;
      .checkbox {
      }
      .checkbox_text {
      }
    }
  }

  .operator_line {
  }
`;
