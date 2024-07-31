import React from 'react';
import WaveSurfer from 'wavesurfer.js';
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions';
import { ADD_MUSIC_SLIDESHOW_MODAL } from '@apps/slide-show/constants/modalTypes';
import { pauseWaveformVideoEvent } from '@apps/slide-show/utils/eventBus';
import {
  waveformOptions,
  cusorPluginOptions,
  formatTime,
  initRegionsPluginOptions,
  fomatTimeNum
} from './config';

const urlToObjectUrl = musicUrl => {
  return fetch(musicUrl)
    .then(resp => {
      if (resp.ok) {
        return resp.blob();
      }
      return Promise.reject(new Error(resp.statusText));
    })
    .then(dataArray => {
      const blobUrl = URL.createObjectURL(dataArray);
      return Promise.resolve(blobUrl);
    })
    .catch(error => {
      // 第三方音乐库重定向跨域请求，直接返回url
      return musicUrl;
    });
};

const initialWaveform = async (that, nextProps) => {
  const { currentSegment, boundProjectActions } = nextProps || that.props;
  const { getMusicWaveformArrayBuffer } = boundProjectActions;
  const musicUrl = currentSegment.get('musicUrl');
  const musicEncId = currentSegment.get('musicEncId');

  if (!musicUrl) return;

  that.waveformContainer.current.innerHTML = '';
  that.waveform = WaveSurfer.create(waveformOptions);

  const blobUrl = await urlToObjectUrl(musicUrl);

  if (musicEncId) {
    await getMusicWaveformArrayBuffer(musicEncId).then(res => {
      const peaks = res.data;
      if (peaks) {
        that.waveform.backend.peaks = peaks;
      }
    });

    that.waveform.drawBuffer();
    that.waveform.load(blobUrl, that.waveform.backend.peaks);

    that.waveform.on('loading', percent => handleLoading(percent, that));
    that.waveform.on('ready', () => handleReady(that));
    that.waveform.on('destroy', () => handleDestroy(that));
    that.waveform.on('error', err => handleError(err, that));

    pauseWaveformVideoEvent.add(() => {
      that.setState({
        playing: false
      });

      that.waveform.pause();
    });
  } else {
    that.setState({
      showModal: true
    });
  }
};

const initRegionsPlugin = that => {
  const duration = that.waveform.getDuration();
  const { currentSegment } = that.props;
  const region_start = currentSegment.get('region_start');
  const region_end = currentSegment.get('region_end');
  const start = region_start || 0;
  const end = region_end || duration;
  const regionsPluginOptions = initRegionsPluginOptions(start, end);
  const regionsPlugin = RegionsPlugin.create(regionsPluginOptions);
  that.waveform.addPlugin(regionsPlugin).initPlugin('regions');

  that.waveform.on('region-updated', region => handleEegionChange(region, that));
  that.waveform.on('region-update-end', region => handleEegionChangeEnd(region, that));
  that.waveform.on('region-click', (region, event) => handleEegionClick(region, event, that));

  if (start > 0) {
    that.waveform.seekTo(start / duration);
  }
  regionUpdateTitle();
};

const handleReady = that => {
  const duration = that.waveform.getDuration();
  that.setState({
    duration,
    showloading: false,
    playing: false,
    currentTimePosLeft: '0',
    currentTime: '0',
    showCurrentTime: false,
    showAddBtn: false
  });

  // waveform 绘制完成，初始化插件
  const cursorPlugin = CursorPlugin.create(cusorPluginOptions);
  that.waveform.addPlugin(cursorPlugin).initPlugin('cursor');

  //初始化 regions 插件
  initRegionsPlugin(that);

  // waveform 绘制完成，注册事件监听
  that.waveform.on('seek', position => handleSeek(position, that));
  that.waveform.on('audioprocess', time => handleAudioprocess(time, that));
  that.waveform.on('finish', () => handleFinish(that));
  that.waveform.on('pause', () => handlePause(that));

  console.log('waveform ready:  ', that.waveform);
};

const destroyWaveform = that => {
  that.setState({
    showloading: false,
    playing: false,
    currentTimePosLeft: '0',
    currentTime: '0',
    showCurrentTime: false,
    showImagesPos: false,
    duration: 0,
    showAddBtn: true
  });

  if (that.waveform) {
    // dom节点可能已经被删除了.
    try {
      that.waveform.pause();
      that.waveform.destroy();
    } catch (error) {
      console.log(error);
    }
  }
};

