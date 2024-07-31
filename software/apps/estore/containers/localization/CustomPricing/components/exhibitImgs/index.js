import React, { useEffect, useRef, useState } from 'react';

import XFileUpload from '@resource/components/pwa/XFileUpload';

import addPng from '@resource/static/icons/btnIcon/add-gray.png';
import closePng from '@resource/static/icons/close.png';
import loadingIcon from '@resource/static/icons/loading2.gif';

import estoreService from '@apps/estore/constants/service';

import './index.scss';

const ExhibitImgs = props => {
  const [imgs, setimgs] = useState([]);
  const { boundGlobalActions, onChange, value, urls, deleteSpuImages } = props;
  const baseUrl = urls.get('estoreBaseUrl');
  const imgBaseUrl = urls.get('imgBaseUrl');
  const imgRef = useRef([]);
  const max = 6;

  useEffect(() => {
    let setImgsUrl = [...value];
    value.forEach(async item => {
      if (item.asset_uuid) {
        const imgUrl = await estoreService.getImageUrl({ baseUrl, asset_uuid: item.asset_uuid });
        const { storage_path } = imgUrl;
        setImgsUrl = setImgsUrl.map(subItem => {
          if (subItem.asset_uuid === item.asset_uuid) {
            return {
              ...subItem,
              imgUrl: `${imgBaseUrl}${storage_path}`,
            };
          }
          return subItem;
        });
        setimgs(setImgsUrl);
      }
    });
    setimgs(setImgsUrl);
  }, [JSON.stringify(value)]);

  const deleteImg = name => {
    const newImgs = imgs.filter(item => (item.asset_uuid || item.key_name) !== name);
    deleteSpuImages(name);
    setimgs(newImgs);
  };

  const fileUploadProps = {
    multiple: true,
    inputId: 'single',
    iconType: 'add-upload',
    className: 'imgItem',
    uploadParams: {
      limitUploadNums: max,
      delayAddImage: true, // 暂时先保存 图片id， 并且暂时前端渲染图片
      maxFileSize: 10,
      maxItemSize: 10,
      alreadyUploadNums: imgs.length,
    },
    uploadFilesByS3: true,
    getUploadedImgs: successInfo => {
      imgRef.current.push(successInfo);
      console.log('successInfo: ', successInfo);
      onChange({
        asset_uuid: '',
        key_name: successInfo.key_name,
        content_name: successInfo.fileName,
        section_path: '',
        imgUrl: successInfo.imgUrl,
      });
    },
    showModal: boundGlobalActions.showModal,
  };

  return (
    <div className="exhibitImgsWrapper">
      <div className="imgsContent">
        {imgs.map(item => {
          return (
            <div className="imgItem" key={item.key_name || item.asset_uuid}>
              <div className="bg" style={{ backgroundImage: `url(${item.imgUrl})` }} />
              <div className="close" onClick={() => deleteImg(item.key_name || item.asset_uuid)}>
                <img src={closePng} />
              </div>
            </div>
          );
        })}
        {imgs.length < 6 ? (
          <XFileUpload {...fileUploadProps}>
            <img className="icon" src={addPng} />
          </XFileUpload>
        ) : null}
      </div>
      <div className="tips">建议上传方图，最多支持6张图片。</div>
    </div>
  );
};

export default ExhibitImgs;
