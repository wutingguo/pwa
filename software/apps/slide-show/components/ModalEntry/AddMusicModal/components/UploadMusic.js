import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

import { supportedAudioTypes } from '@resource/lib/constants/strings';

import { XPureComponent, XFileUpload } from '@common/components';

class UploadMusic extends XPureComponent {
  render() {
    const { onUploadMusic } = this.props;

    const fileUploadProps = {
      className: 'upload-music-input',
      inputId: 'uploadMusicInput',
      multiple: '',
      addImages: onUploadMusic,

      // mp3: audio/mpeg
      accept: supportedAudioTypes.join(','),
      useNewUpload: true
    };

    return (
      <div className="upload-music-wrap">
        <label className="upload-wrap">
          <XFileUpload {...fileUploadProps} />

          <div className="add-icon">+</div>
          <div className="description">{t('DROP_MUSIC_HERE_TO_UPLOAD_01')}</div>
          <div className="description">{t('DROP_MUSIC_HERE_TO_UPLOAD_02')}</div>
          {
            !__isCN__ && <div className="description">{t('DROP_MUSIC_HERE_TO_UPLOAD_03')}</div>
          }
        </label>
      </div>
    );
  }
}

export default UploadMusic;
