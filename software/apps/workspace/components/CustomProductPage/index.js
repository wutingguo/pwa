import React, { Component, memo } from 'react';
import classNames from 'classnames';
import { get, isEmpty, isEqual } from 'lodash';
import Create from '@resource/components/pwa/XCustomProductCreate';
import CreateUS from '../../components/en/XCustomProductCreateUS';
import {
  formInitialValue,
  customSettingKey
} from '@resource/components/pwa/XCustomProductCreate/config';
import CustomProductList from './List';
// import { formInitialValue, customSettingKey } from './config';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import XModal from '../XModal';
import { buildUrlParmas } from '../../utils/url';
import { template } from '../../utils/template';
import { navigateToWwwOrDesigner } from '@resource/lib/utils/history';
import {
  OPEN_DESIGNER_APP,
  OPEN_DESIGNER_APP_US,
  NEW_CUSTOME_CATEGORY_LIST,
  NEW_CUSTOME_PRODUCT_LIST,
  NEW_CUSTOME_PRODUCT_MAP
} from '../../constants/apiUrl';
import { getLanguageCode } from '@resource/lib/utils/language';
import { customerSpreadsType } from '@resource/lib/constants/strings';

const EmptyContent = memo(() => (
  <div className="custom-product-empty-content">{t('NONE_SELECTED_CUSTOM_PRODUCT_MESSAGE')}</div>
));

export class CustomProductPage extends Component {
  constructor(props) {
    super(props);
    const { treeData } = props.labs;
    let currentValue;
    if (Array.isArray(treeData)) {
      currentValue = get(treeData, [0, 'children', 1, 'key']);
    }
    this.state = {
      isCreate: false,
      currentValue, // 当前选中的自定义产品
      currentData: this.getCurrentDataByValue(currentValue),
      saveDisabled: false
    };
    this.handleMakcClick = this.handleMakcClick.bind(this);
    this.handleConfirmMack = this.handleConfirmMack.bind(this);
  }
  componentDidMount() {
    this.getCategoryList();
  }

  componentDidUpdate(preProps) {
    const { treeData } = this.props.labs;
    const { treeData: preTreeData } = preProps.labs;
    if (!isEqual(treeData, preTreeData) && Array.isArray(treeData)) {
      const currentValue = get(treeData, [0, 'children', 1, 'key']);
      this.setState(
        {
          currentValue
        },
        () => {
          if (!preTreeData.length) {
            this.handleSelect(currentValue);
          }
        }
      );
    }
  }

  handleMakcClick(e) {
    const event = e || window.event;
    const { currentValue } = this.state;
    const makeData = this.getCurrentDataByValue(currentValue);
    window.logEvent.addPageEvent({
      name: 'CreatNewProject_Click_Start',
      lab_type: 'Labs_type',
      category: makeData.category_id,
      projectName: makeData.product_name
    });

    const { boundGlobalActions } = this.props;
    if (!currentValue) {
      const { showConfirm, hideConfirm } = boundGlobalActions;
      const data = {
        message: t('PLESE_SELECT_PRODUCT'),
        close: () => hideConfirm(),
        buttons: [
          {
            text: t('OK'),
            className: 'pwa-btn',
            onClick: hideConfirm()
          }
        ]
      };
      showConfirm(data);
    } else {
      this.handleConfirmMack();
    }

    event.preventDefault();
    return false;
  }

  handleConfirmMack() {
    const { currentValue } = this.state;
    const makeData = this.getCurrentDataByValue(currentValue);
    const languageCode = getLanguageCode();
    const pageStep = 2;

    let title = makeData.product_name;
    if (!title) {
      title = t('DEFAULT_TITLE');
    }

    let countSheet = makeData[customSettingKey.pages];
    if (makeData[customSettingKey.spreadsType] === customerSpreadsType.singleFirstLast) {
      countSheet += 1;
    }

    const addParams = buildUrlParmas(
      {
        product_code: currentValue,
        countPages: countSheet * pageStep
      },
      false
    );
    const staticUrl = __isCN__ ? OPEN_DESIGNER_APP : OPEN_DESIGNER_APP_US;
    const url = template(staticUrl, { packageType: 'single', languageCode, title }) + addParams;
    // navigateToWwwOrDesigner(url);
    location.href = url;
  }

