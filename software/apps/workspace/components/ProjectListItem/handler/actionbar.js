import React from 'react';
import { buildUrlParmas } from '../../../utils/url';
import { disableCopyList, newSuiteTypes } from '../../../constants/strings';
import { getLanguageCode } from '@resource/lib/utils/language';
import XLink from '@resource/components/XLink';
import * as helper from '@resource/lib/project/helper';
import { comboSetTypes } from '@resource/lib/constants/strings';
import editIcon from '../icons/r-edit.png';
import previewIcon from '../icons/preview.png';
import shareIcon from '../icons/share.png';
import shoppingIcon from '../icons/shopping.png';
import moreIcon from '../icons/more.png';
import exportIcon from '../icons/export.png';

export const getLinkParams = that => {
  const { itemData, isSubProject, suiteId } = that.props;
  const {
    isVirtualType,
    projectId,
    specJson,
    linkUrl,
    uidPk,
    isInOrder,
    isInCart,
    productDisplayName,
    productType,
    editStatus,
    checkStatus,
    orderStatusName
  } = itemData;

  const isShowLink = true;

  const languageCode = getLanguageCode();

  const virtualProjectGuid = isSubProject ? suiteId : projectId;
  const packageType = isVirtualType || isSubProject ? 'package' : 'single';
  const urlQueryObj = {
    initGuid: projectId,
    virtualProjectGuid,
    packageType,
    languageCode
  };

  const urlQueryString = buildUrlParmas(urlQueryObj, false);
  // const editorUrl =  `/prod-assets/app/cxeditor/index.html?from=saas${urlQueryString}`;
  // let productLinkUrl = `${editorUrl}${urlQueryString}`;
  // if (!productLinkUrl.startsWith('/')) {
  //   productLinkUrl = `/${productLinkUrl}`;
  // }
  let productLinkUrl = `/prod-assets/app/cxeditor/index.html?from=saas${urlQueryString}`;
  let productAutoFixLinkUrl = `/prod-assets/app/cxeditor/index.html?from=saas&autofix=true${urlQueryString}`;

  let displayText = '编辑';
  if (isSubProject) {
    displayText = checkStatus != 2 && isInOrder ? '' : checkStatus == 2 && isInOrder ? '编辑' : '';
  } else {
    displayText =
      checkStatus != 2 && isInOrder && orderStatusName !== '订单已取消'
        ? '预览'
        : checkStatus == 2 && isInOrder
        ? '编辑'
        : '编辑';
  }
  if (checkStatus != 2 && isInOrder && orderStatusName !== '订单已取消') {
    // productLinkUrl = `${productLinkUrl}&isPreview=true`;
    productLinkUrl = `${productLinkUrl}`;
  }

  return {
    isShowLink,
    linkUrl: productLinkUrl,
    autofixlinkUrl: productAutoFixLinkUrl,
    displayText,
    editIcon: displayText === '编辑' ? editIcon : previewIcon
  };
};

const getVirtualProductActions = that => {
  const { itemData } = that.props;
  const { showMoreDownBox } = that.state;

  const { isInOrder, checkStatus, productType } = itemData;

  const actionBarList = [];
  const actionSubBarList = [];
  const newComboSets = [].concat.apply(Object.values(comboSetTypes), newSuiteTypes);
  const isBelongToNewSuit = newComboSets.indexOf(productType) !== -1;

  if (isBelongToNewSuit) {
    const linkParams = getLinkParams(that);
    actionBarList.push(
      <XLink className="actionbar-item" onClick={() => that.onEditClick(linkParams.linkUrl)}>
        <img src={linkParams.editIcon} />
        {linkParams.displayText}
      </XLink>
    );
  }

  const isYSProduct = productType.includes('V2_YS_');
  // 加入购物车的按钮
  // 打回的订单和寸心艺术的订单不能加入购物车
  if (checkStatus !== 2 && !isYSProduct) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.onAddToCart}>
        <img src={shoppingIcon} />
        加购
      </div>
    );
  }

  if (isBelongToNewSuit) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.showShareModal}>
        <img src={shareIcon} />
        分享
      </div>
    );
  }

  if (!isInOrder) {
    actionSubBarList.push(
      <div className="actionbar-item" onClick={that.deleteProject}>
        删除
      </div>
    );
  } else {
    actionSubBarList.push(<div className="actionbar-item disable">删除</div>);
  }

  if (!isBelongToNewSuit) {
    actionSubBarList.push(
      <div className="actionbar-item" onClick={that.showCloneProjectModal}>
        复制套系
      </div>
    );
  }

  if (actionSubBarList.length > 0) {
    actionBarList.push(
      <div
        className="actionbar-item"
        onMouseEnter={that.showMoreDown}
        onMouseLeave={that.hideMoreDown}
      >
        <img src={moreIcon} className="more-icon" />
        更多
        {showMoreDownBox && <div className="actionbar-more-dowm">{actionSubBarList}</div>}
      </div>
    );
  }

  return actionBarList;
};


