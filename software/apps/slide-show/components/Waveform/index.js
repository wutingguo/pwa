import React, { Component } from 'react';
import Tooltip from 'rc-tooltip';
import { XIcon, XLoading } from '@common/components';
import equals from '@resource/lib/utils/compare';
import main from './handle/main';
import { pauseWaveformVideoEvent } from '@apps/slide-show/utils/eventBus';

import './index.scss';
import classNames from 'classnames';

class Waveform extends Component {
  constructor(props) {
    super(props);
    this.waveformContainer = React.createRef();
    this.currentTimeContainer = React.createRef();
    this.state = {
      showloading: false,
      playing: false,
      currentTimePosLeft: '0',
      currentTime: '0',
      showCurrentTime: false,
      showImagesPos: true,
      duration: 0,
      showAddBtn: true
    };
  }

  componentDidMount() {
    main.initialWaveform(this);
  }

  componentWillReceiveProps(nextProps) {
    const musicUrl = this.props.currentSegment.get('musicUrl');
    const replaceMusicUrl = nextProps.currentSegment.get('musicUrl');
    const isEqual = equals(musicUrl, replaceMusicUrl);
    if (!isEqual) {
      main.initialWaveform(this, nextProps);
    }
  }

  componentWillUnmount() {
    pauseWaveformVideoEvent.remove();
    main.destroyWaveform(this);
  }

  handlePlay = () => main.handlePlay(this);

  handleChange = () => main.handleChange(this);

  handleDelete = () => main.handleDelete(this);

  handleAddMusic = () => main.handleAddMusic(this);

  renderImagesPos = () => main.renderImagesPos(this);

  renderRegionsTime = () => main.renderRegionsTime(this);

  render() {
    const {
      playing,
      showCurrentTime,
      currentTimePosLeft,
      currentTime,
      showloading,
      showAddBtn
    } = this.state;
    const containerClass = classNames('waveform-container');

    return (
      <div className={containerClass}>
        {!showAddBtn ? (
          <div className="play-btn">
            <XIcon
              type={playing ? 'pause' : 'playing'}
              onClick={this.handlePlay}
              iconWidth={28}
              iconHeight={28}
            />
          </div>
        ) : null}
        <div className="waveform-wrap">
          <div className="waveform" ref={this.waveformContainer} id="waveform">
            <audio src="" preload="preload" ref={node => (this.audioNode = node)} />
          </div>
          {showCurrentTime ? (
            <div
              className="process-time"
              ref={this.currentTimeContainer}
              style={{ left: currentTimePosLeft }}
            >
              {currentTime}
            </div>
          ) : null}
          <XLoading type="imageLoading" size="lg" zIndex={99} isShown={showloading} />
          {this.renderImagesPos()}
          {!showAddBtn && this.renderRegionsTime()}

          {showAddBtn ? (
            <div className="no-music-wrap">
              <XIcon
                type="add"
                iconWidth={12}
                iconHeight={12}
                theme="black"
                title={t('SLIDESHOW_ADD_MUSICS')}
                text={t('SLIDESHOW_ADD_MUSICS')}
                onClick={this.handleAddMusic}
              />
            </div>
          ) : null}
        </div>
        {
          showAddBtn && <div style={{ width: 89, backgroundColor: '#f6f6f6' }} />
        }
        {!showAddBtn ? (
          <div className="handle-wrap">
            <div className="handle-item">
              <Tooltip
                key={0}
                overlayClassName="waveform-tooltip"
                placement="left"
                overlay={t('SLIDESHOW_WAVEFORM_REPLACE')}
              >
                <span>
                  <XIcon type={'change'} onClick={this.handleChange} />
                </span>
              </Tooltip>
            </div>
            <div className="handle-item">
              <Tooltip
                key={1}
                overlayClassName="waveform-tooltip"
                placement="left"
                overlay={t('SLIDESHOW_WAVEFORM_DELETE')}
              >
                <span>
                  <XIcon
                    type={'delete'}
                    onClick={this.handleDelete}
                    iconWidth={14}
                    iconHeight={15}
                  />
                </span>
              </Tooltip>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Waveform;
