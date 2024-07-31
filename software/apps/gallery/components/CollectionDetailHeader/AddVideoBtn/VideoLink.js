import cls from 'classnames';
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { useImmer } from 'use-immer';

import { XButton, XInput } from '@common/components';

import { checkIsVideoUrlValid } from '@apps/gallery/constants/strings';

const VideoLink = ({ onAdd, onCancel }) => {
  const [state, update] = useImmer({
    url: '',
    status: 'normal',
  });
  const videoLinkRef = useRef(null);
  const handleAdd = useCallback(async () => {
    const valid = checkIsVideoUrlValid(state.url);
    if (!valid) return;
    onCancel();
    onAdd(state.url, 3);
  }, [onAdd, state.url, update]);

  const status = useMemo(() => {
    if (!String(state.url)) return 'normal';
    const valid = checkIsVideoUrlValid(state.url);
    return valid ? 'success' : 'error';
  }, [state.url]);

  const map = {
    normal: { color: '#a6a6a6', message: 'Add a YouTube or Vimeo Link' },
    error: { color: '#c53540', message: 'Unable to retrieve video. Replace link or try again.' },
    success: { color: '#088664', message: 'Video found and ready for use.' },
  };
  const urlChange = e => {
    e.persist();
    update(s => {
      s.url = e.target.value;
    });
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleClickOutside = useCallback(
    event => {
      if (videoLinkRef.current && !videoLinkRef.current.contains(event.target)) {
        onCancel?.();
      }
    },
    [onCancel, update]
  );

  const { color, message } = map[status];

  const disabled = status !== 'success';

  return (
    <div className="add-video-menu addvideo-link-box" ref={videoLinkRef}>
      <div className="link-input">
        <XInput value={state.url} onChange={urlChange} placeholder="https://" />
      </div>
      <div className={cls('mb-2 text-[14px] w-full')}>
        <span style={{ color }}>{message}</span>
      </div>
      <div className="text-right">
        <XButton
          type="link"
          onClick={() => {
            update(s => {
              s.open = false;
            });
            onCancel?.();
          }}
        >
          Cancel
        </XButton>
        <XButton className="add-btn" type="link" disabled={disabled} onClick={handleAdd}>
          Add
        </XButton>
      </div>
    </div>
  );
};

export default memo(VideoLink);
