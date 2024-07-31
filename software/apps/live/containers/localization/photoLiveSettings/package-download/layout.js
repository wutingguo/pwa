import styled from 'styled-components';

export const Container = styled.div``;

export const Tip = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  font-size: 14px;
  background: #f6f6f6;
  margin-top: 23px;
  margin-bottom: 33px;
  svg {
    width: 20px;
  }
`;

export const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  word-break: break-all;
  white-space: break-spaces;
`;
export const Right = styled.div`
  min-width: 460px;
  margin-right: 40px;
  text-align: right;
`;
export const Left = styled.div`
  width: 900px;
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #222222;
    line-height: 18px;
  }
  .info {
    margin-top: 16px;
    font-size: 14px;
    font-weight: 400;
    color: #7b7b7b;
    line-height: 16px;
    .activity_time {
      margin-right: 40px;
    }
    .activity_address {
    }
  }
`;