const handleError = (err, that) => {
  console.log('err: ', err);
  if (err) {
    that.setState({
      showAddBtn: true,
      showloading: false
    });

    // that.waveformContainer.current.innerHTML = '';
    that.waveform.destroy();
    return;
  }
};

const regionUpdateTitle = () => {
  const regionDoms = document.getElementsByClassName('wavesurfer-region');
  const handleDoms = document.getElementsByClassName('wavesurfer-handle');
  for (let item of regionDoms) {
    item.title = '';
  }
  for (let item of handleDoms) {
    item.title = t('TRIM_THE_SONG_USING_THE_SLIDERS');
  }
};

const handleEegionChange = (region, that, isEnd = false) => {
  const { minLength } = region;
  const duration = that.waveform.getDuration();

  const { currentSegment } = that.props;
  const region_start = currentSegment.get('region_start');
  const region_end = currentSegment.get('region_end');
  const isChangeStart = Math.abs(region.start - region_start) > 0.1;
  const isChangeEnd = Math.abs(region.end - region_end) > 0.1;

  //超出区间恢复
  if (region.start < 0) {
    region.start = 0;
    if (isChangeEnd) {
      region.end = minLength
    }
  };
  if (region.end > duration) {
    region.end = duration;
    if (isChangeStart) {
      region.start = duration - minLength
    }
  };
  //小于间隔恢复
  if ((region.end - region.start) < minLength) {
    if (isChangeStart) {
      region.start = region_start;
    } else if (isChangeEnd) {
      region.end = region_end;
    };
  };
  //禁止整个移动
  // if (isChangeStart && isChangeEnd) {
  //   region.start = region_start;
  //   region.end = region_end
  // }

  //更新store
  const {
    boundProjectActions: { updateWaveformRegions }
  } = that.props;
  updateWaveformRegions({ start: region.start, end: region.end });

  //暂停播放，更新指针
  that.waveform.pause();
  const current = that.waveform.getCurrentTime();
  if (current < region.start || current > region.end) {
    const position = Math.abs(current - region.start) < Math.abs(current - region.end) ? region.start : region.end;
    const parameter = position / duration;
    that.waveform.seekTo(parameter);
  }
};

const handleEegionChangeEnd = (region, that) => {
  // handleEegionChange(region, that, true);
  regionUpdateTitle();
  setTimeout(() => {
    that.props.boundProjectActions.saveSlideshow();
  }, 100);
};

const handleLoading = (percent, that) => {
  that.setState({
    showAddBtn: false,
    showloading: true
  });
};

const handleSeek = (position, that) => {
  const { duration } = that.state;
  const currentTime = formatTime(position * duration);
  const currentTimePosLeft = `${position * 100}%`;

  that.waveform.setCursorColor('#0077CC');

  that.setState({
    currentTime,
    showCurrentTime: true,
    currentTimePosLeft
  });
};

const handleEegionClick = (region, event, that) => {
  const parentNode = event.target.parentNode;
  if (parentNode.className === 'wavesurfer-region') {
    return false;
  }
  const screenX = event.clientX;
  const { left, width } = parentNode.getBoundingClientRect();
  const parameter = (screenX - left) / width;
  that.waveform.pause();
  that.waveform.seekTo(parameter);
};

const handleAudioprocess = (time, that) => {
  console.log('time', time);
  const { duration } = that.state;
  const currentTime = formatTime(time);
  const currentTimePosLeft = `${(time / duration) * 100}%`;
  that.setState({
    currentTime,
    currentTimePosLeft
  });
};

const handleFinish = that => {
  that.setState({
    showCurrentTime: false,
    playing: false
  });

  that.waveform.setCursorColor('transparent');
};

const handlePause = that => {
  that.setState({
    playing: false
  });
};

