import React, { Fragment, useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazy-load';

import getTargetPositionImg, { getRelativePositionImg } from '@common/utils/targetPositionFromImg';

import { XImg, XInput } from '@common/components';

const ItemSection = props => {
  const [itemHeight, setItemHeight] = useState(182);
  const [headImg, setHeadImg] = useState('');
  const { className, data, curGroupId, changeGroupId, updateAvatarName, index, pushHeadImg } =
    props;
  const {
    imageUrl,
    imageId,
    groupId,
    count,
    headPosition,
    cutHead,
    name,
    enc_image_id,
    group_type,
  } = data;
  const itemRef = useRef(null);
  const [inputStatus, setInputStatus] = useState(false);
  const [defaultAvatarName, setDefaultAvatarName] = useState('');
  const [avatarName, setAvatarName] = useState('');
  useEffect(() => {
    setDefaultAvatarName(name || `人物${index + 1}`);
    setAvatarName(name || `人物${index + 1}`);
  }, [index]);
  useEffect(() => {
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, [itemRef.current]);

  useEffect(() => {
    calculateHead();
  }, []);

  const calculateHead = async () => {
    if (cutHead) {
      const getHeadImg =
        cutHead.position === 'relative' ? getRelativePositionImg : getTargetPositionImg;
      const head = await getHeadImg({
        ...cutHead,
        areaW: itemHeight * 0.8,
        areaH: itemHeight,
      });
      setHeadImg(head);
      pushHeadImg(`${enc_image_id}_${cutHead.position}_${cutHead.x}_${cutHead.y}`, head);
    } else {
      setHeadImg(imageUrl);
    }
  };

  const setHeight = () => {
    if (itemRef.current) {
      const width = itemRef.current.clientWidth;
      setItemHeight(width / 0.8);
    }
  };

  const renderMask = () => {
    if (groupId === '0') {
      return (
        <div className="mask">
          合照(含未识别图片) <br /> （{count}）
        </div>
      );
    }
    if (groupId === 'fresh') {
      return (
        <div className="mask">
          新增图片 <br /> （{count}）
        </div>
      );
    }
    return null;
  };
  const onEditName = e => {
    e.stopPropagation();
    setInputStatus(true);
  };
  useEffect(() => {
    // 聚焦
    inputStatus && itemRef.current.getElementsByTagName('input')[0].focus();
  }, [inputStatus]);
  const onInputChange = e => {
    setAvatarName(e.target.value);
  };
  const onInputBlur = () => {
    setInputStatus(false);
    // 发送修改名字请求
    if (!avatarName) {
      setAvatarName(defaultAvatarName);
      return;
    }
    if (defaultAvatarName === avatarName) return;
    updateAvatarName(
      {
        group_id: groupId,
        group_name: avatarName,
        enc_image_id: enc_image_id,
        group_type: group_type,
      },
      () => setDefaultAvatarName(avatarName)
    );
  };

  return (
    <div
      className={`item_section_from_group ${className} ${groupId === curGroupId ? 'cur' : ''}`}
      style={{ height: itemHeight }}
      ref={itemRef}
      onClick={() => {
        let tempAvatarName = avatarName;
        if (groupId === '0') {
          tempAvatarName = '合照';
        } else if (groupId === 'fresh') {
          tempAvatarName = '新增图片';
        }
        changeGroupId(groupId, tempAvatarName);
      }}
    >
      <LazyLoad className="lazyload-wrap">
        <Fragment>
          {renderMask()}
          {/* <XImg
            src={(groupId === '0' || group_type === 1) ? `${headImg}&${new Date().getTime()}` : headImg}
            propsStyle={headPosition ? { backgroundPosition: `${headPosition}` } : {}}
          /> */}
          <div className="imgBox">
            <img src={headImg} />
          </div>
        </Fragment>
      </LazyLoad>
      {groupId !== '0' &&
        groupId !== 'fresh' &&
        (inputStatus ? (
          <XInput
            autofocus={true}
            className="avatarNameInput"
            value={avatarName}
            onChange={onInputChange}
            onBlur={onInputBlur}
          />
        ) : (
          <div className="avatarName" onClick={onEditName}>
            {avatarName}
          </div>
        ))}
    </div>
  );
};

export default ItemSection;
