import clock from './clock';
import * as labs from './labs';
import designer from './designer';
import globalSettings from './globalSettings';

export default {
  ...clock,
  ...labs,
  ...globalSettings,
  ...designer
};