  getFormRef = node => {
    this.formRef = node;
    this.forceUpdate();
  };
  getCurrentDataByValue(value) {
    const { allProducts = {} } = this.props.labs;
    const currentData = allProducts[value] || {};
    if (currentData[customSettingKey.spreadsType] === customerSpreadsType.singleFirstLast) {
      return {
        ...currentData,
        [customSettingKey.pages]: currentData[customSettingKey.pages] - 1
      };
    }
    return currentData;
  }
  handleSelect = value => {
    const { treeData } = this.props.labs;
    let currentValue;
    if (!value) {
      value = get(treeData, [0, 'children', 0, 'key']);
    }
    currentValue = Array.isArray(value) ? value[0] : value;
    const currentData = this.getCurrentDataByValue(currentValue);
    if (isEmpty(currentData)) {
      this.setState(() => ({
        isCreate: false,
        currentValue: null,
        currentData: {}
      }));
      return;
    }
    this.setState(
      () => ({
        isCreate: false,
        currentValue,
        currentData
      }),
      () => {
        this.formRef && this.formRef.resetFields();
      }
    );
  };
  handleCreate = () => {
    window.logEvent.addPageEvent({
      name: 'DesignerLabs_Click_Create'
    });
    const { categoryList } = this.props.labs;
    const defaultCategory = get(categoryList, [0, 'value']);
    this.setState(
      () => ({
        isCreate: true,
        currentValue: null,
        currentData: formInitialValue(defaultCategory)
      }),
      () => {
        this.formRef && this.formRef.resetFields();
      }
    );
  };
  handleConfirmDelete = () => {
    window.logEvent.addPageEvent({
      name: 'DesignerLabs_Click_Delete'
    });
    const {
      boundProjectActions: { deleteLab }
    } = this.props;
    const { currentValue } = this.state;
    deleteLab({ product_code: currentValue }).then(() => {
      this.getTreeDate().then(() => {
        this.handleSelect();
      });
    });
  };
  handleDelete = e => {
    e.stopPropagation();
    const { boundGlobalActions } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const data = {
      title: t('LABS_DELETE'),
      message: t('ACTION_CANNOT_BE_UNDONE'),
      close: () => hideConfirm(),
      buttons: [
        {
          text: t('CANCEL'),
          className: 'pwa-btn white'
        },
        {
          text: t('DELETE'),
          className: 'pwa-btn',
          onClick: this.handleConfirmDelete
        }
      ]
    };
    showConfirm(data);
  };
  showVerifyModal() {
    const { boundGlobalActions } = this.props;
    const { showConfirm, hideConfirm } = boundGlobalActions;
    const data = {
      message: t('VERIFY_TEMPLATE_BEFORE_SAVE_LAB'),
      close: hideConfirm,
      buttons: [
        {
          text: t('OK'),
          className: 'pwa-btn',
          onClick: hideConfirm
        }
      ]
    };
    showConfirm(data);
  }
  onSubmit = async (values, sizeValue) => {
    const {
      boundProjectActions: { createLab }
    } = this.props;
    this.setState(() => ({
      saveDisabled: true
    }));
    createLab(values).then(res => {
      const { product_code: key } = res.data || {};
      this.getTreeDate().then(() => {
        this.handleSelect(key);
        this.setState(() => ({
          saveDisabled: false
        }));
      });
    });
  };
  getCustomProductsList = () => {};

  getTreeDate = () => {
    const {
      boundProjectActions: { getLabList, updateLabState },
      userInfo
    } = this.props;
    const customerId = userInfo.get('uidPk') || '';
    console.log('customerId: ', customerId);
    if (!customerId) {
      return;
    }
    const url = template(NEW_CUSTOME_PRODUCT_MAP, {
      baseUrl: this.getWWWorigin('galleryBaseUrl'),
      labId: '0',
      customerId
    });
    return xhr.get(url).then(result => {
      const productsList = result.data
        ? result.data.map(item => {
            const product_list = item.product_list ? item.product_list : [];
            const lists = product_list.map(list =>
              Object.assign({}, list, { category_id: item.id })
            );
            return Object.assign({}, item, { products: lists });
          })
        : [];
      updateLabState({
        listData: productsList
      });
      return productsList;
    });
  };
  getWWWorigin(key) {
    const { envUrls } = this.props;
    if (key) {
      return envUrls.get(key);
    }
    return envUrls.get('baseUrl');
  }
  getCategoryList = () => {
    const {
      boundProjectActions: { updateLabState }
    } = this.props;
    const url = template(NEW_CUSTOME_CATEGORY_LIST, {
      baseUrl: this.getWWWorigin('galleryBaseUrl'),
      labId: '0'
    });

    xhr.get(url).then(res => {
      if (res.data) {
        const categoryList = res.data.map(item => {
          return {
            category_code: item.id,
            category_id: item.id,
            category_name: item.category_name
          };
        });
        setTimeout(() => {
          this.getTreeDate();
        }, 600);
        updateLabState({
          categoryList
        });
      }
    });
  };

  closeFormModal = () => {
    this.setState(
      {
        isCreate: false
      },
      () => {
        this.formRef && this.formRef.resetFields();
      }
    );
  };

  render() {
    const { categoryList, productNameList, treeData } = this.props.labs;
    const { isCreate, saveDisabled, currentValue, currentData } = this.state;
    const listProps = {
      treeData,
      currentValue,
      onSelect: this.handleSelect,
      onCreate: this.handleCreate,
      onDelete: this.handleDelete
    };
    const formClass = classNames({
      hide: !currentValue && !isCreate
    });
    const createFormProps = {
      className: formClass,
      isCreate,
      saveDisabled,
      categoryList,
      productNameList,
      initialValues: currentData,
      formRef: this.formRef,
      getFormRef: this.getFormRef,
      onSubmit: this.onSubmit,
      closeFormModal: this.closeFormModal
    };
    const xmodalProps = {
      data: {
        className: 'create-form-modal',
        isHideIcon: false
      },
      actions: {
        handleClose: () => this.closeFormModal()
      }
    };
    return (
      <div className="custom-product-page-wrapper">
        <CustomProductList {...listProps} />
        {!isCreate &&
          (__isCN__ ? <Create {...createFormProps} /> : <CreateUS {...createFormProps} />)}
        {isCreate && (
          <XModal {...xmodalProps}>
            {__isCN__ ? <Create {...createFormProps} /> : <CreateUS {...createFormProps} />}
          </XModal>
        )}
        {!currentValue && !isCreate ? <EmptyContent /> : null}
      </div>
    );
  }
}

export default CustomProductPage;
