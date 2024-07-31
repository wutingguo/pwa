import React from 'react';

import { throttle } from '@resource/lib/utils/timeout';

import { NAME_CN_REG, NAME_REG, SPACE_REG } from '@resource/lib/constants/reg';

const companyNameIllegalTip = t('LOGO_BRANDING_ILLEGAL_TIP');
const companyNameUnsaveTip = t('LOGO_BRANDING_UNSAVE_TIP');
const tipsSubdomain = (that, msg, type = 0) => {
  const { boundGlobalActions } = that.props;
  boundGlobalActions.addNotification({
    message: `The subdomain "${msg}" has been taken.`,
    level: type === 0 ? 'error' : 'success',
    autoDismiss: 2,
  });
};
const didMount = that => {
  const { boundProjectActions } = that.props;
  const { getLogoBrandingDetail, get_default_brand } = boundProjectActions;
  getLogoBrandingDetail().then(res => {
    const {
      globalSettings: { companyName },
    } = that.props;
    that.setState({
      companyName: companyName,
    });
  });
  get_default_brand().then(res => {
    if (res.data) {
      that.setState({
        subdomainDefaultValue: res.data.sub_domain_prefix,
        subdomainValue: res.data.sub_domain_prefix,
        brandId: res.data.id,
        inputValue: res.data.brand_name,
        defaultValue: res.data.brand_name,
      });
    }
  });
};

const onInputChange = (e, that) => {
  const { tipContent } = that.state;
  that.setState({
    inputValue: e.target.value,
    isShowSuffix: true,
    isShowTip: e.target.value ? false : true,
    tipContent: e.target.value ? '' : tipContent,
  });
};

const onInputBlur = that => {
  const { inputValue } = that.state;
  const {
    globalSettings: { companyName },
  } = that.props;

  const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;
  const isLegal = nameReg.test(inputValue);
  const isEmptyStr = SPACE_REG.test(inputValue);
  const isShowTip = !!(inputValue && companyName != inputValue);

  let tipContent = '';
  if (isShowTip) {
    tipContent = companyNameUnsaveTip;
    if (!isLegal || isEmptyStr) {
      tipContent = companyNameIllegalTip;
    }
  }

  that.setState({
    isShowTip,
    tipContent,
  });
};
const onCancel = that => {
  window.logEvent.addPageEvent({
    name: 'MyBrand_BrandName_Click_Cancel',
  });
  const { defaultValue } = that.state;
  that.setState({
    inputValue: defaultValue,
    isShowSuffix: false,
  });
};

const onSaveName = that => {
  window.logEvent.addPageEvent({
    name: 'MyBrand_BrandName_Click_Save',
  });
  const { inputValue } = that.state;

  const nameReg = __isCN__ ? NAME_CN_REG : NAME_REG;

  const isLegal = nameReg.test(inputValue);
  const isEmptyStr = SPACE_REG.test(inputValue);
  let tipContent = '';
  if (isEmptyStr || !inputValue) {
    tipContent = 'Brand Name is required.';
  } else if (!isLegal) {
    tipContent = t('CREATE_COLLECTION_ILLEGAL_TIP');
  }
  const isShowTip = inputValue && isLegal && !isEmptyStr ? false : true;
  that.setState({
    isShowSuffix: isShowTip,
    isShowTip,
    tipContent,
  });

  if (!isShowTip) {
    //校验通过
    // onSaveNameAndImg(that, 1);
    onSaveOnlyName(that);
    // updateSettings(that, { collection_name: inputValue.trim() }, t('COLLECTION_NAME'));
  }
};
const renderSuffix = that => {
  return (
    <div className="btn-wrap">
      <span className="cancel" onClick={() => onCancel(that)}>
        {t('CANCEL')}
      </span>
      <span className="save" onClick={() => onSaveName(that)}>
        {t('SAVE')}
      </span>
    </div>
  );
};
const getCollectionNameProps = that => {
  const { inputValue, isShowTip, tipContent, isShowSuffix } = that.state;
  const collectionNameProps = {
    className: 'settings-collection-name',
    value: inputValue,
    placeholder: '',
    onChange: e => onInputChange(e, that),
    // onBlur: () => onInputBlur(that),
    hasSuffix: true,
    isShowSuffix,
    isShowTip,
    tipContent,
    maxLength: 200,
    suffixIcon: renderSuffix(that),
  };
  return collectionNameProps;
};

