import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import LazyLoad from 'react-lazy-load';

import exchangePng from '@resource/static/icons/iconsCollection/exchange.png';
import stopPng from '@resource/static/icons/iconsCollection/stop.png';

import { XDropdown, XIcon, XImg } from '@common/components';

import switchAvatar from './img/switchAvatar.png';

import './index.scss';

const ItemSection = props => {
  const [itemHeight, setItemHeight] = useState('auto');
  const {
    data,
    bindRelation,
    showDrawer,
    className,
    templateImg,
    curGroup,
    unBindRelation,
    updateAvatar,
  } = props;
  const { groupId, enc_image_id: enc_image_uid } = curGroup;
  const { image_name, enc_image_id, orientation, image_id, face_count } = data;

  const itemRef = useRef(null);

  useEffect(() => {
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, [itemRef.current]);

  const setHeight = () => {
    if (itemRef.current) {
      const width = itemRef.current.clientWidth;
      setItemHeight(width);
    }
  };

  const imgUrl = useMemo(() => templateImg(enc_image_id, orientation), [enc_image_id]);
  const setUpdateAvatar = (data, curGroup) => {
    const { image_id } = data;
    const { name, groupId, group_type } = curGroup;
    updateAvatar({
      group_id: groupId,
      group_name: name,
      enc_image_id: image_id,
      group_type: group_type,
    });
  };
  const otherDropList =
    face_count === 1 && groupId !== '0' && enc_image_uid !== enc_image_id
      ? [
          {
            label: (
              <div className="drop_item">
                <img src={switchAvatar} />
                <span>设为头像</span>
              </div>
            ),
            id: 'switch_avatar',
            action: () => setUpdateAvatar(data, curGroup),
          },
        ]
      : [];
  const dropdownList = [
    // {
    //   label: (
    //     <div className="drop_item">
    //       <img src={stopPng} />
    //       <span>不是此人</span>
    //     </div>
    //   ),
    //   id: 'not_target_person',
    //   disabled: groupId === '0',
    //   action: () => unBindRelation(data, curGroup),
    // },
    {
      label: (
        <div className="drop_item">
          <img src={exchangePng} />
          <span>调整人物关系</span>
        </div>
      ),
      id: 'relate_to_person',
      action: () => bindRelation(data, curGroup),
    },
  ].concat(otherDropList);
  return (
    <div
      className={`item_section_from_photosInGroups`}
      style={{ height: itemHeight }}
      ref={itemRef}
      key={groupId + image_id}
    >
      <div
        className="img_wrapper"
        onClick={() => {
          window.open(imgUrl, '__blank');
        }}
      >
        <LazyLoad once className="lazyload-wrap" key={`sub-lazyload-item-${image_id}`}>
          <XImg src={`${imgUrl}`} usePropsImg={true} />
        </LazyLoad>
      </div>
      <div className="item_bar">
        <div className="name" title={image_name}>
          {image_name}
        </div>
        {groupId === 'fresh' ? null : (
          <div className="actions">
            <XDropdown
              arrow="right"
              renderLable={label => (
                <XIcon
                  type="more-label"
                  iconWidth={12}
                  iconHeight={12}
                  title={label}
                  text={label}
                />
              )}
              dropdownList={dropdownList}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemSection;
