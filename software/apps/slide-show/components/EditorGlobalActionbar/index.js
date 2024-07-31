import React, { Fragment } from 'react';
import Tooltip from 'rc-tooltip';
import { XPureComponent, XIcon, XFileUpload } from '@common/components';
import CollectionDetailHeader from '../CollectionDetailHeader';
import TransitionChangeButton from '../TransitionChangeButton';
import PostCardChangeButton from '../PostCardChangeButton';
import { secondToMinute } from '@resource/lib/utils/timeFormat';

import AddPhoto from './handle/AddPhoto';

import main from './handle/main';
import './index.scss';
import errorIcon from './icon/error.png';
import { timePerImageMin } from '../../constants/strings';

class EditorGlobalActionbar extends XPureComponent {
  uploadFileClicked = () => {
    window.logEvent.addPageEvent({
      name: 'SlideShowPhotos_Click_AddPhotos'
    });
  };
  onAddImages = files => main.onAddImages(this, files);
  uploadFromComputer = () => main.uploadFromComputer(this);
  uploadFromGallery = () => main.uploadFromGallery(this);
  uploadFromProject = () => main.uploadFromProject(this);
  addMusic = () => main.addMusic(this);
  handleContinue = () => main.handleContinue(this);
  handleShare = () => main.handleShare(this);
  onView = () => main.onView(this);

  renderTitle = () => {
    const { currentSegment, isShowEmptyContent } = this.props;
    const frames = currentSegment.get('segmentImages');
    const musicEncId = currentSegment.get('musicEncId');
    const artist_name = currentSegment.get('artist_name');
    const music_title = currentSegment.get('music_title');
    const frameCount = frames ? frames.size : 0;
    const audioCount = musicEncId ? 1 : 0;
    let musicDuration = currentSegment.get('duration');
    const timePerImage = currentSegment.get('timePerImage');
    const region_start = currentSegment.get('region_start') || 0;
    const region_end = currentSegment.get('region_end');
    if (region_end) {
      musicDuration = region_end - region_start;
    }

    const musicTitle = music_title
      ? `${music_title}${artist_name ? ` (${artist_name})` : ''}`
      : t('UNKNOWN');

    return (
      <>
        <XIcon type="photo" text={t('IMAGES_COUNT', { count: frameCount })} />
        {musicEncId && <XIcon type="music" text={musicTitle} />}
        {!!musicDuration && !!timePerImage && (
          <>
            <span className="time-info bold">
              {secondToMinute(musicDuration, t('TIME_MINUTES'), t('TIME_SECONDS'))}
            </span>
            {!isShowEmptyContent && (
              <span className="time-info">{t('TIME_PER_SLIDE', { timePerImage })}</span>
            )}
            {!isShowEmptyContent && timePerImage < 0.5 && (
              <span className="time-info-error" title={t('MAKE_SURE_LEGTH_SLIDE_LEAST_05')}>
                <img src={errorIcon} />
              </span>
            )}
          </>
        )}
      </>
    );
  };
  render() {
    const {
      urls,
      history,
      params,
      projectId,
      uploadParams,
      postCardList,
      visiting_card,
      currentSegment,
      transitionModes,
      collectionPreviewUrl,
      boundGlobalActions,
      boundProjectActions
    } = this.props;
    const { id } = params;
    const computerFileUploadProps = {
      multiple: 'multiple',
      inputId: 'multiple',
      text: t('ADD_PHOTOS'),
      uploadParams,
      className: 'add-photo-item',
      uploadFileClicked: this.uploadFileClicked,
      addImages: this.onAddImages,
      showModal: boundGlobalActions.showModal
    };
    const addPhotoProps = {
      computerFileUploadProps,
      uploadFromComputer: this.uploadFromComputer,
      uploadFromGallery: this.uploadFromGallery,
      uploadFromProject: this.uploadFromProject
    };

    const musicUploadProps = {
      type: 'add',
      text: t('ADD_MUSIC'),
      theme: 'black',
      onClick: this.addMusic
    };
    const isSegmentDataReady =
      !!currentSegment.get('musicEncId') &&
      currentSegment.get('segmentImages') &&
      !!currentSegment.get('segmentImages').size &&
      currentSegment.get('timePerImage') >= timePerImageMin;
    const transitionChangeButtonProps = {
      collectionId: id,
      transitionModes,
      boundProjectActions,
      transition_mode: currentSegment.getIn(['setting', 'transition_mode']),
      transition_duration: currentSegment.getIn(['setting', 'transition_duration'])
    };
    const postCardChangeButtonProps = {
      urls,
      history,
      projectId,
      visiting_card,
      postCardList,
      boundProjectActions,
      boundGlobalActions
    };
    const actionBtn = [
      <AddPhoto {...addPhotoProps} />,
      <XIcon {...musicUploadProps} />,
      <TransitionChangeButton {...transitionChangeButtonProps} />
    ];
    // if (__isCN__) {
    //   actionBtn.unshift(<PostCardChangeButton {...postCardChangeButtonProps} />);
    // }

    const headerProps = {
      className: 'slideshow-editor-global-action-bar',
      history,
      collectionPreviewUrl,
      collectionId: id,
      title: this.renderTitle(),

      handleContinue: this.handleContinue,
      handleShare: this.handleShare,
      onView: this.onView,
      showShare: false,
      isSegmentDataReady,
      actionBtn
    };
    return <CollectionDetailHeader {...headerProps} />;
  }
}

export default EditorGlobalActionbar;
