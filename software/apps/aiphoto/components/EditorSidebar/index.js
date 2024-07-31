import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { isEqual } from 'lodash';
import { XImg, XIcon } from '@common/components';
import { getOrientationAppliedImage } from '@resource/lib/utils/exif';
import { getImageUrl } from '@resource/lib/saas/image';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import { handleRenameCover } from './handle/main';
import { defaultPresetTopics } from '@resource/lib/constants/strings';
import './index.scss';
class SideBar extends Component {
  constructor(props) {
    super(props);
    this.backUpImg = '';
    this.state = {
      codeImage:
        '/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/effect-small/default.jpg'
    };
  }

  async componentDidUpdate(preProp) {
    const { collectionDetail, urls } = this.props;
    const { collectionDetail: preCollectionDetail } = preProp;
    if (!isEqual(preCollectionDetail, collectionDetail)) {
      const images = collectionDetail.get('images');

      if (images.size) {
        const galleryBaseUrl = urls.get('galleryBaseUrl');
        const imageUid = images.get(0).get('enc_image_id');
        const orientation = images.get(0).get('orientation');
        const codeImage = getImageUrl({
          galleryBaseUrl,
          image_uid: imageUid,
          thumbnail_size: thumbnailSizeTypes.SIZE_350,
          isWaterMark: false
        });
        const imgUrl = await getOrientationAppliedImage(codeImage, orientation);
        console.log('imgUrl: ', imgUrl);
        this.setState({
          codeImage: imgUrl
        });
      }
    }
  }

  render() {
    const { collectionDetail, backToList, effectsList } = this.props;
    const { codeImage } = this.state;
    const tName = collectionDetail.get('collection_name');
    const tCode = collectionDetail.get('topic_code');
    const categoryCode = collectionDetail.get('topic_category_code');
    const totalCount = collectionDetail.get('total_image_count');
    const isDefaultTopic = defaultPresetTopics.includes(tCode);

    let topicLabel = t(tCode);
    if (!isDefaultTopic && effectsList.size > 0) {
      for (let i = 0; i < effectsList.size; i++) {
        if (effectsList.get(i).get('topic_code') === tCode) {
          topicLabel = effectsList.get(i).get('topic_name');
          break;
        }
      }
    }

    const imgStyle = {
      backgroundImage: `url(${codeImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };

    return (
      <div className="aiphoto-editor-sidebar-wrapper">
        <div className="aiphoto-editor-sidebar-photos-set">
          <div className="title">
            <span className="back" onClick={() => backToList()}>
              {'<'} {t('BACK')}
            </span>
            <span className="name" title={tName}>
              {tName}
            </span>
          </div>
          <div className="list">
            <div className="item active">
              {t('ALL_PHOTO')}({totalCount})
            </div>
          </div>
        </div>
        <div className="aiphoto-editor-sidebar-photos-cover">
          <div className="collection-cover-wrapper">
            <div className="collection-cover" style={imgStyle}>
              {/* <XImg src={this.backUpImg || codeImage} alt={t(tCode)} /> */}
            </div>
            <div className="collection-cover-name">
              <span className="ellipsis">{tName}</span>
              <XIcon
                type="rename"
                onClick={() => {
                  window.logEvent.addPageEvent({
                    name: 'AiPhotosCollection_Click_ModifyPreset'
                  });
                  handleRenameCover(this, tName, tCode, categoryCode);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SideBar);
