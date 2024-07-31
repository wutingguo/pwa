import React, { useCallback, useRef, useEffect, useState } from 'react';
import Popover from '@resource/components/Popover';
import './index.scss';
import XIcon from '@resource/components/icons/XIcon';

const ImageTag = props => {
  const {
    image_uid,
    boundProjectActions,
    boundGlobalActions,
    rectPosition,
    activeWhite = true,
    tagEl,
    iconStyle = { marginLeft: '12px' },
    favorite,
    data,
    isLableActive,
    set_uid
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
              iconWidth={20}
              iconHeight={20}
              title={'添加标签'}
            />
          ) : (
            <XIcon
              type={iconType}
              className="blank-icon-wrap"
              iconWidth={20}
              iconHeight={20}
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
                    iconWidth={20}
                    iconHeight={20}
                    onClick={() => handleLableSave(item.id, true)}
                  />
                ) : (
                  <XIcon
                    type={`delete-custom`}
                    iconWidth={20}
                    iconHeight={20}
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
