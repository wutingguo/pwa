import React, { Fragment } from 'react';
import XComment from '@resource/components/XComment';
import XIcon from '@resource/components/icons/XIcon';
import XImg from '@resource/components/pwa/XImg';

const unmark = (that, item, index) => {
  window.logEvent.addPageEvent({
    name: 'GalleryFavoriteList_Click_Favorite'
  });

  const { data } = that.props;
  const unMarkFavorite = data.get('unmark');

  unMarkFavorite(item).then(() => {
    const { images } = that.state;
    const newImages = images.remove(index);
    that.setState({
      images: newImages
    });
  });
};

/**
 * 渲染瀑布流中的item
 * @param {*} that
 * @param {*} item
 */
const renderCard = (that, item, index) => {
  const { data } = that.props;
  const favorite = item.get('favorite');
  const comment = favorite.get('comment');
  const addComment = data.get('addComment');
  const showImageViewer = data.get('showImageViewer');
  const { favoriteSetting } = that.state;

  // 是否允许选片.
  const favorite_enabled = favoriteSetting && favoriteSetting.get('favorite_enabled');
  const favorite_comment_enabled = favoriteSetting.get('favorite_comment_enabled');

  const imgProps = {
    src: item.get('src'),
    imgRot: item.get('orientation') || item.get('imgRot')
  };

  return (
    <Fragment>
      <XImg {...imgProps} />
      <div>{item.get('title')}</div>

      <div className="icon-list">
        {favorite_enabled ? (
          <XIcon
            type="favorite"
            status="active"
            title={t('FAVORITE')}
            onClick={() => unmark(that, item, index)}
          />
        ) : null}

        {favorite_comment_enabled ? (
          <XComment text={comment} ok={text => addComment(item, text)} />
        ) : null}
      </div>
    </Fragment>
  );
};

export default { renderCard };
