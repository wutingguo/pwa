import collection from './collection';
import guest from './guest';
import favorite from './favorite';
import store from './store';

export default {
  ...collection,
  ...guest,
  ...favorite,
  ...store
};
