import React, { Component } from 'react';
import { formatTime } from '@apps/workspace/utils/date';
import { XImg } from '@common/components';
import XLink from '@resource/components/XLink';
import { getImageUrl } from '@resource/lib/saas/image';
import { fromJS } from 'immutable';
import { thumbnailSizeTypes } from '@resource/lib/constants/strings';
import editorPNG from '@resource/static/icons/editor.png';
import deletePNG from '@resource/static/icons/delete.png';
import downloadPNG from '@resource/static/icons/download.png';
import editImgPNG from '@resource/static/icons/editImg.png';
import stopPNG from '@resource/static/icons/stop.png';
import { isEqual } from 'lodash';
import './table-grid.scss';
import './index.scss';
import defaultImg from './img/default.png';
import { clear } from '../../../../../resource/logevent/util/store';
const statusText = ['等待修图', '修图中', '修图完成', '终止修图'];

class CollectionTable extends Component {
  constructor(props) {
    super(props);

    this.getRenderHTML = this.getRenderHTML.bind(this);
    this.tableBtn = this.tableBtn.bind(this);
    this.state = {
      collectionList: []
    };
  }

  componentDidMount() {
    const { collectionList } = this.props;
    this.setState({
      collectionList: collectionList.toJS()
    });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.collectionList, this.props.collectionList)) {
      const { collectionList } = this.props;
      this.setState({
        collectionList: collectionList.toJS()
      });
    }
  }

  tableBtn(status, id, collection_name) {
    const { handleDelete, downCollectionImage, handleClick } = this.props;
    const clickBtn = (
      <XLink onClick={() => handleClick(id)}>
        <img src={editorPNG} />
        编辑
      </XLink>
    );
    const deleteBtn = (
      <XLink
        onClick={() => {
          window.logEvent.addPageEvent({
            name: 'AiPhotos_Click_Delete'
          });
          handleDelete(id, collection_name);
        }}
      >
        <img src={deletePNG} />
        删除
      </XLink>
    );
    const downBtn = (
      <XLink
        onClick={() => {
          this.timer = setTimeout(() => {
            window.logEvent.addPageEvent({
              name: 'AiPhotos_Click_Download'
            });
            clearTimeout(this.timer);
          }, 1000);
          downCollectionImage(id, collection_name);
        }}
      >
        <img src={downloadPNG} />
        下载
      </XLink>
    );

    //修图完成
    if (status === 2) {
      return [clickBtn, downBtn, deleteBtn];
    }
    return [clickBtn, deleteBtn];
  }

  getRenderImg = enc_image_uid => {
    const { galleryBaseUrl } = this.props;
    if (enc_image_uid) {
      return getImageUrl({
        galleryBaseUrl,
        image_uid: enc_image_uid,
        thumbnail_size: thumbnailSizeTypes.SIZE_350,
        isWaterMark: false
      });
    }
    return defaultImg;
  };

  renderStatus = (collection_status, failed_image_count, id, total_image_count, enc_image_uid) => {
    if (collection_status === 0) {
      const { startCollectionImage } = this.props;
      const opt = {
        collection_id: id,
        imageCount: total_image_count,
        enc_image_uid
      };
      return (
        <div className="col status-text">
          <XLink
            onClick={() => {
              window.logEvent.addPageEvent({
                name: 'AiPhotos_Click_RetouchPhotos'
              });
              startCollectionImage(opt);
            }}
          >
            <img src={editImgPNG} />
            修图
          </XLink>
        </div>
      );
    }
    return (
      <div className="col status-text">
        {statusText[collection_status] || ''}
        {failed_image_count > 0 && <span>异常失败</span>}
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
          enc_image_uid
        } = item.correct_image_collection;
        const correct_collection_topic = item.correct_collection_topic || {};
        const { topic_code } = correct_collection_topic;
        const renderImg = this.getRenderImg(enc_image_uid);
        html.push(
          <div className="grid item" key={index}>
            <div className="col detail" title={collection_name} onClick={() => handleClick(id)}>
              <span className="img">
                <XImg src={renderImg} alt={t(topic_code)} />
              </span>
              <span className="title">{collection_name}</span>
            </div>
            <div className="col">{formatTime(create_time, 'yyyy-mm-dd hh:ii:ss')}</div>
            <div className="col">{formatTime(update_time, 'yyyy-mm-dd hh:ii:ss')}</div>
            <div className="col">{`${corrected_image_count}/${total_image_count}`}</div>
            {this.renderStatus(
              collection_status,
              failed_image_count,
              id,
              total_image_count,
              enc_image_uid
            )}
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
          <div className="col">客户档案</div>
          <div className="col">创建时间</div>
          <div className="col">修改时间</div>
          <div className="col">修图进度</div>
          <div className="col">修图状态</div>
          <div className="col">操作</div>
        </div>
        {this.getRenderHTML()}
      </div>
    );
  }
}

export default CollectionTable;
