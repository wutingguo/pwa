import React from 'react';
import EditorImageCard from '@apps/slide-show/components/EditorImageCard';

const renderCard = (that, data) => {
  const {
    urls,
    collectionDetail    
  } = that.props;
  const cardProps = {
    ...data,
    urls,
    
    resortFrames: that.resortFrames,
    isShowImgName: collectionDetail.getIn(['photos', 'isShowImgName']),
    handleClick: that.handleSelectImg
  };

  return <EditorImageCard {...cardProps} key={data.item.get('guid')} />;
};

export default { renderCard };