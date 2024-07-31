import styled from 'styled-components';

export const Line = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
`;
export const ComboLine = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    padding-right: 10px !important;
    -moz-appearance: textfield;
  }
`;

export const RuleLine = styled.div`
  .ruleTitle {
    font-size: 0.38rem;
    font-weight: 400;
    color: #3a3a3a;
    padding-top: 27px;
    margin-bottom: 0.42rem;
  }
`;
