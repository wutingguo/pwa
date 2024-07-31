import images from './images';
import collection from './collection';
import share from './share';
import effects from '../../../aiphoto/redux/actions/effects';

export default {
  ...images,
  ...collection,
  ...share,
  ...effects
};