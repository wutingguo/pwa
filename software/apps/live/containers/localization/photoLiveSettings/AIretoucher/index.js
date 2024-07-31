import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import React, { Component } from 'react';

import XButton from '@resource/components/XButton';
import XSelect from '@resource/components/XSelect';

import { DOWN_WASM_MODAL, PERFECTLY_CLEAR_MODAL } from '@resource/lib/constants/modalTypes';
import { saasProducts } from '@resource/lib/constants/strings';

import { getWASMPath } from '@resource/lib/perfectlyClear/utils/help';

import { IntlConditionalDisplay, combinLanguage } from '@common/components/InternationalLanguage';

import { createMessage } from '@common/hooks/useMessage';

import Switch from '@apps/gallery/components/Switch';
import FButton from '@apps/live/components/FButton';
import FDilog from '@apps/live/components/FDilog';
import FInput from '@apps/live/components/FInput';
import Form, { Field, useForm } from '@apps/live/components/Form';
import PictureCompareBox from '@apps/live/components/PictureCompareBox';
import WithHeaderComp from '@apps/live/components/WIthHeaderComp';
import { AI_PHOTO_STATE_CHECK } from '@apps/live/constants/modalTypes';
import liveServices from '@apps/live/services';
import {
  changeRetouchSwitch,
  getAIRetouchPreset,
  getRetouchingPoints,
  getTopicCategories,
  getTopicEffects,
  removeTopicImport,
  saveAIRetouchPreset,
  saveTopicImport,
} from '@apps/live/services/photoLiveSettings';
import { queryCorrectStatics } from '@apps/live/services/photoLiveSettings';
import { openPayCard } from '@apps/live/utils/index';

import { Footer } from '../category/DeleteCategoryModal/layout';

import Cascader from './Cascader';
import RetouchSelect from './RetouchSelect';

import './index.scss';

function getSource(intl, quick_correct) {
  const isCN = intl.lang === 'cn';
  const data = [
    {
      key: 1,
      label: intl.tf('LP_AI_RETOUCH_OFF'),
    },
    {
      key: 2,
      label: intl.tf('LP_AI_RETOUCH_FE'),
      children: [
        {
          key: 3,
          label: intl.tf('LP_AI_RETOUCH_CBP'),
          disabled: quick_correct === 'ROLLS',
        },
        {
          key: 4,
          label: intl.tf('LP_AI_RETOUCH_CBE'),
          disabled: quick_correct === 'POINTS',
        },
      ],
    },
    isCN && {
      key: 5,
      label: '精修',
    },
  ];

  return data.filter(Boolean);
}

const aiOptionSerialize = {
  1: 'none',
  3: 'POINTS',
  4: 'ROLLS',
  5: 'MEITU_POINTS',
};
const aiOptionDeSerialize = {
  POINTS: [2, 3],
  ROLLS: [2, 4],
  MEITU_POINTS: [5],
  none: [1],
};

class AIRetoucher extends Component {
  constructor(props) {
    super(props);
    this.RetouchSelectRef = null;
    this.state = {
      isChecked: false,
      curScene: '',
      curMode: '',
      retouchScenes: [],
      effectsPool: {},
      presetCode: '',
      topicEffects: [], //美图修图模式列表
      enableValues: [],
      dataSource: getSource(props.intl),
      password: '',
      name: '',
      topicBaseCode: '',
      modalVisible: false,
      contentStatus: 0,
    };
    // this.filterTopicCodeList = this.filterTopicCodeList.bind(this);
  }

  componentDidMount() {
    const { albumInfo } = this.props;
    const { correct_enable } = albumInfo;
    this.setState({
      isChecked: correct_enable,
    });
    this.prepareWork();
    this.queryAiInfo();
  }

  componentDidUpdate(preProps) {
    const { albumInfo } = this.props;
    const { albumInfo: preAlbumInfo } = preProps;
    if (!isEqual(albumInfo, preAlbumInfo)) {
      const { correct_enable } = albumInfo;
      this.setState({
        isChecked: correct_enable,
      });
    }
  }

  regetEffectsPool = async () => {
    const { urls } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const effects = await getTopicEffects({ galleryBaseUrl });
    const effectsPool = this.trimEffectsPool(effects);
    this.setState({
      effectsPool,
    });
  };

