import React from 'react';
import classnames from 'classnames';
import { XPureComponent, XCardList, XFileUpload, XIcon, EmptyContent } from '@common/components';
import XUploadDirectoryButton from '@resource/components/XUploadDirectoryButton';
import EditorImageCard from '@apps/aiphoto/components/EditorImageCard';
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
          boundGlobalActions,
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
      text: t('选择照片上传'),
      addImages: this.onAddImages,
      uploadFileClicked: () => {},
      preCheck: preCheckUploadCondition,
      showModal: boundGlobalActions.showModal,
      accept: 'image/jpeg'
    };

    const fileUploadDirectoryProps = {
      label: t('选择文件夹上传'),
      acceptFileTypes: ['image/jpeg'],
      onAddImages: this.onAddImages,
      showModal: boundGlobalActions.showModal
    };

    const pannelClass = classnames('sub-pannel', {
      ['is-show']: !!isShowPannel
    });

    const emptyContentProps = {
      desc: t('您的修片档案中还没有照片'),
      tip: t('NO_PHOTOS_IN_SET_TIP2'),
      other: t('NO_PHOTOS_DROP_UPLOAD_DESC'),
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
    return (
      <div className={wrapperCls}>
        {isOriginal === 2 && failedCount > 0 && (
          <div className="failed-text">
            以下照片参数无法识别，修图失败。请更换照片或者调整格式后，重新创建文件档案，进行修图...
          </div>
        )}
        {imageList && imageList.size ? <XCardList {...cardListProps} /> : null}
        {isShowEmptyContent && isOriginal === 1 ? <EmptyContent {...emptyContentProps} /> : null}

        {/* <XLoading type="imageLoading" size="lg" zIndex={99} isShown={isShowContentLoading} /> */}
      </div>
    );
  }
}

export default EditorImageList;
