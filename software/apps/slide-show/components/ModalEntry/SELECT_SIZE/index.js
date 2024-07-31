import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isFunction } from 'lodash';
import { saasProducts } from '@resource/lib/constants/strings';
import { XModal, XPureComponent, XInput, XTextarea, XIcon } from '@common/components';
import { NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';
import './index.scss';
import { select } from 'react-cookies';

class SELECT_SIZE extends XPureComponent {
  constructor(props) {
    super(props);

    this.state = {
      definition: 0,
      showTips: false
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const downLoadSettingData = data.get('downLoadSettingData').toJS();
    const { download_resolution_size } = downLoadSettingData;
    if (download_resolution_size) {
      this.setState({ definition: download_resolution_size });
    }
  }

  componentWillReceiveProps(nextProps) {}

  handleSelectResolution = definition => {
    this.setState({
      definition
    });
  };

  handleUpgrade = upgradeNum => {
    window.logEvent.addPageEvent({
      name:
        upgradeNum === 2
          ? 'SlideshowDownloadSizeSelectPop_Click_Upgrade1'
          : 'SlideshowDownloadSizeSelectPop_Click_Upgrade2'
    });
    let level = upgradeNum === 2 ? 20 : 40;
    location.href = `/saascheckout.html?level=${level}&from=saas&product_id=${saasProducts.slideshow}`;
  };
  // 渲染单选按钮
  renderResolution = ({ resolutionData }) => {
    // console.log("resolutionData...", resolutionData)
    const { definition } = this.state;
    // console.log("renderResolution---downLoadSettingData....",downLoadSettingData)
    let showUpgrade = false;
    return (
      <div className="resolution-wrap">
        {resolutionData.map((resolution, index) => {
          if (index === 0) {
            const id = resolution.get('id');
            const enable = resolution.get('enable');
            const HDname = resolution.get('name');
            const options = resolution.get('options');
            showUpgrade = !enable;
            return (
              <div className="HD-wrap" key={id || HDname}>
                {enable ? (
                  options.map((option, index) => {
                    const id = option.get('id');
                    const name = option.get('name');
                    let iconStatus = '';
                    if (definition === id) {
                      iconStatus = 'active';
                    }
                    return (
                      <div className="rad-item">
                        <XIcon
                          id={id}
                          key={id}
                          type="radio"
                          text={`${HDname}-${name}`}
                          status={iconStatus}
                          onClick={() => this.handleSelectResolution(id)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="hd-disable">
                    <XIcon
                      key={id}
                      type="radio"
                      text={enable ? name : t('ACCOUNT_UPGRADE_REQUIRED', { name: HDname })}
                      status={enable ? '' : 'disable'}
                    />
                    <span
                      className="upgrade-link"
                      onClick={() => {
                        this.handleUpgrade(2);
                      }}
                    >
                      {t('SLIDESHOW_SHARE_UPGRADE')}
                    </span>
                  </div>
                )}
              </div>
            );
          } else if (index === 1) {
            // 4k
            const id = resolution.get('id');
            // const videoStatus = makeVideoStatus && makeVideoStatus.get(String(id));
            const enable = resolution.get('enable');
            const name = resolution.get('name');
            showUpgrade = !enable;

            // const isPublished = slideshowStatus > 2;
            let iconStatus = '';
            if (definition === id) {
              iconStatus = 'active';
            }
            return (
              <div className="fourK-wrap">
                <XIcon
                  key={id}
                  type="radio"
                  text={enable ? name : t('ACCOUNT_UPGRADE_REQUIRED', { name })}
                  status={!enable ? 'disable' : iconStatus}
                  onClick={() => this.handleSelectResolution(id)}
                />
                {showUpgrade ? (
                  <span
                    className="upgrade-link"
                    onClick={() => {
                      this.handleUpgrade(4);
                    }}
                  >
                    {t('SLIDESHOW_SHARE_UPGRADE')}
                  </span>
                ) : null}
              </div>
            );
          }
        })}
      </div>
    );
  };

  handleSave = () => {
    const { definition, showTips } = this.state;
    const { data } = this.props;
    const save = data.get('save');
    if (!definition) {
      this.setState({
        showTips: true
      });
      return;
    }
    save(definition);
  };

  render() {
    const { data } = this.props;
    // console.log('模板弹窗this.state///', this.state);
    const { definition, showTips } = this.state;
    const close = data.get('onClosed');
    const resolutionData = data.get('resolutionData');
    const save = data.get('save');

    const wrapClass = classNames('select-size-wrap', data.get('className'));

    const sty = data.get('style');
    const style = sty ? sty.toJS() : {};

    const escapeClose = !!data.get('escapeClose');
    const isHideIcon = !!data.get('isHideIcon');

    console.log('resolutionData......', resolutionData.toJS());
    const resolutionDataNew = resolutionData.toJS();

    return (
      <XModal
        className={wrapClass}
        styles={style}
        opened={true}
        onClosed={close}
        escapeClose={escapeClose}
        isHideIcon={isHideIcon}
      >
        <div className="modal-title-select">
          Select a size your clients are allowed to download.
        </div>
        <div className="modal-body-size">
          {resolutionData.size ? this.renderResolution({ resolutionData }) : null}
          {showTips ? <div className="tips-info">You haven't selected a size.</div> : null}
        </div>

        {resolutionDataNew && resolutionDataNew.length && resolutionDataNew.some(i => i.enable) ? (
          <div className="save" onClick={this.handleSave}>
            Confirm
          </div>
        ) : null}
      </XModal>
    );
  }
}

SELECT_SIZE.propTypes = {
  data: PropTypes.object.isRequired
};

SELECT_SIZE.defaultProps = {};

export default SELECT_SIZE;
