import React, { useCallback, useRef, useEffect, useState } from 'react';
import Popover from '@resource/components/Popover';
import './index.scss';
import XIcon from '@resource/components/icons/XIcon';
import * as cache from '@resource/lib/utils/cache';
import {
  getEmailCacheKey,
  getPhoneCacheKey,
  getGuestUidCacheKey
} from '@apps/gallery-client-mobile/utils/helper';
import { BIND_EMAIL_MODAL } from '@apps/gallery-client-mobile/constants/modalTypes';

const ImageTag = props => {
  const {
    image_uid,
    boundProjectActions,
    boundGlobalActions,
    rectPosition,
    activeWhite = true,
    tagEl,
    iconStyle = { marginLeft: '12px', marginTop: '-20px' },
    favorite,
    data,
    isLableActive,
    set_uid,
    qs
  } = props;
  const [popVisible, setPopVisible] = useState(false);
  const [label_list, setLabellist] = useState([]);
  const mergeDataFn = () => {
    boundProjectActions.getTagAmount(set_uid).then(amount_res => {
      boundProjectActions.getImgTagInfo(image_uid).then(img_tag => {
        const list = amount_res.data
          .map(contItem => {
            if (!img_tag.data.length) return Object.assign(contItem, { mark: true });
            const { mark } = img_tag.data.find(tagItem => contItem.id === tagItem.label_id) || {};
            let data = Object.assign(contItem, { mark: !mark ?? true });
            return data;
          })
          .filter(i => i.label_enable !== false);
        setLabellist(list);
      });
    });
  };

  const handleClick = useCallback(() => {
    const fav = favorite || data.get('favorite');
    const submitStatus = !!fav.get('submit_status');
    const collection_uid = qs.get('collection_uid');

    const cacheEmailKey = getEmailCacheKey(collection_uid);
    const cachePhoneKey = getPhoneCacheKey(collection_uid);
    const email = cache.get(cacheEmailKey);
    const phone = cache.get(cachePhoneKey);
    const isLogin = __isCN__ ? email || phone : email;
    if (!isLogin) {
      showModal(BIND_EMAIL_MODAL, {
        close: () => {
          isMarkOrUnmarking = false;
          hideModal(BIND_EMAIL_MODAL);
        },
        onOk: (params, inputValue) => {
          boundProjectActions.guestSignUp(params).then(
            result => {
              const { guest_uid } = result.data;

              // 获取一下favorite.
              boundProjectActions
                .getFavoriteImageList(guest_uid)
                .then(() => {
                  const cacheGuestUidKey = getGuestUidCacheKey(collection_uid);
                  cache.set(
                    [emailReg.test(inputValue) ? cacheEmailKey : cachePhoneKey],
                    inputValue
                  );
                  cache.set(cacheGuestUidKey, guest_uid);
                  if (cb && typeof cb === 'function') {
                    cb(guest_uid);
                  }
                  hideModal(BIND_EMAIL_MODAL);
                })
                .catch(err => {
                  hideModal(BIND_EMAIL_MODAL);
                  isMarkOrUnmarking = false;
                });
            },
            err => {
              isMarkOrUnmarking = false;
              hideModal(BIND_EMAIL_MODAL);

              boundGlobalActions.addNotification({
                message: t('GUEST_SIGN_UP_FAILED'),
                level: 'error',
                autoDismiss: 2
              });
            }
          );
        }
      });
      return;
    }

    if (submitStatus) {
      boundGlobalActions.addNotification({
        message: t('BAN_COLLECT', '您已提交过选片，如需更改，请联系摄影师或工作室~'),
        level: 'error',
        autoDismiss: 2
      });
      return;
    }
    setPopVisible(!popVisible);
    if (!popVisible) {
      mergeDataFn();
    }
  }, [popVisible, image_uid, favorite]);
  const handleLableSave = (label_id, mark) => {
    boundProjectActions.saveLableInfo(label_id, image_uid, mark).then(res => {
      if (res.ret_code === 200000) {
        mergeDataFn();
        boundProjectActions.getLableImgList(label_id);
        boundProjectActions.getFavoriteImageList();
      }
    });
  };

  const handlePopVisible = useCallback(v => {
    setPopVisible(!!v);
  }, []);
  const iconType = activeWhite ? 'custom' : 'custom-blank';
  const iconSelectType = activeWhite ? 'custom-select' : 'custom-blank-select';
  return (
    <Popover
      className={'image-tag-popover'}
      theme="white"
      placement={'bottom'}
      offsetTop={5}
      rectToEdge={rectPosition ?? 160}
      onVisibleChange={handlePopVisible}
      visible={popVisible}
      innerStyle={{ zIndex: 2000000002 }}
      triggerOnOutSide={({ visible }) => {
        handlePopVisible(false);
      }}
      container={tagEl}
      Target={
        <span style={iconStyle} onClick={handleClick}>
          {isLableActive ? (
            <XIcon
              type={iconSelectType}
              className="select-icon-wrap"
              // iconWidth={20}
              // iconHeight={20}
              title={'添加标签'}
            />
          ) : (
            <XIcon
              type={iconType}
              className="blank-icon-wrap"
              // iconWidth={20}
              // iconHeight={20}
              title={'添加标签'}
            />
          )}
        </span>
      }
    >
      <div className="image-tag-container">
        <div className="image-tag-header">
          <span className="image-tag-close" onClick={handleClick}>
            X
          </span>
          <span className="image-tag-title">图片标签</span>
        </div>
        {label_list.map(item => {
          return (
            <div className="image-tag-lable-item" key={item.id}>
              <div className="image-lable-name">{item.label_name}</div>
              <div className="image-label-enable">{`( ${item.label_count} )`}</div>
              <div className="image-lable-count">
                {item.mark ? (
                  <XIcon
                    type={`add-custom`}
                    iconWidth={36}
                    iconHeight={36}
                    onClick={() => handleLableSave(item.id, true)}
                  />
                ) : (
                  <XIcon
                    type={`delete-custom`}
                    iconWidth={36}
                    iconHeight={36}
                    onClick={() => handleLableSave(item.id, false)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Popover>
  );
};
export default ImageTag;