  prepareWork = async () => {
    const {
      albumInfo: { currentAlbumId },
      baseUrl,
      urls,
      intl,
    } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const { topic_code } = await getAIRetouchPreset({ baseUrl, enc_album_id: currentAlbumId });
    const categories = await getTopicCategories({ galleryBaseUrl });
    const options = categories
      .map(item => {
        return {
          ...item,
          value: item.category_code,
          label: item.category_name,
        };
      })
      .concat({
        value: 'MY_PRESETS',
        label: intl.tf('LP_MY_PRESET'),
      });
    // 美图预设参数
    // const effects = await getTopicEffects({ galleryBaseUrl, provider: 'MT' });
    const effects = await getTopicEffects({ galleryBaseUrl, provider: 'PFC' });
    const effectsPool = this.trimEffectsPool(effects);
    const findScene = effects.find(item => item.topic_code === topic_code);
    this.setState({
      curMode: topic_code,
      presetCode: findScene && findScene.preset_code,
      curScene: (findScene && findScene.category_code) || 'MY_PRESETS',
      retouchScenes: options,
      effectsPool,
      topicEffects: effects,
    });
  };

  /**
   * 过滤指定修图场景
   * @param {Array[any]} data
   * @returns {Array[any]}
   */
  filterTopicCodeList(data) {
    const hideList = ['SYS_TOPIC_VIVID', 'SYS_TOPIC_DETAILS', 'SYS_TOPIC_INTELLIGENTAUTO'];
    const { intl } = this.props;
    if (intl.lang !== 'cn') return data;
    const newLlist = data.filter(item => {
      return !hideList.includes(item.topic_code);
    });
    return newLlist;
  }
  trimEffectsPool = pool => {
    const box = {
      MY_PRESETS: [],
    };
    pool.forEach(item => {
      const { category_code } = item;
      if (!category_code) {
        box.MY_PRESETS.push({
          ...item,
          label: item.topic_name,
          value: item.topic_code,
        });
      } else if (!box[category_code]) {
        box[category_code] = [].concat({
          ...item,
          label: t(item.topic_code),
          value: item.topic_code,
        });
      } else if (box[category_code]) {
        box[category_code].push({
          ...item,
          label: t(item.topic_code),
          value: item.topic_code,
        });
      }
    });
    box['GENERAL'] = this.filterTopicCodeList(box['GENERAL']);
    return box;
  };

  setLogEvent = checked => {
    const { intl } = this.props;

    if (checked) {
      intl.lang === 'cn' &&
        window.logEvent.addPageEvent({
          name: 'LIVE_AIEditing_On',
        });
      return;
    }
    intl.lang === 'cn' &&
      window.logEvent.addPageEvent({
        name: 'LIVE_AIEditing_Off',
      });
  };

