import activities from './activities';
import detail from './detail';
import list from './list';
import settings from './settings';
import share from './share';

export default {
  ...list,
  ...detail,
  ...activities,
  ...settings,
  ...share,
};
