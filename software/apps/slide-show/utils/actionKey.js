import { getActionType } from '@resource/lib/redux-helper/helper';

export const actionKey = 'SLIDE_SHOW';

export default type => getActionType(actionKey, type);
