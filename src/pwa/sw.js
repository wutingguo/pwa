import { use } from '@resource/pwa/utils/helper';
import gallery from '@software/apps/gallery/pwa';
import slideshow from '@software/apps/slide-show/pwa';
import pwa from './service';

// 在sw中注入业务模块.
use(pwa);
use(gallery);
use(slideshow);