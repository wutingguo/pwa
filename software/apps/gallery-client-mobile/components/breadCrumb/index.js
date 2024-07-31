import classnames from 'classnames';
import QS from 'qs';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import Select from '@resource/components/XSelect';

import './index.scss';

const BREAD_TYPES = {
  SELECT: Symbol('select'),
  TEXT: Symbol('text'),
  LINK: Symbol('link'),
};

const modeVariants = {
  category: {},
  route: {},
};

// route route mode临时方案
const mapToUrlName = url => {
  const map = {
    printStore: t('PRINT_STORE'),
    ['shopping-cart']: t('CART', 'Cart'),
    shipping: t('ESTORE_SHIPPING', 'Shipping'),
    billing: t('ORDER_NUM'),
  };
  return map[url] || '';
};

const BreadCrumb = ({
  className,
  categoryList = [],
  setImgs,
  mode = 'category',
  setCurQSProps,
  ...rest
}) => {
  const route = useRouteMatch();
  const history = useHistory();
  const [breadCrumb, setBreadCrumb] = useState([
    { type: BREAD_TYPES.TEXT, text: t('PRINT_STORE') },
    null,
    null,
    null,
  ]);
  const [selects, setSelects] = useState(['', '']);
  const [allSecondList, setAllSecondList] = useState([]);
  const hashPath = location.hash.slice(2);
  const hashSearch = hashPath.split('?')[1];
  const { sheetCode, spuId } = QS.parse(hashSearch);

  // Route 临时方案  最好在路由配置上设定面包屑名称
  useEffect(() => {
    if (!mode) return;
    const { path } = route;
    console.log('path: ---', path);
    const breads = path
      .split('/')
      .slice(1)
      .map((p, index, arr) => {
        const name = mapToUrlName(p);
        if (index >= arr.length - 1)
          return { type: BREAD_TYPES.TEXT, text: name, className: 'active' };
        const path = '/' + arr.slice(0, index + 1).join('/');
        return { type: BREAD_TYPES.LINK, text: name, path };
      });
    setBreadCrumb(breads);
  }, [location, mode]);

  useEffect(() => {
    if (categoryList.length && mode === 'category') {
      let breadCrumbArr = breadCrumb;
      const firstLevel = [];
      const secondLevel = [];
      categoryList.forEach(item => {
        firstLevel.push({
          label: item.category_name,
          value: item.category_code,
          // path: `/printStore/products?${}`
        });

        if (item.rack_spu_list && item.rack_spu_list.length) {
          item.rack_spu_list.forEach(subItem => {
            secondLevel.push({
              ...subItem,
              category_code: item.category_code,
              label: subItem.category_name || subItem.spu_name,
              value: subItem.spu_uuid,
              parentCode: item.category_code,
            });
            if (subItem.spu_uuid === spuId) {
              console.log('cur imgs', subItem.spu_asset_list);
              setImgs([...(subItem?.spu_asset_list || [])]);
            }
          });
        }
      });
      const firstSelected = sheetCode || firstLevel[0].value;
      const secondList = secondLevel.filter(item => item.parentCode === firstSelected);
      const secondSelected = spuId || secondList[0].spu_uuid;

      if (firstLevel.length) {
        breadCrumbArr[1] = {
          type: BREAD_TYPES.SELECT,
          valueFrom: 0,
          data: firstLevel,
        };
      }
      if (secondList.length) {
        breadCrumbArr[2] = {
          type: BREAD_TYPES.SELECT,
          valueFrom: 1,
          data: secondList,
        };
      }
      setBreadCrumb(breadCrumbArr);
      setAllSecondList(secondLevel);
      setSelects([firstSelected, secondSelected]);
    }
  }, [categoryList, sheetCode, spuId, breadCrumb]);

  const reGetSecondList = (list, firstSelected) => {
    const secondList = list.filter(item => item.parentCode === firstSelected);
    const defaultVal = secondList[0].value;
    const defaultItem = secondList[0];
    const {
      rack_id,
      spu_uuid: spuId,
      id: store_spu_id,
      category_code: sheetCode,
      product_type,
    } = defaultItem;
    setSelects([firstSelected, defaultVal]);
    setCurQSProps({ rack_id, spuId, store_spu_id, sheetCode });
    if (breadCrumb.length === 3) {
      setBreadCrumb(
        breadCrumb.slice(0, 2).concat({
          type: BREAD_TYPES.SELECT,
          valueFrom: 1,
          data: secondList,
        })
      );
      history.push(
        `/printStore/products?rack_id=${rack_id}&sheetCode=${firstSelected}&spuId=${defaultVal}&store_spu_id=${store_spu_id}&product_type=${product_type}`
      );
    }
  };

  const changeBreacd = (val, idx) => {
    if (idx === 0) {
      reGetSecondList(allSecondList, val);
    } else {
      const breadSelect = selects.concat([]);
      const list = allSecondList.filter(item => item.spu_uuid === val)[0];
      const {
        rack_id,
        spu_uuid: spuId,
        id: store_spu_id,
        category_code: sheetCode,
        product_type,
      } = list;
      breadSelect[idx] = val;
      setSelects(breadSelect);
      setCurQSProps({ rack_id, spuId, store_spu_id, sheetCode });
      history.push(
        `/printStore/products?rack_id=${rack_id}&sheetCode=${sheetCode}&spuId=${spuId}&store_spu_id=${store_spu_id}&product_type=${product_type}`
      );
    }
  };

  const handleClickLink = path => {
    if (!path) return;
    history.push(path);
  };

  const renderBreadCrumb = bread => {
    switch (bread && bread.type) {
      case BREAD_TYPES.SELECT: {
        return (
          <>
            <Select
              className={classnames('print-store-breadcrumb-select', bread.className)}
              options={bread.data}
              value={selects[bread.valueFrom]}
              onChange={v => changeBreacd(v.value, bread.valueFrom)}
            />
            <span className="arrow" />
            {/* <img className="arrow" src={arrowIcon}/> */}
          </>
        );
      }
      case BREAD_TYPES.TEXT:
        return (
          <>
            <span className={classnames('bread-text', bread.className)}>{bread.text}</span>
            <span className="arrow" />
            {/* <img className="arrow" src={arrowIcon}/> */}
          </>
        );
      case BREAD_TYPES.LINK: {
        return (
          <>
            <span
              className={classnames('bread-text bread-link', bread.className)}
              onClick={() => handleClickLink(bread.path)}
            >
              {bread.text}
            </span>
            <span className="arrow" />
          </>
        );
      }
      default:
        return null;
    }
  };
  return (
    <div className={classnames('breadCrumbWrapper', className)} {...rest}>
      {breadCrumb.map(item => renderBreadCrumb(item))}
    </div>
  );
};

export default memo(BreadCrumb);
