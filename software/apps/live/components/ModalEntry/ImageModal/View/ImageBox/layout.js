import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  .swiper {
    width: 100%;
    height: 100%;
  }
  .swiper-zoom-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .swiper-slide {
    height: initial;
  }
`;
