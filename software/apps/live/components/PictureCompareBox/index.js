import classNames from 'classnames';
import React from 'react';

import { defaultPresetTopics } from '@resource/lib/constants/strings';

import ImageLazyLoad from '@common/components/ImageLazyLoad';

import './index.scss';

class PictureCompareBox extends React.Component {
  constructor() {
    super();
    this.state = {
      oriImageOffset: {
        top: 0,
        left: 0,
      },
      oriImageStyle: {
        width: '50%',
      },
      oriImage: '',
      newImage: '',
      current: 0,
      transitionTag: false, //是否开启过度动画
    };
    this.timer = null;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    const { isHOC, oriImage, newImage, topicCode } = this.props;
    if (isHOC) {
      this.setState({
        oriImage,
        newImage,
        currentTopic_code: topicCode,
      });
    }
  }

  handleMouseMove(event) {
    clearInterval(this.timer);
    this.setState({
      transitionTag: false,
      oriImageStyle: {
        width: event.clientX - this.oriImage.getBoundingClientRect().left,
      },
    });
  }

  handleMouseLeave() {
    this.setState({
      transitionTag: true,
    });
  }

  setCurrent = item => {
    this.setState({ currentTopic_code: item.topic_code });
    this.props.saveOperation(item.topic_code);
  };
  // UI还原Fn
  reduction = (type, position = '50%', time = '0.4') => ({
    [type]: position,
    transition: `${type} ${time}s`,
  });
  renderCompare = (oriImage, newImage) => {
    const { oriImageStyle, transitionTag } = this.state;
    const { className = '', style = {}, alt } = this.props;
    return (
      <div
        className={`picture-compare-box ${className}`}
        style={style}
        ref={node => (this.oriImage = node)}
      >
        <a href="javascript:void(0);" className="picture-wrap">
          <div
            className="original-image"
            style={transitionTag ? this.reduction('width') : oriImageStyle}
          >
            <img src={oriImage} alt={alt || ''} />
          </div>
          <img src={newImage} className="new-image" alt={alt || ''} />
        </a>
      </div>
    );
  };

  render() {
    const {
      oriImageStyle: { width },
      oriImage,
      newImage,
      current,
      transitionTag,
      currentTopic_code,
    } = this.state;
    const { className = '', style = {}, alt, topicEffects } = this.props;

    const currentOri = `/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/base-portal/${defaultPresetTopics[current]}.jpg`;
    const currentNew = `/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/effect-portal/${defaultPresetTopics[current]}.jpg`;
    // topicEffects
    return (
      <div>
        <div className="list-box">
          {/* {defaultPresetTopics.map((item, index) => {
            const itemClass = classNames('item', { active: current === index });
            return (
              <div className={itemClass} onClick={() => this.setCurrent(index)}>
                <img
                  alt={alt || ''}
                  src={`/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/effect-small/${item}-1.jpg`}
                />
              </div>
            );
          })} */}
          {topicEffects.map(item => {
            const itemClass = classNames('item', { active: currentTopic_code === item.topic_code });
            return (
              <div className={itemClass} onClick={() => this.setCurrent(item)}>
                {/* <img
                    alt={alt || ''}
                    src={`/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/effect-small/${item}-1.jpg`}
                  /> */}
                <p>{item.topic_name}</p>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '0 80px 80px' }}>
          <div
            className={`picture-compare-section ${className} `}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
          >
            <span
              className="oriText commonText"
              style={transitionTag ? this.reduction('left') : { left: width }}
            >
              原
            </span>
            <span
              className="newText commonText"
              style={transitionTag ? this.reduction('left') : { left: width }}
            >
              修
            </span>
            <ImageLazyLoad src={currentOri} />
            <div className="picture-box">{this.renderCompare(currentOri, currentNew)}</div>
          </div>
        </div>
      </div>
    );

    // return this.renderCompare(oriImage, newImage);
  }
}

export default PictureCompareBox;
