import { coverDisplayRatio } from '@common/constants/ratio';

const getPcViewerProps = that => {
  return {
    className: 'template template-pc',
    ref: that.pcViewerRef,
    id: 'templatePc',
  };
};

const getPcCoverRenderProps = that => {
  const { coverInfo, event_time } = that.props;
  return {
    event_time,
    cover: coverInfo,
    selector: '#templatePc',
    isShowViewButton: true,
    isFullScreen: false,
    className: 'template-cover',
    buttonStyle: {
      width: '3.54rem',
      height: '0.71rem',
      fontSize: '0.29rem',
    },
  };
};

const getMViewerProps = that => {
  return {
    className: 'template template-m',
    ref: that.mViewerRef,
    id: 'templateM',
  };
};

const getMCoverRenderProps = that => {
  const { coverInfo, event_time } = that.props;
  return {
    event_time,
    cover: coverInfo.setIn(['computed', 'ratio'], coverDisplayRatio.wap),
    selector: '#templateM',
    isShowViewButton: true,
    isFullScreen: false,
    className: 'template-cover-m',
    buttonStyle: {
      width: '2.29rem',
      height: '0.46rem',
      fontSize: '0.21rem',
    },
    isWap: true,
  };
};

export default {
  getPcViewerProps,
  getPcCoverRenderProps,
  getMViewerProps,
  getMCoverRenderProps,
};
