import React from 'react';
import { XImg } from '@common/components';

const onMouseEnter = (that, id) => {
  that.setState({ hoverItem: id });
}

const onMouseLeave = (that, id) => {
  if (that.state.hoverItem === id) {
    that.setState({ hoverItem: '' });
  }
}

const onClickCategory = (that, item) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsAddMusic_MyUploads'
  });

  const { boundProjectActions, musicTags } = that.props;
  const id = item.get('id');
  const coverImgName = item.get('cover_img');
  const isUploadCategory = coverImgName === 'my-uploads';
  const isTSMCategory = coverImgName === 'Triple-scoop-music';

  // 只有是在upload类目中才需要显示上传的按钮.
  that.setState({
    currentCategoryId: id,
    isShowList: true,
    isShowLoading: true,
    isShowUploadBtn: isUploadCategory,
    isShowMusicTagList: isTSMCategory
  }, () => {
    boundProjectActions.getFavoriteList({ category: id });
    boundProjectActions.getMusicList({ category: id }).then(() => {
      that.setState({
        isShowLoading: false
      })
    });
    if(!musicTags.size) {
      boundProjectActions.getMusicTagList();
    }
  });
};

/**
 * 渲染类目卡片.
 */
const renderCategoryItem = (that, data) => {
  const { hoverItem } = that.state;
  const { item } = data;
  const id = item.get('id');
  const isHover = hoverItem === id;

  let coverImgName = item.get('cover_img');
  if (isHover) {
    coverImgName = `${coverImgName}-hover`;
  }

  const src = __isCN__ ? require(`../images/${coverImgName}-cn.jpg`) : require(`../images/${coverImgName}.jpg`);

  const xImgProps = {
    src,
    imgRot: 0,
    type: 'tag',
    onClick: () => onClickCategory(that, item),
    onMouseEnter: () => onMouseEnter(that, id),
    onMouseLeave: () => onMouseLeave(that, id)
  };

  return <XImg {...xImgProps} />
};

const formatCategories = items => {
  return items;
};

export default {
  renderCategoryItem,
  formatCategories
};