import React, { Component, Fragment } from 'react';

import { debounce, isEmpty } from 'lodash';
import equals from '@resource/lib/utils/compare';

import { XInput, XPureComponent, XTextarea, XSelect } from '@common/components';
import Switch from '@apps/gallery/components/Switch';
import XIcon from '@resource/components/icons/XIcon';
import { copyToClipboard } from '@resource/lib/utils/global';

import './index.scss';

class Portfolio extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      portfolioConfig: {},
      originText: '',
      textareaRows: 8,
      requestFlag: false,
    };
  }

  componentDidMount() {
    this.getPortfolioConfig();
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = equals(this.props, nextProps);
    if (!isEqual) {
      this.getPortfolioConfig();
    }
  }

  componentWillUnmount() {}

  getPortfolioConfig = debounce(async () => {
    const { portfolioConfig, requestFlag } = this.state
    const {
      boundProjectActions,
      urls,
      userAuth: { customerId }
    } = this.props;

    if (requestFlag) return false
    this.setState({
      requestFlag: true
    })
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    boundProjectActions
      .getPortfolioConfig({ customer_id: customerId, galleryBaseUrl })
      .then(res => {
        const { data = [] } = res;
        this.setState({
          originText: data?.portfolio_text,
          portfolioConfig: data,
        });
      });
  }, 1000);

  handleLink = type => {
    const { portfolioConfig } = this.state;
    const { boundGlobalActions } = this.props;
    if (!portfolioConfig?.portfolio_link) return false;
    const url = portfolioConfig?.portfolio_link.startsWith('https://')
      ? portfolioConfig?.portfolio_link
      : `${window.location.protocol}//${portfolioConfig?.portfolio_link}`;
    if (type === 'view') {
      this.handleLog('portfolio_link_view')
      window.open(url, '_blank');
    } else if (type === 'copy') {
      copyToClipboard(url);
      this.handleLog('portfolio_link_copy')
      boundGlobalActions.addNotification({
        message: `${t('LINK_COPIED')}`,
        level: 'success',
        autoDismiss: 3
      });
    }
  };

  handleLog = (key, value) => {
    let log = ''
    switch (key) {
      case 'portfolio_status': log = value ? 'Gallery_Settings_Portfolio_Status_Click_On' : 'Gallery_Settings_Portfolio_Status_Click_Off'; break;
      case 'portfolio_link_view': log =  'Gallery_Settings_Portfolio_Link_Click_View'; break;
      case 'portfolio_link_copy': log =  'Gallery_Settings_Portfolio_Link_Click_Copy'; break;
      case 'title_index': log =  'Gallery_Settings_Portfolio_Title_Click_Switch'; break;
      case 'portfolio_text': log =  'Gallery_Settings_Portfolio_Text_Click_Save'; break;
      case 'portfolio_text_cancel': log =  'Gallery_Settings_Portfolio_Text_Click_Cancel'; break;
      default: ''
    }
    window.logEvent.addPageEvent({
      name: log,
    });
  }

  handleChangeValue = (value, type, msg) => {
    const saveFiled = ['portfolio_status', 'title_type'];
    const config = {
      ...this.state.portfolioConfig,
      [type]: value
    };

    let number = 8
    if (type === 'portfolio_text' && value) {
      number = value && Math.ceil(value.length / 100)
    }
    if (saveFiled.includes(type)) {
      this.handleLog(type, value)
      this.handleSave(config, msg);
    } else {
      this.setState({
        portfolioConfig: config,
        textareaRows: number < 8 ? 8 : number + 2
      });
    }
  };


  handleportfolioStatus = debounce((value, type, msg) => {
    this.handleChangeValue(value, type, msg)
  }, 300)

  handleBlurLink = (value, type) => {
    const saveFiled = ['portfolio_status', 'title_index'];
    const config = {
      ...this.state.portfolioConfig,
      [type]: value
    };

    if (saveFiled.includes(type)) {
      this.handleSave(config);
    } else {
      this.setState({
        portfolioConfig: config
      });
    }
  };

  handleSave = (params, msg) => {
    const { boundProjectActions, urls, boundGlobalActions } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const config = {
      ...params,
      portfolio_status: params?.portfolio_status ? 1 : 0
    };
    boundProjectActions.savePortfolioConfig({ bodyParams: config, galleryBaseUrl }).then(res => {
      if (res.ret_code === 200000) {
        boundGlobalActions.addNotification({
          message: msg || t('CHANGE_SUCCESSFULLY_SAVED'),
          level: 'success',
          autoDismiss: 3
        });
        this.setState({
          originText: config?.portfolio_text,
          portfolioConfig: config
        });
      }
    });
  };

  handleViewLink = () => {
    this.props.history.push('/software/settings/my-brand');
  }

  handleViewText = (btnType) => {
    const { portfolioConfig, originText } = this.state
    if (btnType) {
      this.handleLog('portfolio_text')
      this.handleSave(portfolioConfig,  `${t('SETTINGS_PORTFOLIO_TEXT')} ${t('UPDATED')}`)
    } else {
      this.handleLog('portfolio_text_cancel')
      this.handleChangeValue(originText, 'portfolio_text')
    }
  }

  render() {
    const {
      history,
      match: { params },
      collectionPreviewUrl,
    } = this.props;

    const { portfolioConfig, originText, textareaRows } = this.state;

    const titleOptions = [
      {
        label: 'Brand Name',
        value: 1
      },
      // {
      //   label: 'Brand Logo',
      //   value: 2
      // },
    ];

    console.log('portfolioConfig', portfolioConfig);

    return (
      <Fragment>
        <div className="portfolio">
          {/* 主渲染区域. */}
          {
            !isEmpty(portfolioConfig) && 
            <div className="content">
              <div className="settings-item">
                <div className="item-name">{t('SETTINGS_PORTFOLIO_STATUS')}</div>
                <div className="item-content">
                  <Switch
                    onSwitch={value => this.handleportfolioStatus(value, 'portfolio_status', value ? `${t('SETTINGS_PORTFOLIO_STATUS')} ${t('ON')}`: `${t('SETTINGS_PORTFOLIO_STATUS')} ${t('OFF')}`)}
                    checked={!!portfolioConfig?.portfolio_status}
                  />
                </div>
              </div>
              {!!portfolioConfig?.portfolio_status && <div>
                <div className="settings-item">
                <div className="item-name">{t('SETTINGS_PORTFOLIO_LINK')}</div>
                <div className="item-content">
                  <span className="forward-icon">
                    <XIcon type="link" iconWidth={16} iconHeight={16} />
                  </span>
                  <XInput
                    disabled={true}
                    value={portfolioConfig?.portfolio_link}
                    // onChange={e => this.handleChangeValue(e.target.value, 'portfolio_link')}
                    // onBlur={e => this.handleSave(portfolioConfig,  `${t('SETTINGS_PORTFOLIO_LINK')} ${t('UPDATED')}`)}
                    hasSuffix
                    isShowSuffix
                    suffixIcon={
                      <span className="btn-wrap">
                        <span
                          className="cancel"
                          style={{ borderLeft: '1px solid #D5D5D5' }}
                          onClick={() => this.handleLink('view')}
                        >
                          {t('VIEW')}
                        </span>
                        <span className="save" onClick={() => this.handleLink('copy')}>
                          {t('COPY')}
                        </span>
                      </span>
                    }
                  />
                </div>
              </div>
              <div className="settings-item">
                <div className="item-name">{t('SETTINGS_PORTFOLIO_TITLE')}</div>
                <div className="item-content">
                  <XSelect
                    value={portfolioConfig?.title_type}
                    options={titleOptions}
                    onChange={value => this.handleChangeValue(value.value, 'title_type',  `${t('SETTINGS_PORTFOLIO_TITLE')} ${t('UPDATED')}`)}
                  />
                  <span className="tip-msg">
                    {t('SETTINGS_PORTFOLIO_TITLE_TIP')}{' '}
                    <span className="tip-mag-link" onClick={this.handleViewLink}>{t('SETTINGS_PORTFOLIO_TITLE_TIP_LINK')}.</span>
                  </span>
                </div>
              </div>
              <div className="settings-item">
                <div className="item-name" style={{ marginTop: '-20px', marginBottom: '0px' }}>
                  {t('SETTINGS_PORTFOLIO_TEXT')}
                </div>
                <div className="item-content" style={{ marginBottom: '40px'}}>
                  <span className="tip-msg" title={t('SETTINGS_PORTFOLIO_TEXT_TIP')}>
                    {t('SETTINGS_PORTFOLIO_TEXT_TIP')}
                  </span>
                  <XTextarea
                    className="textarea"
                    rows={textareaRows}
                    maxLength={1000}
                    value={portfolioConfig?.portfolio_text}
                    onChanged={e => this.handleChangeValue(e.target.value, 'portfolio_text')}
                  />
                  {portfolioConfig?.portfolio_text && portfolioConfig?.portfolio_text.length >= 1000 && <div className='text-limit'>{t('SETTINGS_PORTFOLIO_TEXT_LIMIT')}</div>}
                  {
                    originText !== portfolioConfig?.portfolio_text &&
                    <span className="btn-wrap btn-textarea">
                      <span className="cancel" onClick={() => this.handleViewText(false)}>{t('CANCEL')}</span>
                      <span className="save" onClick={() => this.handleViewText(true)}>
                        {t('SAVE')}
                      </span>
                    </span>
                  }
                </div>
              </div>
              </div>
              }
            </div>
          }
        </div>
      </Fragment>
    );
  }
}

export default Portfolio;
