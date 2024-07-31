import { combineReducers } from 'redux';
import system from '@resource/pwa/redux/reducer';
import shell from './project';
import gallery from '@apps/gallery/redux/reducer';
import aiphoto from '@apps/aiphoto/redux/reducer';
import dashboard from '@apps/dashboard/redux/reducer';
import slideshow from '@apps/slide-show/redux/reducer';
import live from '@apps/live/redux/reducer';
import website from '@apps/website/redux/reducer';
import theme from '@apps/theme-editor/redux/reducer';
import aiMatting from '@apps/ai-matting/redux/reducer';

export default combineReducers({
  root: system,
  shell,
  gallery,
  aiphoto,
  dashboard,
  slideshow,
  website,
  live,
  theme,
  aiMatting
});
