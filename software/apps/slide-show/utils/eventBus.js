import {
  add,
  dispatch,
  remove
} from '@resource/lib/utils/bus';

const eventTypes = {
  // pwa events
  play_slide_show_video: 'play_slide_show_video',
  reset_slide_show_video: 'reset_slide_show_video',
  pause_waveform_video: 'pause_waveform_video'
};

/** play_slide_show_video */
export const playSlideShowVideoEvent = {
  add: cb => {
    add(eventTypes.play_slide_show_video, cb);
  },
  remove: cb => {
    remove(eventTypes.play_slide_show_video, cb);
  },
  dispatch: (...data) => {
    dispatch(eventTypes.play_slide_show_video, ...data);
  }
}

/** reset_slide_show_video */
export const resetSlideShowVideoEvent = {
  add: cb => {
    add(eventTypes.reset_slide_show_video, cb);
  },
  remove: cb => {
    remove(eventTypes.reset_slide_show_video, cb);
  },
  dispatch: (...data) => {
    dispatch(eventTypes.reset_slide_show_video, ...data);
  }
}

/** pauseWaveformVideo */
export const pauseWaveformVideoEvent = {
  add: cb => {
    add(eventTypes.pause_waveform_video, cb);
  },
  remove: cb => {
    remove(eventTypes.pause_waveform_video, cb);
  },
  dispatch: (...data) => {
    dispatch(eventTypes.pause_waveform_video, ...data);
  },
}

export default {
  playSlideShowVideoEvent,
  resetSlideShowVideoEvent,
  pauseWaveformVideoEvent,
}