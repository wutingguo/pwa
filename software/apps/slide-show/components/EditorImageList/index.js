import React from 'react';
import classnames from 'classnames';
import { XPureComponent, XCardList, XFileUpload, XLoading, EmptyContent } from '@common/components';
import { fromJS } from 'immutable';

import equals from '@resource/lib/utils/compare';

import main from './handle/main';
import render from './handle/render';
import withSelector from './withSelector';

import './index.scss';

class EditorImageList extends XPureComponent {
  constructor(props) {
    super(props);

    const { collectionDetail } = props;
    this.state = {
      stateFrameList: collectionDetail ? collectionDetail.get('frameList') : null
    };
  }

  onAddImages = files => main.onAddImages(this, files);
  resortFrames = (dragGuid, dropGuid) => main.resortFrames(this, dragGuid, dropGuid);

  handleSelectImg = imgItem => {
    const { boundProjectActions } = this.props;
    boundProjectActions.changeSelectedImg(imgItem.get('guid'));
  };

  // 渲染card item.
  renderCard = item => render.renderCard(this, item);

  componentWillReceiveProps(nextProps) {
    const { collectionDetail } = this.props;
    const { collectionDetail: nextCollectionDetail } = nextProps;

    const isEquals = equals(collectionDetail, nextCollectionDetail);
    if (!isEquals) {
      this.setState({ stateFrameList: nextCollectionDetail.get('frameList') });
    }
  }

  render() {
    const {
      urls,
      collectionDetail,
      isShowEmptyContent,
      uploadParams,
      boundGlobalActions,
      preCheckUploadCondition,
      isShowContentLoading = false,

      id,
      cardClassName,
      maskId,
      maskBoxStyle,
      isShowBoxMask = false,
      handleMouseDown
    } = this.props;

    const { stateFrameList } = this.state;
    const frameList = stateFrameList.reduce((res, item) => {
      const image = item.get('image');
      const imgId = image.get('enc_image_uid');
      const fromRes = res.find(sub => sub.getIn(['image', 'enc_image_uid']) === imgId);
      if (!fromRes) {
        res = res.push(item);
      }
      return res;
    }, fromJS([]));

    const cardListProps = {
      items: frameList,
      className: cardClassName,
      style: {
        paddingLeft: '1.23rem'
      },
      renderCard: this.renderCard
    };

    const fileUploadProps = {
      uploadParams,
      multiple: 'multiple',
      inputId: 'multiple',
      text: t('ADD_PHOTOS'),
      addImages: this.onAddImages,
      uploadFileClicked: () => {
        window.logEvent.addPageEvent({
          name: 'GalleryPhotos_Click_AddPhotos'
        });
      },
      preCheck: preCheckUploadCondition,
      showModal: boundGlobalActions.showModal
    };

    const emptyContentProps = {
      desc: t('YOU_HAVE_NO_PHOTOS'),
      tip: t('NO_PHOTOS_IN_SET_TIP'),
      other: t('NO_PHOTOS_DROP_UPLOAD_DESC'),
      iconText: t('ADD_PHOTOS'),
      handleClick: () => {},
      handleButton: <XFileUpload {...fileUploadProps} />
    };
    const selectedImgCount = collectionDetail.getIn(['photos', 'selectedImgCount']);
    const wrapperCls = classnames('editor-image-list', {
      'editor-image-hide-bar': selectedImgCount == 0,
      'editor-image-show-bar': selectedImgCount > 0
    });
    return (
      <div className={wrapperCls} id={id} onMouseDown={handleMouseDown}>
        {frameList && !!frameList.size && isShowBoxMask && (
          <div id={maskId} style={maskBoxStyle}></div>
        )}

        {frameList && frameList.size ? <XCardList {...cardListProps} /> : null}
        {isShowEmptyContent ? <EmptyContent {...emptyContentProps} /> : null}

        <XLoading type="imageLoading" size="lg" zIndex={99} isShown={isShowContentLoading} />
      </div>
    );
  }
}

// export default withSelector(EditorImageList);
export default EditorImageList;