const uploadFileClicked = () => {};

const onUploadLogo = (files, that) => {
  const {
    boundProjectActions: { beforeUpload, uploadLogo },
    globalSettings: { image_uid },
  } = that.props;

  that.setState({
    isShowLoading: true,
    isShowLogoUnsaveTip: false,
  });

  // 再次上传前，做相关操作
  if (image_uid) {
    beforeUpload();
  }

  // 限制图片大小
  const maxSize = 50;
  const { size } = files[0];
  const fileSize = size / (1024 * 1024);
  if (fileSize > maxSize) {
    that.setState({
      isShowLoading: false,
      isShowLogoUnsaveTip: t('FILE_ERROR_EXCEEDS_50M'),
    });
    return;
  }

  uploadLogo(files)
    .then(() => {
      that.setState({
        isShowLogoUnsaveTip: t('LOGO_BRANDING_UNSAVE_TIP'),
        isShowLoading: false,
      });
      onSaveNameAndImg(that, 2);
    })
    .catch(err => {
      that.setState({
        isShowLoading: false,
      });
      console.log('err: ', err);
    });
};

const handleDeleteIcon = that => {
  const {
    boundProjectActions: { saveLogoBranding, deleteLogo },
    boundGlobalActions: { addNotification, showConfirm, hideConfirm },
    globalSettings: { companyName = '' },
  } = that.props;

  showConfirm({
    message: t('SURE_TO_DELETE_SETTING_LOGO'),
    close: () => hideConfirm(),
    buttons: [
      {
        className: 'white pwa-btn',
        text: t('CANCEL'),
        onClick: () => hideConfirm(),
      },
      {
        text: t('SLIDESHOW_DELETE'),
        className: 'pwa-btn',
        onClick: () => {
          deleteLogo();
          saveLogoBranding({ company_name: companyName, branding_logo_image: '' }).then(
            res => {
              const { ret_code, ret_msg } = res;
              addNotification({
                message: ret_code === 200000 ? t('PHOTO_DELETED') : ret_msg,
                level: 'success',
                autoDismiss: 2,
              });
            },
            err => {
              console.log('err: ', err);
            }
          );
        },
      },
    ],
  });
};
const onSaveOnlyName = that => {
  const {
    boundProjectActions: { saveOnlyBrandName },
    boundGlobalActions: { addNotification },
  } = that.props;
  const { inputValue, brandId } = that.state;
  saveOnlyBrandName({
    brand_id: brandId,
    brand_name: inputValue,
  }).then(
    res => {
      const { ret_code, ret_msg } = res;
      that.setState({
        defaultValue: inputValue,
      }); //保持brand name 默认值和最新值保持同步
      addNotification({
        message: ret_code === 200000 ? 'Brand Name updated.' : ret_msg,
        level: 'success',
        autoDismiss: 2,
      });
    },
    err => {
      console.log('err: ', err);
    }
  );
};
const onSaveNameAndImg = (that, type) => {
  // type 1是name 2 是logo
  const {
    boundProjectActions: { saveLogoBranding, deleteLogo },
    boundGlobalActions: { addNotification, showConfirm, hideConfirm },
    globalSettings: { enc_image_uid = '' },
  } = that.props;
  const { companyName } = that.state;
  saveLogoBranding({ company_name: companyName, branding_logo_image: enc_image_uid }).then(
    res => {
      const { ret_code, ret_msg } = res;
      // that.setState({
      //   defaultValue: inputValue,
      // });

      addNotification({
        message:
          ret_code === 200000
            ? type > 1
              ? 'Brand Logo updated.'
              : 'Brand Name updated.'
            : ret_msg,
        level: 'success',
        autoDismiss: 2,
      });
    },
    err => {
      console.log('err: ', err);
    }
  );
};
export {
  didMount,
  getCollectionNameProps,
  uploadFileClicked,
  onUploadLogo,
  handleDeleteIcon,
  tipsSubdomain,
};
