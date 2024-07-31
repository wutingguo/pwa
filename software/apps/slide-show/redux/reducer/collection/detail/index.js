import { fromJS, isImmutable } from 'immutable';
import { get, merge, isEmpty } from 'lodash';
import { guid } from '@resource/lib/utils/math';
import {
  API_SUCCESS,
  UPLOAD_COMPLETE,
  UPLOAD_ALL_COMPLETE
} from '@resource/lib/constants/actionTypes';
import {
  SAAS_SLIDE_GET_PROJECT_DETAIL,
  SAAS_SLIDE_MODIFY_PROJECT,
  SAAS_SLIDE_SET_COVER_IMAGE,
  SAAS_SLIDE_SET_THEME,
  SAAS_SLIDE_SAVE_PROJECT,
  SAAS_SLIDE_REVERT,
  GET_MUSIC_WAVEFORM_ARRAYBUFFER
} from '@resource/lib/constants/apiUrl';
import {
  SHOW_IMAGE_NAME,
  CHANGE_SELECTION,
  SELECT_ALL_IMG,
  CLEAR_SELECTION,
  DELETE_IMAGE,
  REPLACE_AUDIO,
  UPDATE_FRAMES,
  SET_THEME,
  DELETE_WAVEFORM,
  CHANGE_TRANSITION,
  RESET_COLLECTION_DETAIL,
  SET_POST_CARD,
  UPDATE_AUDIO_REGION
} from '@apps/slide-show/constants/actionTypes';
import { convertObjIn } from '@resource/lib/utils/typeConverter';
import getActionKey from '@apps/slide-show/utils/actionKey';
import ThemeList from '@apps/slide-show/constants/theme';

const getDefaultSegment = () => {
  return {
    guid: guid(),
    music: {
      duration: 0,
      audios: [
        {
          enc_id: '',
          start: 0,
          end: 0,
          offset: 0,
          artist_name: '',
          music_title: '',
          library_type: 0
        }
      ]
    },
    frames: [],
    setting: {
      transition_mode: 1,
      transition_duration: 1
    },
    editing: false,
    selected: true
  };
};