const getNormalProjectActions = that => {
  const { itemData } = that.props;
  const { showMoreDownBox } = that.state;

  const { isInOrder, checkStatus, productType, orderStatus } = itemData;

  const isThirdProject = helper.checkIsThirdProject(productType);
  const isBook = itemData.productCode.split('_')[0] === 'PB';
  const actionBarList = [];
  const actionSubBarList = [];
  // 打开项目的按钮
  const linkParams = getLinkParams(that);
  if (linkParams.isShowLink) {
    actionBarList.push(
      <XLink className="actionbar-item" onClick={() => that.onEditClick(linkParams.linkUrl)}>
        <img src={linkParams.editIcon} />
        {linkParams.displayText}
      </XLink>
    );
  }

  if (isThirdProject) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.onExport}>
        <img src={exportIcon} />
        导出
      </div>
    );
  }

  const isYSProduct = productType && productType.includes('V2_YS_');
  // 加入购物车的按钮
  // 打回的订单和寸心艺术的订单不能加入购物车
  if (checkStatus !== 2 && !isYSProduct && !isThirdProject) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.onAddToCart}>
        <img src={shoppingIcon} />
        加购
      </div>
    );
  }

  // 删除项目的按钮
  if (!isInOrder) {
    actionSubBarList.push(
      <div className="actionbar-item" onClick={that.deleteProject}>
        删除
      </div>
    );
  } else {
    actionSubBarList.push(<div className="actionbar-item disable">删除</div>);
  }

  // 实物订单的导出按钮 仅支持已支付的单册
  if (!isThirdProject && isBook && isInOrder && orderStatus !== 'UNPAID' && orderStatus !== "1") {
    actionSubBarList.push(
      <div className="actionbar-item" onClick={that.onExport}>
        导出
      </div>
    );
  }

  // 分享项目的按钮
  actionBarList.push(
    <div className="actionbar-item" onClick={that.showShareModal}>
      <img src={shareIcon} />
      分享
    </div>
  );

  if (actionSubBarList.length > 0) {
    actionBarList.push(
      <div
        className="actionbar-item"
        onMouseEnter={that.showMoreDown}
        onMouseLeave={that.hideMoreDown}
      >
        <img src={moreIcon} className="more-icon" />
        更多
        {showMoreDownBox && <div className="actionbar-more-dowm">{actionSubBarList}</div>}
      </div>
    );
  }

  return actionBarList;
};

const noNeedAddToCartList = [
  // 真皮盒子, 需要核对价格后再放开.
  'V2_GENUINELEATHERCOVERBOX'
];

export const getRenderActionbar = that => {
  const { itemData, isSubProject } = that.props;

  const { isVirtualType, isOffLine, isStandard, projectId, productType } = itemData;

  // 产品已经下线，不显示操作条
  if (isOffLine) return null;

  const actionBarList = [];

  const isIgnore = !!noNeedAddToCartList.find(m => m === productType);
  // 如果是标品， 只显示加入购物车选项
  if (isStandard && !isSubProject) {
    if (isSubProject) {
      return [];
    }
    if (!isIgnore) {
      actionBarList.push(
        <div className="actionbar-item" onClick={that.onAddToCart}>
          <img src={shoppingIcon} />
          加购
        </div>
      );
    }
    return actionBarList;
  }

  if (isVirtualType) {
    return getVirtualProductActions(that);
  }

  if (isSubProject) {
    return null;
  }

  return getNormalProjectActions(that);
};
