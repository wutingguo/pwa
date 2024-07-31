import PropTypes from 'prop-types';
import React from 'react';

import human from '@resource/static/image/human.png';

import * as localModalTypes from '@apps/gallery/constants/modalTypes';

import './index.scss';

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      unfold: false,
    };
  }

  static defaultProps = {
    completed: 0,
    color: '#0BD318',
    animation: 200,
    title: '智能分片',
  };
  componentDidUpdate(prevProps) {
    const { completed } = this.props;
    const { completed: prevCompleted } = prevProps;
    if (completed !== prevCompleted && completed === 100) {
      this.setState({ unfold: true });
    }
  }

  static throwError() {
    return new Error(...arguments);
  }
  setStateText = completed => {
    let stateText = '人脸数据监测中…';
    if (completed < 25) {
      return '人脸数据监测中…';
    } else if (completed < 50) {
      return '人脸数据比对中';
    } else if (completed <= 99) {
      return '相似人脸归类中';
    } else if (completed === 100) {
      return '智能分片完成';
    }
    return stateText;
  };
  handleView = () => {
    const { boundGlobalActions, collectionDetail, setProgress, doSetInterval, commonAction } =
      this.props;
    boundGlobalActions.showModal(localModalTypes.AI_GROUPS_MODAL, {
      collectionDetail,
      onSmartSharding: commonAction.onSmartSharding || (() => {}),
      afterclose: () => {
        setProgress(true);
        doSetInterval();
      },
    });
    setProgress(false);
  };

  render() {
    const { color, completed, animation, className, title } = this.props;
    const { unfold } = this.state;
    const style = {
      // backgroundColor: color,
      width: completed + '%',
      // transition: `width ${animation}ms`,
    };
    const stateText = this.setStateText(completed);
    const isFinish = completed === 100;

    return (
      <div className={`${className} progressbar-container`}>
        {unfold ? (
          <div
            className="round-progress"
            onClick={() => {
              this.setState({ unfold: false });
            }}
          >
            <div className="human-shape">
              <img className="human-icon" src={human} alt="" />
            </div>
            <div className="round-progress-text">
              {isFinish ? '分片完成' : `分片中  ${completed}%`}{' '}
            </div>
          </div>
        ) : (
          <div className="column-progress">
            <div className="progress-title">
              {title}
              <span
                className="unfold"
                onClick={() => {
                  this.setState({ unfold: true });
                }}
              >
                {'>>'}
              </span>
            </div>
            <div className="state-text">
              {stateText}
              {completed === 100 && (
                <div className="show-view" onClick={() => this.handleView()}>
                  查看
                </div>
              )}
            </div>
            <div className="progress-container">
              <div className="progress">
                <div className="progress-bar" style={style} />
              </div>
              <span className="progress-label">{completed}%</span>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Progress;
