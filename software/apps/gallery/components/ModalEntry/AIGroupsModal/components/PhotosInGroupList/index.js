import classNames from 'classnames';
import { get, template } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import streamSaver from 'streamsaver';
import 'streamsaver/examples/zip-stream';

import XButton from '@resource/components/XButton';

import { SAAS_DOWNLOAD_IMAGE } from '@resource/lib/constants/apiUrl';

import emptyPng from '@resource/static/icons/empty.png';

import { XIcon, XInput } from '@common/components';

import { EndPrefix, EnterType } from '../../constant';

import ItemSection from './ItemSection';

import './index.scss';

const PhotosInGroupList = props => {
  const [photosList, setPhotosList] = useState([]);
  const [filterValue, setFilterValue] = useState(0);
  const {
    bindRelation,
    showDrawer,
    curGroup = {},
    templateImg,
    collectionName,
    unBindRelation,
    group,
    onSmartSharding,
    boundGlobalActions,
    urls,
    updateAvatar,
    boundProjectActions,
    enc_collection_id,
    enterType,
  } = props;
  const { count } = group.find(item => item.groupId === 'fresh') || {};

  const { groupId, imageList, curAvatarName } = curGroup;

  const { selectedImgId } = showDrawer;

  useEffect(() => {
    if (groupId) {
      setPhotosList(imageList);
    }
  }, [groupId, JSON.stringify(imageList)]);
  useEffect(() => {
    setFilterValue(0);
  }, [curGroup]);
  const startGroup = () => {
    if (!count) {
      boundGlobalActions.showConfirm({
        close: boundGlobalActions.hideConfirm,
        message: '暂无新照片上传，分片结果无更新',
        buttons: [
          {
            text: '确认',
            onClick: boundGlobalActions.hideConfirm,
          },
        ],
      });
      return;
    }
    onSmartSharding(true);
  };
  const shareAiGroup = () => {
    boundProjectActions.getEmailShareDirectLink(enc_collection_id).then(res => {
      const { share_link_url } = res.data;
      const shareCopy = () => {
        const obj = document.querySelector('#inputLink');
        obj.select();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${share_link_url}${EndPrefix}`);
        } else {
          document.execCommand('copy');
        }
      };
      boundGlobalActions.showConfirm({
        close: boundGlobalActions.hideConfirm,
        message: (
          <div className="shareAiGroupModal">
            <div className="title">分享</div>
            <div className="msg">
              分享功能会生成一个链接，您的客户可以通过访问链接，协助确认分片结果。链接已生成，快分享给客户吧～
            </div>
            <div className="inputLinkBox">
              <span className="linkIcon">
                <XIcon type="link" iconWidth={16} iconHeight={16} />
              </span>
              <XInput
                className="inputLink"
                id="inputLink"
                value={`${share_link_url}${EndPrefix}`}
              />
              <XButton width={111} onClick={shareCopy}>
                复制
              </XButton>
            </div>
          </div>
        ),
        buttons: [
          {
            text: '关闭',
            onClick: boundGlobalActions.hideConfirm,
          },
        ],
      });
    });
  };
  const renderList = () => {
    if (!photosList.length) {
      return (
        <div className="empty">
          <img src={emptyPng} />
          <span>暂无该人物照片</span>
        </div>
      );
    }
    return photosList.map(item => (
      <ItemSection
        showDrawer={showDrawer}
        key={item.enc_image_id}
        data={item}
        curGroup={curGroup}
        templateImg={templateImg}
        className={`${selectedImgId === item.image_id ? 'target' : ''}`}
        bindRelation={bindRelation}
        unBindRelation={unBindRelation}
        updateAvatar={updateAvatar}
      />
    ));
  };
  const onHandleDownload = useCallback(
    async group => {
      // 这里是为了分批下载设置的除数
      const batchSize = 3;
      const batchCount = Math.ceil(group.length / batchSize);
      for (let i = 0; i < batchCount; i++) {
        const startIndex = i * batchSize;
        const endIndex = Math.min(startIndex + batchSize, group.length);
        const batchDownloadPromises = [];

        for (let j = startIndex; j < endIndex; j++) {
          const item = group[j];
          let downloadData = [];
          if (!item.imageList.length) {
            continue;
          }
          item.imageList?.forEach(imgItem => {
            const set_uid = imgItem.set_uid;
            const image_uid = imgItem.enc_image_id;
            const imgName = imgItem.image_name + imgItem.suffix;
            const url = template(SAAS_DOWNLOAD_IMAGE)({
              set_uid,
              image_uid,
              galleryBaseUrl: urls.get('galleryBaseUrl'),
            });
            downloadData.push({
              fileUrl: url,
              fileName: imgName,
            });
          });
          const exportFileName = item.name ? `${item.name}.zip` : `人物_${j + 1}.zip`;
          const fileStream = streamSaver.createWriteStream(exportFileName);
          const fileIterator = downloadData.values();
          const readableZipStream = new window.ZIP({
            async pull(ctrl) {
              const fileInfo = fileIterator.next();
              if (fileInfo.done) {
                ctrl.close();
              } else {
                const { fileName, fileUrl } = fileInfo.value;
                return fetch(fileUrl).then(res => {
                  ctrl.enqueue({
                    name: fileName + '',
                    stream: () => res.body,
                  });
                });
              }
            },
          });

          if (window.WritableStream && readableZipStream.pipeTo) {
            const downloadPromise = readableZipStream.pipeTo(fileStream);
            batchDownloadPromises.push(downloadPromise);
          }
        }

        // 等待当前批次的下载任务全部完成
        await Promise.all(batchDownloadPromises);
      }
    },
    [group]
  );

  const handleExport = () => {
    boundGlobalActions.showModal('EXPORT_AIGROUP_PHOTO_MODAL', {
      exportPhoto: (checkedType, groupCollection) => {
        if (checkedType === 1) {
          onHandleDownload(groupCollection.filter(v => v.is_choose));
        } else if (checkedType === 2) {
          const newGroupCollection = groupCollection.map(item => {
            return {
              ...item,
              imageList: item.imageList?.filter(v => v.face_count === 1) || [],
            };
          });
          onHandleDownload(newGroupCollection.filter(v => v.is_choose));
        } else if (checkedType === 3) {
          const newGroupCollection = groupCollection.map(item => {
            return {
              ...item,
              imageList: item.imageList?.filter(v => v.face_count > 1) || [],
            };
          });
          onHandleDownload(newGroupCollection.filter(v => v.is_choose));
        }
      },
      group: group.filter(i => i.groupId !== 'fresh'),
    });
  };
  const handleFilterPhoto = value => {
    if (value === filterValue) {
      setFilterValue(0);
      setPhotosList(imageList);
      return;
    }
    if (value === 1) {
      setFilterValue(value);
      setPhotosList(imageList.filter(item => item.face_count === value));
      return;
    }
    if (value === 2) {
      setFilterValue(value);
      setPhotosList(imageList.filter(item => item.face_count > 1));
      return;
    }
  };

  return (
    <div className="ai_photos_in_group_list">
      {EnterType[enterType] !== EnterType['galleryClient'] && (
        <div className="title_section">
          {/* <div className="name">{collectionName}</div> */}
          <div onClick={shareAiGroup} className="export-btn">
            分享
          </div>
          <div onClick={handleExport} className="export-btn">
            导出
          </div>
          <XButton onClick={startGroup}>
            智能分片
            {count > 0 ? <span className="fresh_count">{count > 99 ? '99+' : count}</span> : null}
          </XButton>
        </div>
      )}
      <div className="photo_list_header">
        <div>
          {curAvatarName}（{photosList.length}）
        </div>
        {groupId !== 'fresh' && (
          <div className="filter-container">
            <span
              className={classNames('filter-item', { 'active-item': filterValue === 1 })}
              onClick={() => handleFilterPhoto(1)}
            >
              <XIcon type={`only-man${filterValue === 1 ? '-active' : ''}`}>单人 </XIcon>
            </span>
            <span
              className={classNames('filter-item', { 'active-item': filterValue === 2 })}
              onClick={() => handleFilterPhoto(2)}
            >
              <XIcon type={`many${filterValue === 2 ? '-active' : ''}`}>多人 </XIcon>
            </span>
          </div>
        )}
      </div>
      <div className="photo_list">{renderList()}</div>
    </div>
  );
};

export default PhotosInGroupList;
