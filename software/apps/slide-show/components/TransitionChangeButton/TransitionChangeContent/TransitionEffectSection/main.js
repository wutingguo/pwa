import React from 'react';

import image1 from './images/1.jpg';
import image2 from './images/2.jpg';
import image3 from './images/3.jpg';
import image4 from './images/4.jpg';
import image5 from './images/5.jpg';
import image6 from './images/6.jpg';

const images = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6
];

const startRenderLoop = (that, props) => {
  const startTime = Date.now();
  const {
    imageCount,
    itemTimeWithoutTrantision
  } = that.state;
  const {
    transition_duration
  } = props;
  const itemTimeTotal = itemTimeWithoutTrantision + transition_duration;
  that.setState({itemTimeTotal});

  that.animationFrameId = requestAnimationFrame(function renderAnimationFrame () {
    const timeNow = Date.now();
    const currentTime = (timeNow - startTime) / 1000;

    if (itemTimeTotal * imageCount > currentTime) {
      that.animationFrameId = requestAnimationFrame(renderAnimationFrame);
      that.setState({
        currentTime,
        itemTimeTotal
      });
    } else {
      that.cancelRenderLoop();
    }
  });
}

const cancelRenderLoop = that => {
  that.setState({
    currentTime: 0,
    itemTimeTotal: 2
  });
  cancelAnimationFrame(that.animationFrameId);
}

const getImageItemStyle = (that, index) => {
  const {
    transition_mode,
    transition_duration
  } = that.props;
  const {
    currentTime,
    itemTimeTotal
  } = that.state;
  const style = { opacity: 0 };
  const itemStartTime = itemTimeTotal * index;
  const timeOffsetByItemStart = currentTime - itemStartTime;
  const transitionDurationHalf = transition_duration / 2;
  switch (transition_mode) {
    case 1: {
      if (
        timeOffsetByItemStart < -transitionDurationHalf ||
        timeOffsetByItemStart > itemTimeTotal + transitionDurationHalf
      ) {
        style.opacity = 0;
      } else if (
        timeOffsetByItemStart >= -transitionDurationHalf &&
        timeOffsetByItemStart <= transitionDurationHalf
      ) {
        if (index === 0) {
          style.opacity = 1;
        } else {
          style.opacity = 0.5 + (timeOffsetByItemStart / transitionDurationHalf) * 0.5;
        }
      } else if (
        timeOffsetByItemStart > transitionDurationHalf &&
        timeOffsetByItemStart < itemTimeTotal - transitionDurationHalf
      ) {
        style.opacity = 1;
      } else if (
        timeOffsetByItemStart >= itemTimeTotal - transitionDurationHalf &&
        timeOffsetByItemStart <= itemTimeTotal + transitionDurationHalf
      ) {
        const transitionTime = timeOffsetByItemStart - (itemTimeTotal - transitionDurationHalf);
        style.opacity = 1 - transitionTime / transition_duration;
      }
      break;
    }
    case 2: {
      if (
        timeOffsetByItemStart < 0 ||
        timeOffsetByItemStart > itemTimeTotal
      ) {
        style.opacity = 0;
      } else {
        style.opacity = 1;
      }
      break;
    }
    case 3: {
      if (
        timeOffsetByItemStart < 0 ||
        timeOffsetByItemStart > itemTimeTotal
      ) {
        style.opacity = 0;
      } else if (
        timeOffsetByItemStart >= 0 &&
        timeOffsetByItemStart <= transitionDurationHalf
      ) {
        if (index === 0) {
          style.opacity = 1;
        } else {
          style.opacity = timeOffsetByItemStart / transitionDurationHalf;
        }
      } else if (
        timeOffsetByItemStart > transitionDurationHalf &&
        timeOffsetByItemStart < itemTimeTotal - transitionDurationHalf
      ) {
        style.opacity = 1;
      } else if (
        timeOffsetByItemStart >= itemTimeTotal - transitionDurationHalf &&
        timeOffsetByItemStart <= itemTimeTotal
      ) {
        const transitionTime = timeOffsetByItemStart - (itemTimeTotal - transitionDurationHalf);
        style.opacity = 1 - transitionTime / transitionDurationHalf;
      }
      break;
    }
  }
  return style;
}

const getRenderImages = that => {
  const {
    imageCount
  } = that.state;
  const renderImages = [];
  for (let i = 0; i < imageCount; i ++ ) {
    renderImages.push(
      <img
        key={i}
        src={images[i]}
        style={that.getImageItemStyle(i)}
      />
    );
  }
  return renderImages;
}

export default {
  startRenderLoop,
  cancelRenderLoop,
  getRenderImages,
  getImageItemStyle
}