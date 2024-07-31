import { debounce } from 'lodash';
import React, { memo, useEffect, useRef, useState } from 'react';
import LazyLoad from 'react-lazy-load';

import XButton from '@resource/components/XButton';

import backPng from '@resource/static/icons/handleIcon/back_1.png';

import { XImg } from '@common/components';

import ItemSection from './ItemSection';
import addPerson from './img/addPerson.png';

import './index.scss';

const RelateToPersonDrawer = props => {
  const {
    showDrawer,
    drawerList,
    activityType = 'bind', // bind：绑定人物关系，不传则为选择人物查看
    onOk,
    cacheHead,
  } = props;
  const { show, sourceGroupId, selectedImgId, selectedImgUrl } = showDrawer;
  const [headHeight, setHeadHeight] = useState(100);
  const [headList, setHeadList] = useState([]);
  const [selectedHeadList, setSelectedHeadList] = useState([]);
  const headRef = useRef(null);
  const isBindType = activityType === 'bind';
  useEffect(() => {
    let tempList = [];
    if (headList.length > 0 && selectedImgId) {
      headList.forEach(item => {
        const tag = item.imageList && item.imageList.find(item => item.image_id === selectedImgId);
        tag && tempList.push(item);
      });
    }
    setSelectedHeadList([...tempList, ...selectedHeadList]);
  }, [headList, selectedImgId]);
  useEffect(() => {
    setHeadList([{ groupId: 'new' }, ...drawerList]);
  }, [JSON.stringify(drawerList)]);

  useEffect(() => {
    if (!show) {
      setSelectedHeadList([]);
    }
    window.addEventListener('resize', setHeight);
    setHeight();
    return () => {
      window.removeEventListener('resize', setHeight);
    };
  }, [headRef.current, show]);

  const closeDrawer = () => {
    setSelectedHeadList([]);
    props.closeDrawer();
  };

  const selectedHead = (selected, isFind) => {
    let list = [];
    if (isFind) {
      list = selectedHeadList.filter(item => item.groupId !== selected.groupId);
    } else {
      list = selectedHeadList.concat(selected);
    }
    setSelectedHeadList(list);
  };

  const setHeight = debounce(() => {
    if (headRef.current) {
      const width = headRef.current.clientWidth;
      setHeadHeight(width + 4);
    }
  }, 500);
  return (
    <div
      className={`relate_to_person_drawer ${show ? 'show_drawer' : ''} ${
        !isBindType ? 'just_show' : ''
      }`}
    >
      <div className="commonHeader">
        <div className="back" onClick={closeDrawer}>
          <img src={backPng} />
          <span>返回</span>
        </div>
      </div>
      <div className="drawer_content">
        <div className="header">
          {isBindType ? (
            <div className="title_wrapper bind_type">
              <div className="title">关联新人物</div>
              <div className="desc">选中人像，增加该图片的人物关系</div>
            </div>
          ) : (
            <div className="title_wrapper">按人像搜索</div>
          )}
        </div>
        <div className={`person_list ${isBindType ? 'bind_type' : ''}`}>
          {headList.map(item => {
            const { groupId, imageId, imageList } = item;
            // const isExistedImg = imageList.find(item => item.image_id === selectedImgId);
            const isFind = selectedHeadList.find(item => item.groupId === groupId);
            return (
              <div
                key={`${groupId}_head`}
                className={`
                  head_person_wrapper
                  ${isFind ? 'selected' : ''}
                  ${groupId === 'new' ? 'addNewPerson' : ''}
                `}
                ref={headRef}
                style={{ height: headHeight }}
                onClick={() => selectedHead(item, isFind)}
              >
                {groupId === 'new' ? (
                  <>
                    <img src={addPerson} alt="addIcon" />
                    <div>新人物</div>
                  </>
                ) : (
                  <ItemSection {...item} width={headHeight} cacheHead={cacheHead} />
                )}
              </div>
            );
          })}
        </div>
        <div className="buttons">
          <div>已选：{selectedHeadList.length}</div>
          <div className="clear_selected" onClick={() => setSelectedHeadList([])}>
            清空选中
          </div>
          <XButton onClick={() => onOk(selectedHeadList)}>确定</XButton>
        </div>
      </div>
      <div className="blank">
        <LazyLoad once className="lazyload-wrap">
          {/* <XImg src={selectedImgUrl} /> */}
          <img src={selectedImgUrl} alt="" />
        </LazyLoad>
      </div>
    </div>
  );
};

export default memo(RelateToPersonDrawer);
