import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  .instantEffect {
    // background: #f6f6f6;
    // margin-top: 20px;
    border-radius: 4px;
    // padding: 20px;
    .title {
      color: #222222;
      font-size: 14px;
      margin-bottom: 20px;
      font-weight: 400;
    }
    .tabWrpper {
      display: flex;
      position: relative;
      top: 1px;
      .tab {
        cursor: pointer;
        text-align: center;
        background: #ffffff;
        color: #7b7b7b;
        border: 1px solid #d8d8d8;
        border-radius: 4px 4px 0px 0px;
        line-height: 40px;
        font-size: 16px;
        width: 100px;
        height: 40px;
        margin-right: 5px;
        &.cur {
          color: #222222;
          border-bottom: 1px solid #fff;
        }
      }
    }
    .effectContent {
      background: #ffffff;
      border: 1px solid #d8d8d8;
      // width: 300px;
      padding: 24px;
    }
  }
`;