const detail = (state = fromJS({}), action) => {
  switch (action.type) {
    case RESET_COLLECTION_DETAIL: {
      return fromJS({});
    }
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case SAAS_SLIDE_SAVE_PROJECT:
        case SAAS_SLIDE_REVERT:
        case SAAS_SLIDE_GET_PROJECT_DETAIL: {
          const item = convertObjIn(get(action.response, 'data'));
          // console.log('item:', item);
          const segments = get(item, 'segments', []);
          if (!segments.length) {
            segments.push(getDefaultSegment());
          }

          segments[0].selected = true;
          const theme = get(item, 'theme') || ThemeList[0];
          const newItem = merge(item, {
            watermarkList: [], // 水印列表
            segments,
            theme,
            editing: false
          });

          // window.logEvent.setBaseParmas({
          //   CollectionID: newItem.collection_uid
          // });

          return fromJS(newItem);
        }
        case SAAS_SLIDE_MODIFY_PROJECT: {
          const data = get(action, 'response.data') || {};
          if (isEmpty(data)) return state;
          const { slides_name } = data;
          return state.set('name', slides_name);
        }
        case SAAS_SLIDE_SET_COVER_IMAGE: {
          const data = get(action, 'response.data') || {};
          if (isEmpty(data)) return state;
          const { cover_img } = data;
          return state.set('cover_img', fromJS(cover_img));
        }
        case SAAS_SLIDE_SET_THEME: {
          const data = get(action, 'response.data') || {};
          if (isEmpty(data)) return state;
          const { theme } = data;
          return state.set('theme', fromJS(theme));
        }
        case GET_MUSIC_WAVEFORM_ARRAYBUFFER: {
          const data = get(action, 'response.data') || {};
          if (isEmpty(data)) return state;
          return state.set('peaks', data);
        }
        default:
          return state;
      }
    }
    // set上传图片
    case getActionKey(UPLOAD_ALL_COMPLETE):
    case getActionKey(UPLOAD_COMPLETE): {
      const { payload, mutiply } = action;
      const images = mutiply ? payload : [payload.fields];
      const segments = state.get('segments');
      const selectIndex = segments.findIndex(item => item.get('selected'));
      if (selectIndex >= 0) {
        const selectedSegment = segments.get(selectIndex);
        const frames = selectedSegment.get('frames');
        let newFrames = images.map(v => {
          return fromJS({
            guid: guid(),
            image: convertObjIn(v),
            setting: selectedSegment.get('setting')
          });
        });

        newFrames = frames.concat(newFrames);
        return state.setIn(['segments', selectIndex, 'frames'], newFrames);
      }
      return state;
    }
    case getActionKey(CHANGE_SELECTION): {
      const id = get(action, ['payload', 'id']);
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            let frames = segment.get('frames');
            frames = frames.map(frame => {
              let newSelected = frame.get('selected');
              if (frame.get('guid') === id) {
                newSelected = !frame.get('selected');
              }
              return frame.set('selected', newSelected);
            });
            return segment.set('frames', frames);
          }
          return segment;
        });
      });
    }
    case getActionKey(SELECT_ALL_IMG): {
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            let frames = segment.get('frames');
            frames = frames.map(frame => frame.set('selected', true));
            return segment.set('frames', frames);
          }
          return segment;
        });
      });
    }
    case getActionKey(CLEAR_SELECTION): {
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            let frames = segment.get('frames');
            frames = frames.map(frame => frame.set('selected', false));
            return segment.set('frames', frames);
          }
          return segment;
        });
      });
    }
    case getActionKey(DELETE_IMAGE): {
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            let frames = segment.get('frames');
            frames = frames.filter(frame => !frame.get('selected'));
            return segment.set('frames', frames);
          }
          return segment;
        });
      });
    }
    case getActionKey(REPLACE_AUDIO): {
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            const { enc_id, duration, artist_name, music_title } = get(action, 'payload');
            console.log("get(action, 'payload')", get(action, 'payload'));
            let music = segment.get('music');
            const audios = fromJS([
              {
                enc_id,
                start: 0,
                end: duration,
                offset: 0,
                artist_name,
                music_title
              }
            ]);
            music = music.merge({ audios, duration });

            return segment.set('music', music);
          }
          return segment;
        });
      });
    }
    case getActionKey(UPDATE_AUDIO_REGION): {
      const audioRegion = get(action, 'payload');
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            const audio = segment.getIn(['music', 'audios', 0]);
            return segment.setIn(['music', 'audios', 0], audio.merge(audioRegion));
          }
          return segment;
        });
      });
    }
    case getActionKey(UPDATE_FRAMES): {
      const newFrames = get(action, ['payload', 'frames']);
      return state.update('segments', segments => {
        return segments.map(segment => {
          if (segment.get('selected')) {
            return segment.set('frames', newFrames);
          }
          return segment;
        });
      });
    }
    case getActionKey(SET_THEME): {
      const theme = get(action, ['payload', 'theme']);
      return state.set('theme', fromJS(theme));
    }
    case getActionKey(DELETE_WAVEFORM): {
      const encId = get(action, ['payload', 'encId']);
      // console.log('encId: ', encId);
      const currnetSegmentIndex = state
        .get('segments')
        .findIndex(segment => segment.get('selected'));
      return state.setIn(['segments', currnetSegmentIndex, 'music'], fromJS({}));
    }
    case getActionKey(CHANGE_TRANSITION): {
      const transition_mode = get(action, ['payload', 'transition_mode']);
      const transition_duration = get(action, ['payload', 'transition_duration']);
      const currnetSegmentIndex = state
        .get('segments')
        .findIndex(segment => segment.get('selected'));
      if (currnetSegmentIndex < 0) return state;
      let newState = state.setIn(
        ['segments', currnetSegmentIndex, 'setting', 'transition_mode'],
        transition_mode
      );
      newState = newState.setIn(
        ['segments', currnetSegmentIndex, 'setting', 'transition_duration'],
        transition_duration
      );
      return newState;
    }
    case getActionKey(SET_POST_CARD): {
      const postCardId = get(action, 'postCardId');
      const postCard = {
        isUsedPostCard: true,
        usedPostCardId: postCardId
      };
      return state.set('postCard', fromJS(postCard));
    }
  }
  return state;
};

export default detail;
