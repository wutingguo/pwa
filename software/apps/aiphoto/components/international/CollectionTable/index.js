import { isEqual } from 'lodash';
import React, { Component } from 'react';

import XLink from '@resource/components/XLink';

import { getImageUrl } from '@resource/lib/saas/image';

import { getOrientationAppliedImage } from '@resource/lib/utils/exif';

import { thumbnailSizeTypes } from '@resource/lib/constants/strings';

import deletePNG from '@resource/static/icons/delete.png';
import downloadPNG from '@resource/static/icons/download.png';
import editImgPNG from '@resource/static/icons/editImg.png';
import editorPNG from '@resource/static/icons/editor.png';
import stopPNG from '@resource/static/icons/stop.png';

import { XImg } from '@common/components';

import { formatTime } from '@apps/workspace/utils/date';

import { formatDate } from '@gallery/utils/helper';

import defaultImg from './img/default.png';

import './index.scss';
import './table-grid.scss';

const statusText = [t('TO_BE_RETOUCHED'), t('BEING_RETOUCHED'), t('RETOUCHED'), t('PAUSED')];

class CollectionTable extends Component {
  constructor(props) {
    super(props);

    this.getRenderHTML = this.getRenderHTML.bind(this);
    this.tableBtn = this.tableBtn.bind(this);
    this.state = {
      collectionList: [],
    };
  }

  async componentDidMount() {
    // const { collectionList } = this.props;
    this.setState({
      // collectionList: collectionList.toJS()
      collectionList: await this.formatImg(),
    });
  }

  async componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.collectionList, this.props.collectionList)) {
      this.setState({
        collectionList: await this.formatImg(),
      });
    }
  }

  formatImg = async () => {
    const { collectionList } = this.props;
    const simpleCollectionList = collectionList.toJS();
    return Promise.all(
      simpleCollectionList.map(async item => {
        const { orientation, enc_image_uid } = item.correct_image_collection;
        const renderImg = await this.getRenderImg(enc_image_uid, orientation);
        return {
          ...item,
          correct_image_collection: {
            ...item.correct_image_collection,
            coverImg: renderImg,
          },
        };
      })
    );
  };

  tableBtn(status, id, collection_name) {
    const { handleDelete, downCollectionImage, handleClick } = this.props;
    const clickBtn = (
      <XLink onClick={() => handleClick(id)}>
        <img src={editorPNG} />
        {t('EDIT')}
      </XLink>
    );
    const deleteBtn = (
      <XLink
        onClick={() => {
          window.logEvent.addPageEvent({
            name: 'AiPhotos_Click_Delete',
          });
          handleDelete(id, collection_name);
        }}
      >
        <img src={deletePNG} />
        {t('DELETE')}
      </XLink>
    );
    const downBtn = (
      <XLink
        onClick={() => {
          this.timer = setTimeout(() => {
            window.logEvent.addPageEvent({
              name: 'AiPhotos_Click_Download',
            });
            clearTimeout(this.timer);
          }, 1000);
          downCollectionImage(id, collection_name);
        }}
      >
        <img src={downloadPNG} />
        {t('DOWNLOAD')}
      </XLink>
    );

    //修图完成
    if (status === 2) {
      return [clickBtn, downBtn, deleteBtn];
    }
    return [clickBtn, deleteBtn];
  }

  getRenderImg = async (enc_image_uid, orientation) => {
    const { galleryBaseUrl } = this.props;
    if (enc_image_uid) {
      const imgUrl = getImageUrl({
        galleryBaseUrl,
        image_uid: enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
        isWaterMark: false,
      });
      if (orientation) {
        return await getOrientationAppliedImage(imgUrl, orientation);
      }
      return imgUrl;
    }
    return defaultImg;
  };

  renderStatus = (collection_status, failed_image_count, id, total_image_count) => {
    if (collection_status === 0) {
      const { startCollectionImage } = this.props;
      const opt = {
        collection_id: id,
        imageCount: total_image_count,
      };
      return (
        <div className="col status-text">
          <XLink
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'AiPhotos_Click_RetouchPhotos',
              });
              startCollectionImage(opt);
            }}
          >
            <img src={editImgPNG} />
            {t('RETOUCH')}
          </XLink>
        </div>
      );
    }
    return (
      <div className="col status-text">
        {statusText[collection_status] || ''}
        {failed_image_count > 0 && <span>Error</span>}
      </div>
    );
  };

  getRenderHTML() {
    const { handleClick } = this.props;
    const { collectionList } = this.state;
    const html = [];

    if (collectionList && collectionList.length) {
      collectionList.forEach((item, index) => {
        const {
          id,
          collection_name,
          create_time,
          update_time,
          collection_status,
          total_image_count = 0,
          corrected_image_count = 0,
          failed_image_count,
          enc_image_uid,
          coverImg,
        } = item.correct_image_collection;
        const correct_collection_topic = item.correct_collection_topic || {};
        const { topic_code } = correct_collection_topic;
        // const renderImg = this.getRenderImg(enc_image_uid);
        html.push(
          <div className="grid item" key={index}>
            <div className="col detail" title={collection_name} onClick={() => handleClick(id)}>
              <span className="img">
                <XImg src={coverImg} alt={t(topic_code)} />
              </span>
              <span className="title">{collection_name}</span>
            </div>
            <div className="col">{formatDate(create_time)}</div>
            <div className="col">{formatDate(update_time)}</div>
            <div className="col">{`${corrected_image_count}/${total_image_count}`}</div>
            {this.renderStatus(collection_status, failed_image_count, id, total_image_count)}
            <div className="col edit">{this.tableBtn(collection_status, id, collection_name)}</div>
          </div>
        );
      });
    }

    return html;
  }

  render() {
    return (
      <div className="collection-table">
        <div className="grid head">
          <div className="col">{t('COLLECTIONS')}</div>
          <div className="col">{t('CREATE_DATE')}</div>
          <div className="col">{t('LAST_EDIT')}</div>
          <div className="col">{t('RETOUCHING_PROCESS')}</div>
          <div className="col">{t('RETOUCHING_STATUS')}</div>
          <div className="col">{t('ACTION')}</div>
        </div>
        {this.getRenderHTML()}
      </div>
    );
  }
}

export default CollectionTable;
