import styled from 'styled-components';

export const Container = styled.div`
  height: calc(100% - 100px);

  .wizard-step-enter {
    opacity: 0;
    transform: translateX(-100%);
  }

  .wizard-step-enter-active {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 300ms, transform 300ms;
  }

  .wizard-step-exit {
    opacity: 1;
    transform: translateX(0);
  }

  .wizard-step-exit-active {
    opacity: 0;
    transform: translateX(100%);
    transition: opacity 300ms, transform 300ms;
  }

  .step_box {
    height: 100%;
    .rsw_2Y {
      height: 100%;
      .rsw_2f {
        height: 100%;
      }
    }
  }
`;
