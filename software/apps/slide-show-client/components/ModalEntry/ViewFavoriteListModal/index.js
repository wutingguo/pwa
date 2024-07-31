import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction } from 'lodash';

import { XModal, XButton, XInput, XIcon } from '@common/components';
import XWaterFall from '@resource/components/XWaterFall';
import XCoverRender from '@resource/components/pwa/XCoverRender';
import main from './main';

import './index.scss';

class ViewFavoriteListModal extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const set = data.get('set');
    const cover = data.get('cover');
    const images = data.get('images');
    const favoriteSetting = data.get('favoriteSetting');
    this.photoContainer = React.createRef();

    this.state = {
      set,
      cover,
      images,
      favoriteSetting,
      boxWidth: 0,
      boxHeight: 0
    };
  }

  renderCard = (item, index) => main.renderCard(this, item, index);

  componentDidMount() {
    this.getCoverBoxSize();
    if (this.photoContainer) {
      this.photoContainer.current.scrollIntoView();
    }
    // resizing时, 重新计算node的style.
    window.addEventListener('resize', this.getCoverBoxSize);
  }

  getCoverBoxSize = () => {
    const { data, isFullScreen } = this.props;
    const cover = data.get('cover');
    const computed = cover.get('computed');
    if (!computed) {
      return;
    }

    const ratio = computed.get('ratio');
    const page = document.documentElement || document.body;
    const boxWidth = page.clientWidth;
    const boxHeight = isFullScreen ? page.clientHeight : boxWidth / ratio;

    this.setState({ boxWidth, boxHeight });
  };

  componentDidUpdate(prevProps, prevState) {
    const oldHeight = prevState.boxHeight;
    const newHeight = this.state.boxHeight;
    if (oldHeight !== newHeight) {
      this.photoContainer.current.scrollIntoView();
    }
  }

  render() {
    const { data } = this.props;
    const { set, cover, images } = this.state;
    const favorite = data.get('favorite');
    const favoriteName = favorite ? favorite.get('favorite_name') : '';
    const setName = set ? set.get('set_name') : '';
    const favoriteEmail = favorite ? favorite.get('email') : '';

    const close = data.get('close');
    const wrapClass = classNames('view-favorite-list-modal', data.get('className'));

    // 封面渲染
    const coverRenderProps = {
      cover
    };

    // set图片列表.
    const waterFallProps = {
      list: images,
      renderCard: this.renderCard,
      onScrollToBottom: this.loadData
    };

    return (
      <XModal className={wrapClass} opened onClosed={close} escapeClose={false} isHideIcon>
        <div className="modal-body">
          <XCoverRender {...coverRenderProps} />
          <div className="wrap" ref={this.photoContainer}>
            <div className="favorite-view-header">
              <XIcon type="back" onClick={close} text={t('BACK')} />

              {/*{images.size ? (*/}
              {/*  <span className="photo-number">*/}
              {/*    {images.size} {t('FAVORITE_PHOTOS_COUNT_SUFFIX')}*/}
              {/*  </span>*/}
              {/*) : null}*/}
            </div>
            {/* 图片列表 */}
            <div className="empty-image-wrap">
              <div className="title">{setName}</div>
              <div className="set-info">
                <span className="text1">
                  {images.size} {t('FAVORITE_PHOTOS_COUNT_SUFFIX')}
                </span>
                <span className="text1 line">|</span>
                <span className="text1">
                  {t('CREATED_BY')} {favoriteEmail}
                </span>
              </div>
              {images.size ? (
                <XWaterFall {...waterFallProps} />
              ) : (
                <Fragment>
                  <div className="text2">{t('NO_FAVORITE_PHOTOS')}</div>
                  <XButton onClicked={close}>{t('RETURN_TO_GALLERY')}</XButton>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}

ViewFavoriteListModal.propTypes = {
  data: PropTypes.object.isRequired
};

ViewFavoriteListModal.defaultProps = {};

export default ViewFavoriteListModal;
