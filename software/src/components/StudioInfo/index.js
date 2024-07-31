import React, { Component } from 'react';
import { POST_STUDIO_INFO, IMAGE_SRC1 } from '@resource/lib/constants/apiUrl';
import { getOrientationAppliedStyle } from '@resource/lib/utils/exif';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import XButton from '@resource/components/XButton';
import { template, merge } from 'lodash';
import './index.scss';
import defaultLogo from './img/default-logo.png';
import AddLogoModal from './AddLogoModal';
import equals from '@resource/lib/utils/compare';
import getPuid from '@resource/websiteCommon/utils/getPuid';
import { NAME_CN_REG } from '@resource/lib/constants/reg';

class StudioInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openLogoModal: false,
      studio_name_err: '',
      phone_number_err: '',
      studio_description: ''
    };

    this.editOk = this.editOk.bind(this);
  }

  initState = () => {
    const currentStudioInfo = this.props.studioList[0] || {};
    const { studio_logo, studio_name, phone_number, studio_description, uidpk } = currentStudioInfo;
    this.setState({
      studio_logo,
      studio_name,
      phone_number,
      studio_description,
      uidpk
    });
  };

  componentDidMount() {
    this.initState();
  }

  componentDidUpdate(prevProps, prevState) {
    const isEqual = equals(this.props.studioList, prevProps.studioList);
    if (!isEqual) {
      this.initState();
    }
  }

  editCheck = () => {
    const { studio_name, phone_number, studio_description } = this.state;
    if (studio_name == '') {
      this.setState({
        studio_name_err: '请输入工作室名称'
      });
      return;
    }

    if (studio_name.length > 50) {
      this.setState({
        studio_name_err: t('TEXT_LONG_MESSAGE')
      });
      return;
    }

    if (!NAME_CN_REG.test(studio_name)) {
      this.setState({
        studio_name_err: t('TEXT_CHARACTER_MESSAGE')
      });
      return;
    }

    if (phone_number !== '' && !/^[1][2,3,4,5,6,7,8,9][0-9]{9}$/.test(phone_number)) {
      this.setState({
        phone_number_err: t('联系方式格式不正确')
      });
      return;
    }

    if (studio_description.length > 200) {
      this.setState({
        studio_description_err: t('TEXT_LONG_MESSAGE')
      });
      return;
    }

    if (!NAME_CN_REG.test(studio_description)) {
      this.setState({
        studio_description_err: t('TEXT_CHARACTER_MESSAGE')
      });
      return;
    }

    this.editOk();
  };

  editOk() {
    const { studio_logo, studio_name, phone_number, studio_description, uidpk } = this.state;
    const params = {
      uidpk,
      studio_name,
      studio_logo,
      phone_number,
      studio_description
    };
    const { boundGlobalActions } = this.props;
    const saasBaseUrl = this.props.urls.get('saasBaseUrl');
    const url = template(POST_STUDIO_INFO)({ saasBaseUrl });
    xhr
      .post(url, params)
      .then(res => {
        if (res.ret_code == 200000) {
          boundGlobalActions.addNotification({
            message: t('资料修改成功'),
            level: 'success',
            autoDismiss: 2
          });

          window.logEvent.addPageEvent({
            name: 'MyInfo_Click_ConfirmModify'
          });

          const updateData = [merge({}, this.props.studioList[0], params)];
          //更新两个store，分别是software和navber
          this.props.navbarDispatch({
            type: 'UPDATE_STUDIO_INFO',
            data: updateData
          });
          boundGlobalActions.updateStudioInfo(updateData);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleEdit = () => {
    window.logEvent.addPageEvent({
      name: 'MyInfo_Click_Modify'
    });
  };

  cancelEdit = () => {
    this.initState();
  };

  handleLogo = () => {
    this.setState({
      openLogoModal: true
    });
  };

  cancelLogo = () => {
    this.setState({
      openLogoModal: false
    });
  };

  addLogoOk = logo => {
    console.log('logo: ', logo);
    this.setState({
      studio_logo: logo.encImgId,
      orientation: logo.exifOrientation,
      openLogoModal: false
    });
  };

  render() {
    const {
      studio_name,
      studio_logo,
      openLogoModal,
      phone_number,
      studio_description,
      studio_name_err,
      phone_number_err,
      studio_description_err,
      orientation = 1
    } = this.state;
    const { userInfo, urls } = this.props;
    const addLogoModalprops = {
      cancelLogo: this.cancelLogo,
      addLogoOk: this.addLogoOk,
      urls,
      userInfo
    };

    const logoSrc = !!studio_logo
      ? template(IMAGE_SRC1)({
          encImgId: getPuid(studio_logo),
          uploadBaseUrl: urls.get('uploadBaseUrl')
        })
      : defaultLogo;

    return (
      <div className="section studio-info">
        <div className="section-title">资料设置</div>
        <div className="section-content">
          <ul>
            <li className="top-li">
              <div className="label">工作室LOGO: </div>
              <div className="logo">
                <img src={logoSrc} style={getOrientationAppliedStyle(orientation)} />
                <div className="edit" onClick={this.handleLogo}>
                  更换
                </div>
              </div>
            </li>
            <li>
              <div className="label">工作室名称: </div>
              <div className="value">
                <input
                  value={studio_name || ''}
                  onChange={e => {
                    this.setState({ studio_name: e.target.value, studio_name_err: '' });
                  }}
                  placeholder="请输入工作室简介"
                />
                <div className="err-text">{studio_name_err || ''}</div>
              </div>
            </li>
            <li>
              <div className="label">联系方式: </div>
              <div className="value">
                <input
                  value={phone_number || ''}
                  onChange={e => {
                    this.setState({ phone_number: e.target.value, phone_number_err: '' });
                  }}
                  placeholder="请输入联系方式"
                />
                <div className="err-text">{phone_number_err || ''}</div>
              </div>
            </li>
            <li>
              <div className="label">工作室简介: </div>
              <div className="value">
                <textarea
                  value={studio_description || ''}
                  onChange={e => {
                    this.setState({
                      studio_description: e.target.value,
                      studio_description_err: ''
                    });
                  }}
                  placeholder="请输入工作室简介"
                />
                <div className="err-text">{studio_description_err || ''}</div>
              </div>
            </li>
          </ul>
        </div>
        <div className="section-btn">
          <XButton
            disabled={!!studio_name_err || !!phone_number_err || !!studio_description_err}
            onClicked={this.editCheck}
          >
            {t('确认修改')}
          </XButton>
        </div>
        {openLogoModal && <AddLogoModal {...addLogoModalprops} />}
      </div>
    );
  }
}

export default StudioInfo;
