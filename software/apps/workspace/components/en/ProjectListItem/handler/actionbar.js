import React from 'react';
import { buildUrlParmas } from '../../../../utils/url';
import { disableCopyList } from '../../../../constants/strings';
import { getLanguageCode } from '@resource/lib/utils/language';
import XLink from '@resource/components/XLink';
import { checkIsThirdProject } from '@resource/lib/project/helper';

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
    checkStatus
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
  let productLinkUrl = `/prod-assets/app/cxeditor/index.html?from=saas${urlQueryString}`;
  let logEventName = 'DesignerProjectList_Click_Continue';
  let productAutoFixLinkUrl = `/prod-assets/app/cxeditor/index.html?from=saas&autofix=true${urlQueryString}`;

  let displayText = t('CONTINUE');
  if (isSubProject) {
    displayText =
      checkStatus != 2 && isInOrder ? '' : checkStatus == 2 && isInOrder ? t('EDIT') : '';
  } else {
    displayText =
      checkStatus != 2 && isInOrder
        ? t('VIEW')
        : checkStatus == 2 && isInOrder
        ? t('EDIT')
        : t('CONTINUE');
  }

  return {
    isShowLink,
    linkUrl: productLinkUrl,
    autofixlinkUrl: productAutoFixLinkUrl,
    displayText,
    logEventName
  };
};

const getVirtualProductActions = that => {
  const { itemData } = that.props;

  const { isInOrder, checkStatus, productType } = itemData;

  const actionBarList = [];

  //套系的子项目出现打回的状态，主item也不能order了
  const isMainItemRejected =
    itemData.subProjectList.find(subItem => subItem.checkStatus === 2) || checkStatus === 2;
  if (!isMainItemRejected) {
    const linkParams = getLinkParams(that);
    actionBarList.push(
      <XLink
        className="actionbar-item"
        onClick={() => that.onEditClick(linkParams.linkUrl, linkParams.logEventName)}
      >
        {linkParams.displayText}
      </XLink>
    );
  }

  const isYSProduct = productType && productType.includes('V2_YS_');

  // 打回的订单和寸心艺术的订单不能加入购物车
  if (!isMainItemRejected && !isYSProduct) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.onAddToCart}>
        {isInOrder ? t('REORDER') : t('ORDER')}
      </div>
    );
  }

  if (!isInOrder) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.deleteProject}>
        {t('LABS_DELETE')}
      </div>
    );
  }

  // actionBarList.push(
  //   <div
  //     className="actionbar-item"
  //     onClick={that.showCloneProjectModal}
  //   >复制套系</div>
  // );

  actionBarList.push(
    <div className="actionbar-item" onClick={that.showShareModal}>
      {t('COLLECTION_SHARE')}
    </div>
  );

  return actionBarList;
};

const getSubProjectActions = that => {
  const { itemData } = that.props;
  const { projectId, productCode } = itemData;
  const isEnableCopy = disableCopyList.indexOf(productCode) === -1;

  const actionBarList = [];
  // 打开项目的按钮
  const linkParams = getLinkParams(that);
  actionBarList.push(
    <XLink
      className="actionbar-item"
      onClick={() => that.onEditClick(linkParams.linkUrl, linkParams.logEventName)}
    >
      {linkParams.displayText}
    </XLink>
  );

  return actionBarList;
};

const getNormalProjectActions = that => {
  const { itemData } = that.props;

  const { isInOrder, checkStatus, productType, isParentBookSupported } = itemData;

  const isThird = checkIsThirdProject(productType);

  const actionBarList = [];
  // 打开项目的按钮
  const linkParams = getLinkParams(that);
  if (linkParams.isShowLink) {
    actionBarList.push(
      <XLink
        className="actionbar-item"
        onClick={() => that.onEditClick(linkParams.linkUrl, linkParams.logEventName)}
      >
        {linkParams.displayText}
      </XLink>
    );
  }

  const isYSProduct = productType && productType.includes('V2_YS_');

  if (isThird) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.onExport}>
        {t('EXPORT')}
      </div>
    );
  } else {
    // 加入购物车的按钮
    // 打回的订单和寸心艺术的订单不能加入购物车
    if (checkStatus !== 2 && !isYSProduct) {
      actionBarList.push(
        <div className="actionbar-item" onClick={that.onAddToCart}>
          {isInOrder ? t('REORDER') : t('ORDER')}
        </div>
      );
    }
  }

  if (checkStatus !== 2 && !isYSProduct && isInOrder && isParentBookSupported && !__SINGLE_SPA__) {
    actionBarList.push(
      <div
        className="actionbar-item"
        onClick={that.onAddParentBookToCart}
        dangerouslySetInnerHTML={{ __html: `${t('ORDER')}<br />${t('PARENT_BOOK')}` }}
      />
    );
  }

  // 删除项目的按钮
  if (!isInOrder) {
    actionBarList.push(
      <div className="actionbar-item" onClick={that.deleteProject}>
        {t('LABS_DELETE')}
      </div>
    );
  }

  // 分享项目的按钮
  actionBarList.push(
    <div className="actionbar-item" onClick={that.showShareModal}>
      {t('COLLECTION_SHARE')}
    </div>
  );

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
    if (!isIgnore) {
      actionBarList.push(
        <div className="actionbar-item" onClick={that.onAddToCart}>
          {t('ORDER')}
        </div>
      );
    }
    return actionBarList;
  }

  if (isVirtualType) {
    return getVirtualProductActions(that);
  }

  if (isSubProject) {
    return getSubProjectActions(that);
  }

  return getNormalProjectActions(that);
};
