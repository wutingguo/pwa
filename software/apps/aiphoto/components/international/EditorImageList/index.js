import React from 'react';
import classnames from 'classnames';
import { XPureComponent, XCardList, XFileUpload, XIcon, EmptyContent } from '@common/components';
import XUploadDirectoryButton from '@resource/components/XUploadDirectoryButton';
import EditorImageCard from '@apps/aiphoto/components/international/EditorImageCard';
import main from './handle/main.js';

import './index.scss';

class EditorImageList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShowPannel: false
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.hidePannel, false);
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.hidePannel, false);
  }
  togglePannel = e => {
    this.setState({
      isShowPannel: !this.state.isShowPannel
    });
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
    return false;
  };
  hidePannel = () => {
    this.setState({
      isShowPannel: false
    });
  };

  onAddImages = files => main.onAddImages(this, files);

  handleSelectImg = imgItem => {
    const { boundProjectActions } = this.props;
    boundProjectActions.changeSelectedImg(imgItem.get('enc_image_id'));
  };

  render() {
    const { isShowPannel } = this.state;
    const {
      urls,
      collectionDetail,
      isShowEmptyContent,
      imageList,
      uploadParams,
      boundGlobalActions,
      preCheckUploadCondition,
      boundProjectActions,
      toAiClick
    } = this.props;

    const cardListProps = {
      items: imageList,
      style: { paddingLeft: '1.23rem' },
      renderCard: data => {
        const cardProps = {
          ...data,
          urls,
          boundProjectActions,
          toAiClick,
          handleClick: this.handleSelectImg
        };

        return <EditorImageCard {...cardProps} />;
      }
    };

    const fileUploadProps = {
      uploadParams,
      multiple: 'multiple',
      inputId: 'multiple',
      text: t('SELECT_UPLOAD_PHOTOS'),
      addImages: this.onAddImages,
      uploadFileClicked: () => {},
      preCheck: preCheckUploadCondition,
      showModal: boundGlobalActions.showModal,
      accept: 'image/jpeg'
    };

    const fileUploadDirectoryProps = {
      label: t('SELECT_UPLOAD_FOLDER'),
      acceptFileTypes: ['image/jpeg'],
      onAddImages: this.onAddImages,
      showModal: boundGlobalActions.showModal
    };

    const pannelClass = classnames('sub-pannel', {
      ['is-show']: !!isShowPannel
    });

    const emptyContentProps = {
      desc: t('EMPTY_PHOTOS_IN_COLLECTION'),
      tip: t('NO_PHOTOS_IN_SET_TIP2'),
      other: t('NO_PHOTOS_DROP_UPLOAD_DESC2'),
      iconText: t('ADD_PHOTOS'),
      handleClick: () => {},
      handleButton: (
        <div className="add-photo-empty-container">
          <XIcon
            type="add"
            // theme="black"
            text={t('ADD_PHOTOS')}
            onClick={this.togglePannel}
          />
          <ul className={pannelClass}>
            <li>
              <XFileUpload {...fileUploadProps} />
            </li>
            <li>
              <XUploadDirectoryButton {...fileUploadDirectoryProps} />
            </li>
          </ul>
        </div>
      )
    };
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const wrapperCls = classnames('editor-image-list', {
      'editor-image-hide-bar': selectedImgCount == 0,
      'editor-image-show-bar': selectedImgCount > 0
    });
    const failedCount = collectionDetail.get('failed_image_count');
    const isOriginal = collectionDetail.get('is_original');
    const hideRetoucher = collectionDetail.get('hideRetoucher');
    return (
      <div className={wrapperCls}>
        {isOriginal === 2 && failedCount > 0 && (
          <div className="failed-text">{t('RETOUCH_EORROR_TIP')}</div>
        )}
        {imageList && imageList.size ? <XCardList {...cardListProps} /> : null}
        {isShowEmptyContent && isOriginal === 1 && !hideRetoucher && <EmptyContent {...emptyContentProps} />}
        {isShowEmptyContent && isOriginal === 1 && hideRetoucher && <div className="hide-retoucher-tips">{t('HIDE_RETOUCHER_TIPS')}</div>}
        {/* <XLoading type="imageLoading" size="lg" zIndex={99} isShown={isShowContentLoading} /> */}
      </div>
    );
  }
}

export default EditorImageList;