  changeSwitch = async status => {
    const {
      albumInfo: { currentAlbumId },
      message,
      baseUrl,
      urls,
      boundGlobalActions,
      userInfo,
      intl,
    } = this.props;

    if (intl.lang === 'cn') {
      const res = await this.getCorrectStatics();
      const { method } = res;
      if (status && method === null) {
        boundGlobalActions.showModal(AI_PHOTO_STATE_CHECK, {
          album_id: currentAlbumId,
          customer_id: userInfo.get('uidPk'),
          close: () => boundGlobalActions.hideModal(AI_PHOTO_STATE_CHECK),
          onOk: () => {
            changeRetouchSwitch({
              baseUrl,
              album_id: currentAlbumId,
              correct_enable: status,
            }).then(() => {
              message &&
                intl.lang === 'cn' &&
                message.success(
                  status
                    ? intl.tf('LP_AI_RETOUCHING_HAS_BEEN_ENABLED')
                    : intl.tf('LP_AI_RETOUCHING_IS_DISABLED')
                );
              this.props.getBaseInfo();
              this.setState({
                isChecked: status,
              });
            });
          },
        });
        return;
      }
    }

    changeRetouchSwitch({
      baseUrl,
      album_id: currentAlbumId,
      correct_enable: status,
    }).then(() => {
      message &&
        intl.lang === 'cn' &&
        message.success(
          status
            ? intl.tf('LP_AI_RETOUCHING_HAS_BEEN_ENABLED')
            : intl.tf('LP_AI_RETOUCHING_IS_DISABLED')
        );
      this.props.getBaseInfo();
      this.setState({
        isChecked: status,
      });
    });
  };
  getCorrectStatics = async () => {
    const {
      albumInfo: { currentAlbumId },
      userInfo,
      urls,
    } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl: galleryBaseUrl,
      customer_id: userInfo.get('uidPk'),
      album_id: currentAlbumId,
    };
    const res = await queryCorrectStatics(params);
    return res;
  };

  /**
   * 支持 cn
   * @returns {Promise}
   */
  queryAiInfo = async () => {
    const {
      albumInfo: { currentAlbumId },
      userInfo,
      urls,
      intl,
    } = this.props;
    // if (intl.lang === 'en') return;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const params = {
      baseUrl: galleryBaseUrl,
      customer_id: userInfo.get('uidPk'),
      album_id: currentAlbumId,
    };
    const res = await queryCorrectStatics(params);
    const { quick_correct, method, correct_enable } = res;
    const newState = {
      enableValues: aiOptionDeSerialize[method] || [],
    };
    if (quick_correct) {
      newState.dataSource = getSource(intl, quick_correct);
    }
    if (typeof correct_enable === 'boolean' && !correct_enable) {
      newState.enableValues = aiOptionDeSerialize['none'];
    }
    this.setState(newState);
  };

  changeScene = item => {
    const { curScene, effectsPool } = this.state;
    const { value } = item;
    if (value !== curScene) {
      // console.log('effectsPool[value]: ', effectsPool, value);
      const effects = effectsPool[value] ? effectsPool[value][0] || {} : {};
      this.changeMode(effects);
      this.setState({
        curScene: value,
      });
    }
  };

  saveOperation = topic_code => {
    const {
      baseUrl,
      albumInfo: { currentAlbumId },
      message,
      intl,
    } = this.props;
    saveAIRetouchPreset({
      baseUrl,
      enc_album_id: currentAlbumId,
      topic_code,
    }).then(() => {
      message.success(intl.tf('LP_SAVE_SUCCESSFULLY'));
    });
  };

  changeMode = item => {
    const { value, preset_code, topic_code } = item;
    topic_code && this.saveOperation(topic_code);
    this.setState({
      curMode: value,
      presetCode: preset_code,
    });
  };

  adjustEffect = async () => {
    const { boundGlobalActions, albumInfo, urls } = this.props;
    const { enc_album_id } = albumInfo;
    const { presetCode, curMode, curScene } = this.state;
    const galleryBaseUrl = urls.get('galleryBaseUrl');

    const pfcParams = {
      imageArray: fromJS([]),
      pfcFromModule: saasProducts.live,
      galleryPfcParams: {
        collection_uid: '',
        set_uid: '',
      },
      topicCode: curMode,
      preset_code: presetCode,
      enc_album_id,
      baseUrl: galleryBaseUrl,
      category_code: curScene,
      onCloseModalCallback: () => {
        this.regetEffectsPool();
      },
    };
    const wasmJsFile = await getWASMPath();
    boundGlobalActions.showModal(DOWN_WASM_MODAL, {
      wasmJsFile,
      success: () => {
        boundGlobalActions.showModal(PERFECTLY_CLEAR_MODAL, pfcParams);
      },
    });
  };

  /**
   * 支持 [cn、en]
   * @param {number[]} keys
   * @returns {Promise}
   */
  enableChange = async keys => {
    const {
      albumInfo: { currentAlbumId },
      message,
      intl,
      boundGlobalActions,
      userInfo,
      urls,
    } = this.props;

    const len = keys.length;
    if (len === 0) return;
    const baseUrl = urls.get('galleryBaseUrl');

    const staticsParams = {
      baseUrl,
      customer_id: userInfo.get('uidPk'),
      album_id: currentAlbumId,
    };
    const aiInfo = await queryCorrectStatics(staticsParams);
    const { method, point_count, roll_count, quick_correct, meitu_count, refine_correct } = aiInfo;
    const key = keys[len - 1];
    const value = aiOptionSerialize[key];
    const params = {
      baseUrl,
      album_id: currentAlbumId,
      correct_enable: true,
      correct_method: value,
    };
    if (value === 'none') {
      params.correct_enable = false;
      params.correct_method = method;
    }

    const changeRetouch = async () => {
      await changeRetouchSwitch(params);
      this.setLogEvent(params.correct_enable);
      this.queryAiInfo();
      message &&
        message.success(
          params.correct_enable
            ? intl.tf('LP_AI_RETOUCHING_HAS_BEEN_ENABLED')
            : intl.tf('LP_AI_RETOUCHING_IS_DISABLED')
        );
    };

    // this.setState({
    //   enableValues: keys
    // });

    const isCN = intl.lang === 'cn';
    if (quick_correct === null && point_count === 0 && value === 'POINTS') {
      // 2
      // 打开张数购买弹窗
      openPayCard({ boundGlobalActions, baseUrl }, 'aiphoto', isCN);
      return;
    } else if (quick_correct === null && roll_count === 0 && value === 'ROLLS') {
      // 1
      // 打开场次购买弹窗
      openPayCard({ boundGlobalActions, baseUrl }, 'aiphotoField', isCN);
      return;
    } else if (refine_correct === null && meitu_count === 0 && value === 'MEITU_POINTS') {
      // 打开精修购买弹窗
      openPayCard({ boundGlobalActions, baseUrl }, 'retouch', isCN);
      return;
    } else if (
      !quick_correct &&
      ((point_count > 0 && value === 'POINTS') || (roll_count > 0 && value === 'ROLLS'))
    ) {
      const type = value === 'POINTS' ? 'aiphoto' : 'aiphotoField';
      const count = value === 'POINTS' ? point_count : roll_count;
      boundGlobalActions.showConfirm({
        title: '',
        message: this.getMessageText(value, {
          count,
          onClick: () => {
            openPayCard({ boundGlobalActions, baseUrl }, type, isCN);
            boundGlobalActions.hideConfirm();
          },
        }),
        close: boundGlobalActions.hideConfirm,
        buttons: [
          {
            onClick: () => {
              boundGlobalActions.hideConfirm();
            },
            text: intl.tf('LP_AI_RETOUCH_CANCEL'),
            className: 'white',
          },
          {
            onClick: () => {
              changeRetouch();
              boundGlobalActions.hideConfirm;
            },
            text: intl.tf('LP_AI_RETOUCH_CONFIRM'),
          },
        ],
      });
      return;
    } else if (value === 'MEITU_POINTS' && meitu_count < 1000) {
      boundGlobalActions.showConfirm({
        title: '',
        message: (
          <span>
            <span>{`可使用精修张数不足1000张，为了直播效果，请及时`}</span>
            <a
              onClick={() => openPayCard({ boundGlobalActions, baseUrl }, 'retouch', isCN)}
              href="javascript:;"
            >
              购买
            </a>
            <span>。可使用精修张数为0张时，新照片不会被AI精修。</span>
          </span>
        ),
        close: boundGlobalActions.hideConfirm,
        buttons: [
          {
            onClick: () => {
              changeRetouch();
              boundGlobalActions.hideConfirm();
            },
            text: '取消',
            className: 'white',
          },
          {
            onClick: () => {
              openPayCard({ boundGlobalActions, baseUrl }, 'retouch', isCN);
              boundGlobalActions.hideConfirm();
            },
            text: '购买',
          },
        ],
      });
      return;
    }

    await changeRetouch();
  };

  getMessageText = (type, { count = 0, onClick }) => {
    const { intl } = this.props;
    const isEN = intl.lang === 'en';
    if (type === 'ROLLS') {
      return (
        <span>
          {intl.tf('LP_AI_RETOUCH_EVENT_TIP')}
          {isEN && `You have ${count} events, `}
          {isEN && (
            <a onClick={onClick} href="javascript:;">
              {intl.tf('LP_BUY_NOW')}
            </a>
          )}
        </span>
      );
    } else if (type === 'POINTS') {
      if (count < 300) {
        return (
          <span>
            <span>{`${intl.tf('LP_AI_RETOUCH_PHOTO_TIP')}${
              isEN ? `You have ${count} credits, ` : `目前剩余${count}张未使用，`
            }`}</span>
            <a onClick={onClick} href="javascript:;">
              {intl.tf('LP_BUY_NOW')}
            </a>
          </span>
        );
      }
      return (
        <span>
          {intl.tf('LP_AI_RETOUCH_PHOTO_TIP')}
          {/* {isEN && (
            <a onClick={onClick} href="javascript:;">
              {intl.tf('LP_BUY_NOW')}
            </a>
          )} */}
        </span>
      );
    }
  };
  onRef = ref => {
    this.RetouchSelectRef = ref;
  };
  add = () => {
    return (
      <div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyItems: 'center',
            paddingTop: '10px',
            marginBottom: '20px',
          }}
        >
          <p style={{ color: '#222222', fontSize: '24px' }}>{`导入预设`}</p>
          <FInput
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
            containerStyle={{
              fontSize: '16px',
              width: '90%',
              height: '40px',
              outline: 'none',
              borderWidth: '1px',
              borderColor: '#222222',
              borderRadius: '3px',
            }}
            value={this.state.password}
            placeholder="请输入预设口令"
            rows={1}
          />
          <FInput
            onChange={e => {
              this.setState({ name: e.target.value });
            }}
            containerStyle={{
              marginTop: '20px',
              fontSize: '16px',
              width: '90%',
              height: '40px',
              outline: 'none',
              borderWidth: '1px',
              borderColor: '#222222',
              borderRadius: '3px',
            }}
            value={this.state.name}
            placeholder="请输入预设名称"
            rows={1}
            max={8}
          />
        </div>
      </div>
    );
  };
  remove = () => {
    return (
      <div style={{ marginLeft: '17px', marginBottom: '20px', marginTop: '20px' }}>
        <p
          style={{
            fontWeight: 400,
            marginTop: '0px',
            color: '#222222',
            fontSize: '16px',
            textAlign: 'left',
          }}
        >{`删除预设`}</p>
        <p
          style={{
            fontWeight: 200,
            marginTop: '0px',
            color: '#222222',
            fontSize: '12px',
            textAlign: 'left',
          }}
        >{`已修好的照片不受影响，未修好的照片将暂停`}</p>
      </div>
    );
  };
  importFooter = () => {
    return (
      <Footer>
        <FButton
          style={{
            marginRight: 40,
            background: '#fff',
            border: '1px solid #d8d8d8',
            color: '#222',
          }}
          className="btn"
          onClick={this.handleModalClose}
        >
          {'取消'}
        </FButton>
        <FButton
          className="btn"
          onClick={() => {
            const { baseUrl, message } = this.props;
            const { name, password, contentStatus } = this.state;
            if (contentStatus == 0) {
              if (name.length == 0) {
                message.error('预设名称不能为空');
                return;
              }
              if (password.length == 0) {
                message.error('口令不能为空');
                return;
              }
              saveTopicImport({
                baseUrl,
                base_topic_code: this.state.password,
                provider: 'MT',
                topic_name: this.state.name,
              })
                .then(() => {
                  message.success('添加预设成功');
                  this.RetouchSelectRef.getRouchList();
                  this.handleModalClose();
                })
                .catch(err => {
                  if (err.ret_code == 21003) {
                    message.error('预设id校验失败');
                    return;
                  } else if (err.ret_code == 429053) {
                    message.error('预设名称重复，请重试');
                    return;
                  }
                });
            } else {
              removeTopicImport({ baseUrl, topic_code: this.state.topicBaseCode })
                .then(() => {
                  this.RetouchSelectRef.getRouchList();
                  this.handleModalClose();
                })
                .catch(() => {
                  this.handleModalClose();
                });
            }
          }}
        >
          {'确定'}
        </FButton>
      </Footer>
    );
  };
  handleModalClose = () => {
    this.setState({ modalVisible: false, password: '', name: '' });
  };
  render() {
    const {
      isChecked,
      retouchScenes,
      curScene,
      curMode,
      effectsPool,
      topicEffects,
      enableValues,
      dataSource,
    } = this.state;
    const { intl, urls, albumInfo } = this.props;
    const baseUrl = urls.get('galleryBaseUrl');
    const { modalVisible, contentStatus } = this.state;
    const retouchContros = [
      {
        label: intl.tf('LP_SCENES'),
        key: 'retouchScene',
        controls: () => (
          <XSelect value={curScene} options={retouchScenes} onChange={this.changeScene} />
        ),
      },
      {
        label: intl.tf('LP_AI_PRESENTS'),
        key: 'retouchMode',
        controls: () => {
          if (!effectsPool[curScene] || !effectsPool[curScene].length) {
            return <div style={{ paddingLeft: 10 }}>{}</div>;
          }
          return (
            <XSelect
              value={curMode}
              options={effectsPool[curScene] || []}
              onChange={this.changeMode}
            />
          );
        },
      },
    ];

    const checkRetouch = enableValues[0];
    return (
      <WithHeaderComp title={intl.tf('LP_AI_RETOUCH_TITLE')} className="AIRetoucherWrapper">
        <div className="content">
          {/* <IntlConditionalDisplay reveals={['en']}>
            <>
              <div className="controls">
                <div className="label">{intl.tf('LP_AI_RETOUCH_SWITCH')}</div>
                <Switch onSwitch={this.changeSwitch} checked={isChecked} />
                <XButton onClick={this.adjustEffect} width={intl.lang !== 'cn' ? 130 : undefined}>
                  {intl.tf('LP_EDIT_AI_PRESENTS')}
                </XButton>
              </div>
              <div className="retouchControlsWrapper">
                {retouchContros.map(item => (
                  <div className="retouchModified">
                    <div className="label">{item.label}</div>
                    <div className="adjustRetouch">{item.controls()}</div>
                  </div>
                ))}
              </div>
            </>
          </IntlConditionalDisplay> */}
          <IntlConditionalDisplay reveals={['cn', 'en']}>
            <>
              <div className="controls">
                <div className="label">{intl.tf('LP_AI_RETOUCH_SWITCH')}</div>
                <Cascader data={dataSource} value={enableValues} onChange={this.enableChange} />
              </div>
              <div className="retouchControlsWrapper">
                {checkRetouch === 2 ? (
                  <>
                    {retouchContros.map(item => (
                      <div className="retouchModified">
                        <div className="label">{item.label}</div>
                        <div className="adjustRetouch">{item.controls()}</div>
                      </div>
                    ))}
                  </>
                ) : null}
                {checkRetouch === 5 ? (
                  <RetouchSelect
                    onRef={this.onRef}
                    removeTopicByCode={topicbaseCode => {
                      // this.setState({ topicBaseCode: topicbaseCode }, () => {
                      //   this.sureDelete();
                      // });
                      this.setState({
                        topicBaseCode: topicbaseCode,
                        modalVisible: true,
                        contentStatus: 1,
                      });
                    }}
                    albumId={albumInfo?.currentAlbumId}
                    baseUrl={baseUrl}
                  />
                ) : null}
              </div>
              {checkRetouch === 2 && effectsPool[curScene]?.length > 0 ? (
                <XButton
                  style={{ marginTop: 40, width: intl.lang !== 'cn' ? 130 : undefined }}
                  onClick={this.adjustEffect}
                >
                  {intl.tf('LP_EDIT_AI_PRESENTS')}
                </XButton>
              ) : null}
            </>
          </IntlConditionalDisplay>
          <IntlConditionalDisplay reveals={['cn']}>
            <>
              {checkRetouch == 5 && (
                <XButton
                  style={{ marginTop: 40 }}
                  onClick={() => {
                    this.setState({ modalVisible: true, contentStatus: 0 });
                  }}
                  width={intl.lang !== 'cn' ? 130 : undefined}
                >
                  {'导入预设'}
                </XButton>
              )}
            </>
          </IntlConditionalDisplay>
          <FDilog
            width="400px"
            open={modalVisible}
            onCancel={this.handleModalClose}
            footer={this.importFooter()}
          >
            {contentStatus == 0 ? this.add() : this.remove()}
          </FDilog>
          {/* 新版AI修图UI */}
          {/* <PictureCompareBox saveOperation={this.saveOperation} topicEffects={topicEffects} topicCode={curMode}></PictureCompareBox> */}
        </div>
      </WithHeaderComp>
    );
  }
}

export default createMessage()(combinLanguage(AIRetoucher));
