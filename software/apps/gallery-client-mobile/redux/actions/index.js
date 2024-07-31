import collection from './collection';
import favorite from './favorite';
import guest from './guest';
import editor from './editor';
import store from './store';

export default {
  ...collection,
  ...guest,
  ...favorite,
  ...store,
  ...editor,
};