const handlePlay = that => {
  const { currentSegment } = that.props;
  const region_start = currentSegment.get('region_start');
  const region_end = currentSegment.get('region_end');
  const musicUrl = currentSegment.get('musicUrl');
  if (!musicUrl || !region_end) {
    return false;
  }
  const { playing, currentTime } = that.state;

  that.setState({
    playing: !playing,
    showCurrentTime: true
  });

  if (!playing) {
    const positions = fomatTimeNum(currentTime);
    const left = positions > region_start && positions < region_end ? positions : region_start;
    that.waveform.play(left, region_end);
  } else {
    that.waveform.pause();
  }

  // that.waveform.setCursorColor('rgba(58,58,58, 1)');
};

const handleDestroy = that => {};

const handleDelete = that => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_DeleteMusic'
  });

  const { boundProjectActions, currentSegment } = that.props;
  const { deleteWaveform } = boundProjectActions;
  const encId = currentSegment.get('musicEncId');
  deleteWaveform(encId);
  that.waveform.destroy();
  // that.waveform.unAll();
  that.waveform.pause();
  that.setState({
    showAddBtn: true,
    playing: false,
    showCurrentTime: false,
    currentTime: 0,
    currentTimePosLeft: 0
  });

  console.log('destroy');
};

const handleAddMusic = that => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_Click_AddMusic'
  });

  const { boundGlobalActions } = that.props;
  const { showModal, hideModal } = boundGlobalActions;
  that.waveform.destroy();
  that.waveform.unAll();
  that.setState({
    showAddBtn: true
  });
  showModal(ADD_MUSIC_SLIDESHOW_MODAL, {
    close: () => hideModal(ADD_MUSIC_SLIDESHOW_MODAL)
  });
  console.log('destroy');
};

const handleChange = that => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_ReplaceMusic'
  });

  const { boundGlobalActions, boundProjectActions } = that.props;
  const { showModal, hideModal } = boundGlobalActions;

  that.setState({
    playing: false
    // currentTimePosLeft: '0',
    // currentTime: '0',
    // showCurrentTime: false,
  });

  that.waveform.pause();
  // that.waveform.skip(0);
  // that.waveform.unAll();

  showModal(ADD_MUSIC_SLIDESHOW_MODAL, {
    close: () => {
      boundProjectActions.deleteMusicList();
      boundProjectActions.deleteFavoriteList();
      hideModal(ADD_MUSIC_SLIDESHOW_MODAL);
    }
  });
};

const renderImagesPos = that => {
  const { currentSegment } = that.props;
  const segmentImages = currentSegment.get('segmentImages');
  const region_start = currentSegment.get('region_start');
  const region_end = currentSegment.get('region_end');
  const duration = currentSegment.get('duration');

  const startRate = (region_start / duration) * 100;

  return (
    <div className="images-pos-warp">
      {segmentImages && segmentImages.size
        ? segmentImages.map((image, index) => {
            const eachImageTime = (region_end - region_start) / segmentImages.size;
            const eachImageTimeRate = (eachImageTime / duration) * 100;
            const style = {
              width: `${eachImageTimeRate}%`,
              left: `${startRate + index * eachImageTimeRate}%`,
              display: `${image.get('selected') ? 'block' : 'none'}`
            };
            return <span style={style} className="image-pos-item" />;
          })
        : null}
    </div>
  );
};

const renderRegionsTime = that => {
  const { currentSegment } = that.props;
  const region_start = currentSegment.get('region_start');
  const region_end = currentSegment.get('region_end');
  const duration = currentSegment.get('duration');

  const startRate = (region_start / duration) * 100;
  const endRate = (region_end / duration) * 100;

  if (!duration) {
    return null;
  }

  const offsetMin = region_end - region_start < 14;
  const offsetMinLeft = offsetMin && duration - region_end < 6;
  const offsetMinRight = offsetMin && duration - region_end > 6;

  return (
    <div className="regions-time-warp">
      <div className="left" style={{ left: `calc(${startRate}% + ${offsetMinLeft ? -32 : 2}px)` }}>
        {formatTime(region_start)}
      </div>
      <div className="right" style={{ left: `calc(${endRate}% + ${offsetMinRight ? 2 : -32}px)` }}>
        {formatTime(region_end)}
      </div>
    </div>
  );
};

export default {
  initialWaveform,
  destroyWaveform,
  handlePlay,
  handleChange,
  handleDelete,
  handleAddMusic,
  renderImagesPos,
  renderRegionsTime
};
