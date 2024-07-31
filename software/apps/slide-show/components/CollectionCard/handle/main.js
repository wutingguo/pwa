import React from 'react';
import { XIcon } from '@common/components';
import { projectProsessMap } from '@apps/slide-show/constants/strings';
import { getCollectionStatus } from '@apps/slide-show/utils/helper';

const getBtnsStatus = item => {
  const projectStatus = item && item.get('project_status');
  const projectVersion = item && item.get('project_version');

  const projectProsess = getCollectionStatus(projectStatus, projectVersion);

  return {
    disableShare: projectProsessMap.PUBLISHED !== projectProsess,
    disableDownload: projectProsessMap.PUBLISHED !== projectProsess
  };
};

const renderOptionItem = item => {
  const { type, action, label, disabled } = item;
  return (
    <li className={`${disabled ? 'wrapper-disabled' : ''}`} key={type}>
      <a className={`${type} ${status} ${disabled ? 'disabled' : ''}`} onClick={() => action(item)}>
        <XIcon
          type={type}
          status={status}
          iconWidth={12}
          iconHeight={12}
          title={label}
          text={label}
        />
      </a>
    </li>
  );
};

const getDropdownProps = that => {
  const { item, handleCopy, handleEdit, handleDownload, handleSharing, handleDelete } = that.props;

  const { disableShare, disableDownload } = getBtnsStatus(item);

  return {
    label: '',
    arrow: 'right',
    dropdownList: [
      {
        type: 'rename',
        label: t('SLIDESHOW_RENAME'),
        action: () => handleEdit(item)
      },
      {
        type: 'copy-photo',
        label: t('SLIDESHOW_COPY'),
        action: () => handleCopy(item)
      },
      {
        type: 'download',
        label: t('SLIDESHOW_DOWNLOAD'),
        disabled: disableDownload,
        action: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsList_Pull-downMenu_Download'
          });

          handleDownload(item);
        }
      },
      {
        type: 'sharing',
        label: t('SLIDESHOW_SHARING'),
        disabled: disableShare,
        action: () => {
          window.logEvent.addPageEvent({
            name: 'SlideshowsList_Pull-downMenu_Share'
          });

          handleSharing(item);
        }
      },
      {
        type: 'delete',
        label: t('SLIDESHOW_DELETE'),
        action: () => handleDelete(item)
      }
    ],
    renderLable: label => (
      <XIcon type="more-label" iconWidth={12} iconHeight={12} title={label} text={label} />
    ),
    renderOptionItem,
    customClass: 'collection-handler'
  };
};

const handlePreview = (that, { href }) => {
  window.logEvent.addPageEvent({
    name: 'SlideshowsList_PriviewSlideshow'
  });

  location.href = href;
};

export default {
  getDropdownProps,
  handlePreview
};
