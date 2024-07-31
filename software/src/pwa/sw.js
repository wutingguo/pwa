import { use } from '@resource/pwa/utils/helper';
import gallery from '@apps/gallery/pwa';
import slideshow from '@apps/slide-show/pwa';
import pwa from './service';

// 在sw中注入业务模块.
use(pwa);
use(gallery);
use(slideshow);