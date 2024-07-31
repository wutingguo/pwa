import classnames from 'classnames';
import React, { Fragment } from 'react';

import XUploadDirectoryButton from '@resource/components/XUploadDirectoryButton';

import {
  EmptyContent,
  XCardList,
  XFileUpload,
  XIcon,
  XLoading,
  XPureComponent,
} from '@common/components';

import EditorImageCard from '@apps/gallery/components/EditorImageCard';
import XCardListTimeSlice from '@apps/gallery/components/XCardListTimeSlice';

import BeforeUploadDom from '../BeforeUploadDom';
import detailHeaderHandler from '../CollectionDetailHeader/handler';

import main from './handle/main.js';

import './index.scss';

class EditorImageList extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dropEncImgId: '',
      isShowPannel: false,
    };
    this.onOpenAiphotoClick = (...opt) => detailHeaderHandler.onOpenAiphotoClick(this, ...opt);
  }

  componentDidMount() {
    window.addEventListener('click', this.hidePannel, false);
  }

  componentWillUnMount() {
    window.removeEventListener('click', this.hidePannel, false);
  }

  togglePannel = e => {
    this.setState({
      isShowPannel: !this.state.isShowPannel,
    });
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
    return false;
  };
  hidePannel = () => {
    this.setState({
      isShowPannel: false,
    });
  };

  onAddImages = files => main.onAddImages(this, files);
  resortImages = (...opt) => main.resortImages(this, ...opt);

  handleSelectImg = imgItem => {
    const { boundProjectActions } = this.props;
    boundProjectActions.changeSelectedImg(imgItem.get('enc_image_uid'));
  };

  changeDragEnteredId = dropEncImgId => {
    this.setState({ dropEncImgId });
  };

  render() {
    const { isShowPannel } = this.state;
    const {
      urls,
      collectionDetail,
      isShowEmptyContent,
      setImageList,
      uploadParams,
      toAiClick,
      boundGlobalActions,
      boundProjectActions,
      preCheckUploadCondition,
      isShowContentLoading,
      grayInfo,

      uploadedStartWatermark,
      oneWaterMarkLoadings,
      curSetVideo,
    } = this.props;

    const { loading, apply_all } = collectionDetail.get('watermarkLoading')?.toJS() || {};

    const watermarkLoading = loading && apply_all;

    const cardListProps = {
      items: setImageList,
      style: { paddingLeft: '1.23rem' },
      currentSetUid: collectionDetail.get('currentSetUid'),
      renderCard: data => {
        const cardProps = {
          ...data,
          urls,
          boundProjectActions,
          toAiClick,
          watermarkLoading,
          oneWaterMarkLoadings,
          collectionDetail,
          boundGlobalActions, // watermarkLoading阻止点击选中和操作
          isShowImgName: collectionDetail.getIn(['photos', 'isShowImgName']),
          handleClick: this.handleSelectImg,
          resortImages: this.resortImages,
          changeDragEnteredId: this.changeDragEnteredId,
          dropEncImgId: this.state.dropEncImgId,
          cardListNode: this.cardListNode,
        };

        return <EditorImageCard {...cardProps} />;
      },
    };

    const fileUploadProps = {
      uploadParams: {
        ...uploadParams,
        grayInfo,

        beforeDom: (callBack, mySubscription) => (
          <BeforeUploadDom
            {...this.props}
            files={this.state.files}
            callBack={callBack}
            mySubscription={mySubscription}
          />
        ),
        startWatermark: uploadedStartWatermark,
      },
      multiple: 'multiple',
      inputId: 'multiple',
      text: t('SELECT_UPLOAD_PHOTOS'),
      addImages: this.onAddImages,
      uploadFileClicked: () => {
        window.logEvent.addPageEvent({
          name: 'GalleryPhotos_Click_AddPhotos',
        });
      },
      preCheck: preCheckUploadCondition,
      showModal: boundGlobalActions.showModal,
    };

    const fileUploadDirectoryProps = {
      uploadParams: {
        ...uploadParams,
        grayInfo,

        beforeDom: (callBack, mySubscription) => (
          <BeforeUploadDom
            {...this.props}
            files={this.state.files}
            callBack={callBack}
            mySubscription={mySubscription}
          />
        ),
        startWatermark: uploadedStartWatermark,
      },
      label: t('SELECT_UPLOAD_FOLDER'),
      acceptFileType: 'image/jpeg,image/jpg',
      onAddImages: this.onAddImages,
      showModal: boundGlobalActions.showModal,
    };

    const pannelClass = classnames('sub-pannel', {
      ['is-show']: !!isShowPannel,
    });

    const emptyContentProps = {
      desc: t('NO_PHOTOS_IN_SET_DESC'),
      tip: t('NO_PHOTOS_IN_SET_TIP'),
      other: t('NO_PHOTOS_DROP_UPLOAD_DESC'),
      iconText: t('ADD_PHOTOS'),
      handleClick: () => {},
      style: {
        fontSize: '18px',
        marginBottom: '20px',
      },
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
            <li onClick={this.onOpenAiphotoClick}>{t('UPLOAD_FROM_ZNO_RETOUCHER')}</li>
            {/* 中文露出照片直播图片上传 */}
            {__isCN__ && (
              <li onClick={() => this.onOpenAiphotoClick({ type: 'live' })}>
                {t('UPLOAD_FROM_ZNO_INSTANT')}
              </li>
            )}
          </ul>
        </div>
      ),
    };
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const selectedVideo = collectionDetail.getIn(['gallery_video_info', 'isSelectVideo']);

    const wrapProps = {
      className: classnames('editor-image-list', {
        'editor-image-hide-bar': selectedImgCount == 0,
        'editor-image-show-bar': selectedImgCount > 0,
        'editor-image-disabled': selectedVideo,
        'editor-image-video': curSetVideo,
      }),
      ref: node => (this.cardListNode = node),
    };
    return (
      <Fragment>
        {!__isCN__ && curSetVideo && <div className="list-title">Photos</div>}
        <div {...wrapProps}>
          {setImageList && setImageList.size ? <XCardListTimeSlice {...cardListProps} /> : null}
          {isShowEmptyContent ? <EmptyContent {...emptyContentProps} /> : null}

          <XLoading type="imageLoading" size="lg" zIndex={99} isShown={isShowContentLoading} />
        </div>
      </Fragment>
    );
  }
}

export default EditorImageList;
