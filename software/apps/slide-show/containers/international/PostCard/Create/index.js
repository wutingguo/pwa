import React from 'react';
import classNames from 'classnames';
import { is, fromJS } from 'immutable';
import { withRouter } from 'react-router';
import { XPureComponent } from '@common/components';
import Validator from '@resource/lib/utils/Validator';
import XRadio from '@resource/components/XRadio';
import UploadBox from './components/UploadBox';
import { getSlideShowImageUrl } from '@resource/lib/saas/image';
import XCascader from '@resource/websiteCommon/components/dom/XCascader';
import './index.scss';

const defaultPostDetail = {
  card_name: '',
  studio_name: '',
  studio_introduction: '',
  studio_address: '',
  weibo_account: '',
  weichat_account: '',
  official_website: '',
  official_logo_image: '',
  official_qr_code: '',
  is_default: true
};

class PostCardCreate extends XPureComponent {
  constructor(props) {
    super(props);
    this.form = null;
    const { postCardDetail } = props;
    this.state = {
      warnText: '',
      isShowWarn: false,
      enableSubmitButton: true,
      postCardDetail: postCardDetail.toJS()
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handelRadioChange = this.handelRadioChange.bind(this);
    this.createPostCard = this.createPostCard.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSelectAddress = this.handleSelectAddress.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { id }
      },
      postCardList,
      boundProjectActions
    } = this.props;
    if (id) {
      const postCardDetail = postCardList.find(el => el.get('id') === Number(id));
      if (postCardDetail) {
        boundProjectActions.setPostCardDetail(postCardDetail);
      } else {
        boundProjectActions.getPostCardDetail(id);
      }
    } else {
      boundProjectActions.setPostCardDetail(fromJS(defaultPostDetail));
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldPostCardDetail = this.props.postCardDetail;
    const newPostCardDetail = nextProps.postCardDetail;
    if (!is(oldPostCardDetail, newPostCardDetail) && newPostCardDetail) {
      this.setState({
        postCardDetail: newPostCardDetail.toJS()
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { postCardDetail } = this.state;
    const {
      official_logo_image,
      official_qr_code,
      studio_address,
      weibo_account,
      weichat_account,
      official_website
    } = postCardDetail;

    const errorMsg = this.validatorFunc();
    if (!errorMsg) {
      if (!official_logo_image) {
        this.setState({
          isShowWarn: true,
          warnText: '请上传工作室LOGO'
        });
        return;
      }
      if (!official_qr_code) {
        this.setState({
          isShowWarn: true,
          warnText: '请上传工作室二维码'
        });
        return;
      }
      if (!studio_address) {
        this.setState({
          isShowWarn: true,
          warnText: '请填写完整地址'
        });
        return;
      }
      if(!weibo_account && !weichat_account && !official_website) {
        this.setState({
          isShowWarn: true,
          warnText: '微博账号、微信账号、官方网站请选择其中一个'
        });
        return;
      }
      this.setState({
        isShowWarn: false
      });
      this.createPostCard(postCardDetail);
    } else {
      this.setState({
        warnText: errorMsg,
        isShowWarn: true
      });
    }
  }

  createPostCard(params) {
    const { boundProjectActions, boundGlobalActions, history } = this.props;
    const { addNotification } = boundGlobalActions;

    boundProjectActions.createPostCard(params).then(res => {
      if (res.ret_code === 200000 && res.data) {
        addNotification({
          message: t('ADD_POST_CARD_SUCCESS'),
          level: 'success',
          autoDismiss: 2
        });
        return history.push('/software/slide-show/post-card');
      }
    });
  }

  validatorFunc() {
    const validator = new Validator();
    const Form = this.form;
    if (Form) {
      validator.add(Form.card_name, [
        {
          strategy: 'isNonEmpty',
          errorMsg: '名片不能为空'
        },
        {
          strategy: 'maxLength:50',
          errorMsg: '名片名称不能超过50个字符'
        }
      ]);
      validator.add(Form.studio_name, [
        {
          strategy: 'isNonEmpty',
          errorMsg: '工作室不能为空'
        },
        {
          strategy: 'maxLength:50',
          errorMsg: '工作室名称不能超过50个字符'
        }
      ]);
      validator.add(Form.studio_introduction, [
        {
          strategy: 'isNonEmpty',
          errorMsg: '工作室介绍不能为空'
        },
        {
          strategy: 'maxLength:200',
          errorMsg: '工作室介绍不能超过200个字符'
        }
      ]);
      validator.add(Form.studio_address, [
        {
          strategy: 'isNonEmpty',
          errorMsg: '工作室地址不能为空'
        }
      ]);
      validator.add(Form.weibo_account, [
        {
          strategy: 'maxLength:50',
          errorMsg: '微博账号不能超过50个字符'
        }
      ]);
      validator.add(Form.weichat_account, [
        {
          strategy: 'maxLength:50',
          errorMsg: '微信账号不能超过50个字符'
        }
      ]);
      validator.add(Form.official_website, [
        {
          strategy: 'maxLength:50',
          errorMsg: '官方网站不能超过50个字符'
        }
      ]);

      return validator.start();
    }
  }

  handleChange(e) {
    const { boundProjectActions } = this.props;
    const target = e.target;
    const name = target.name;
    const value = target.value;

    boundProjectActions.changePostCardDetail({
      field: {
        name,
        value
      }
    });
  }

  handelRadioChange(val) {
    const { boundProjectActions } = this.props;
    boundProjectActions.changePostCardDetail({
      field: {
        name: 'is_default',
        value: val
      }
    });
  }

  handleSelectAddress(address) {
    const { boundProjectActions } = this.props;
    const { province, city, area, street } = address;
    boundProjectActions.changePostCardDetail({
      field: {
        name: 'studio_address',
        value: `${province} | ${city} | ${area}`
      }
    });
  }
  handleCancel() {
    const { history } = this.props;
    history.push('/software/slide-show/post-card');
  }

  render() {
    const { isShowWarn, warnText, postCardDetail } = this.state;
    const {
      card_name,
      is_default,
      studio_name,
      weibo_account,
      studio_address,

      official_qr_code,
      weichat_account,
      official_website,
      official_logo_image,
      studio_introduction
    } = postCardDetail;
    const { urls, baseUrl, boundGlobalActions, boundProjectActions } = this.props;
    const submitButtonClassName = classNames('submit-button');
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const logoImgUrl = getSlideShowImageUrl({
      galleryBaseUrl,
      enc_image_uid: official_logo_image,
      isWaterMark: false
    });
    const qrCodeImgUrl = getSlideShowImageUrl({
      galleryBaseUrl,
      enc_image_uid: official_qr_code,
      isWaterMark: false
    });
    const uploadBoxProps1 = {
      baseUrl,
      label: '工作室LOGO',
      name: 'official_logo_image',
      imgUrl: logoImgUrl,
      boundGlobalActions,
      boundProjectActions
    };
    const uploadBoxProps2 = {
      baseUrl,
      label: '工作室二维码',
      name: 'official_qr_code',
      imgUrl: qrCodeImgUrl,
      boundGlobalActions,
      boundProjectActions
    };
    return (
      <div className="post-card-wrapper">
        <div className="form-container">
          <form onSubmit={this.onSubmit} ref={node => (this.form = node)} id="form">
            <div className="input-container">
              <span className="label">
                名片名称<span className="red">*</span>
              </span>
              <input
                type="text"
                value={card_name}
                name="card_name"
                onChange={this.handleChange}
                placeholder="请输入名片名称"
              />
            </div>
            <div className="input-container">
              <span className="label">
                工作室名称<span className="red">*</span>
              </span>
              <input
                type="text"
                value={studio_name}
                name="studio_name"
                onChange={this.handleChange}
                placeholder="请输入工作室名称"
              />
            </div>
            <div className="input-container question-container">
              <span className="label">
                工作室介绍<span className="red">*</span>
              </span>
              <textarea
                name="studio_introduction"
                value={studio_introduction}
                onChange={this.handleChange}
                placeholder="请输入工作室介绍"
              ></textarea>
            </div>
            <div className="input-container address-container">
              <span className="label">
                工作室所在地<span className="red">*</span>
              </span>
              <XCascader
                selectComplete={this.handleSelectAddress}
                placeholder="所属地区：省/市/区"
                name="studio_address"
                value={studio_address}
                baseUrl={baseUrl}
              />
            </div>
            <div className="input-container">
              <span className="label">微博账号: </span>
              <input
                type="text"
                name="weibo_account"
                value={weibo_account}
                onChange={this.handleChange}
                placeholder="请输入微博账号"
              />
            </div>
            <div className="input-container">
              <span className="label">微信账号 </span>
              <input
                type="text"
                name="weichat_account"
                value={weichat_account}
                onChange={this.handleChange}
                placeholder="请输入微信账号"
              />
            </div>
            <div className="input-container">
              <span className="label">官方网站 </span>
              <input
                type="text"
                name="official_website"
                value={official_website}
                onChange={this.handleChange}
                placeholder="请输入官方网站"
              />
            </div>
            <div className="input-container">
              <span className="label">是否为默认名片 </span>
              <XRadio
                name="is_default"
                className="post-card-radio"
                skin="black"
                checked={is_default === true}
                onClicked={this.handelRadioChange}
                value={true}
                text="是"
              />
              <XRadio
                name="is_default"
                className="post-card-radio"
                skin="black"
                onClicked={this.handelRadioChange}
                checked={is_default === false}
                value={false}
                text="否"
              />
            </div>
            <div className="upload-list">
              <UploadBox {...uploadBoxProps1} />
              <UploadBox {...uploadBoxProps2} />
            </div>

            {isShowWarn ? <div className="warn-text">{warnText}</div> : null}
            <div className="form-bottom">
              <div className="cancel-button" onClick={this.handleCancel}>
                取消
              </div>
              <div className={submitButtonClassName} onClick={this.onSubmit}>
                保存
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(PostCardCreate);
