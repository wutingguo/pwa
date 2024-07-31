import reducer from '@src/redux/reducer';
import { createAppStore } from '@resource/pwa/redux/store';

export const storeInstance = createAppStore(reducer, '@src/redux/reducer');