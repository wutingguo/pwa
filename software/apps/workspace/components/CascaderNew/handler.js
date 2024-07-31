import React from 'react';
import classNames from 'classnames';
import * as xhr from '@resource/websiteCommon/utils/xhr';
import { GET_COUNTRY_AND_PROVINCE, GET_SUBAERA_LIST } from '../../constants/apiUrl';
import { AREA_LEVEL, AREA_SUB_MAP, ADDRESS_SELECT_LABELS, ADDRSS_NEXT_STATE, ADDRSS_PREV_STATE } from '../../constants/strings';

const getProvince = (that) => {
  return new Promise((resolve, reject) => {
    const url = `${that.props.baseUrl}${GET_COUNTRY_AND_PROVINCE}`;
    xhr.get(url).then(res => {
      if (res && res.data && res.data.length) {
        that.setState({
          provinces: res.data[0]['subAreaList']
        });
        resolve(res.data[0]['subAreaList']);
      }
    });
  });
};

const getLevel = (that, type) => {
  // type 当前点击项
  let level = '';
  switch (type) {
    case 'province':
      level = AREA_LEVEL.city;
      break;
    case 'city':
      level = AREA_LEVEL.area;
      break;
    case 'area':
      level = AREA_LEVEL.street;
      break;
    case 'street':
      level = '';
      break;
  }
  return level;
};

const onSelect = (that, type, item, e) => {
  const { selectComplete, isSupportStreet, needMapStateToProps = false } = that.props;
  const { name: val, uidpk } = item;
  let willUpdateState = {};
  let hasCallback = false;
  switch (type) {
    case 'province':
      willUpdateState = {
        [type]: val,
        city: '',
        area: '',
        street: '',
        areas: [],
        streets: [],
        curLabelKey: ADDRSS_NEXT_STATE[type]
      };
      hasCallback = true;
      break;
    case 'city':
      willUpdateState = {
        [type]: val,
        area: '',
        street: '',
        streets: [],
        curLabelKey: ADDRSS_NEXT_STATE[type]
      };
      hasCallback = true;
      break;
    case 'area':
      willUpdateState = {
        [type]: val,
        street: '',
        curLabelKey: isSupportStreet ? ADDRSS_NEXT_STATE[type] : that.state.curLabelKey,
        isShowSelect: isSupportStreet
      };

      hasCallback = true;
      break;
    case 'street':
      willUpdateState = {
        [type]: val,
        isShowSelect: false
      };
      // hasCallback = false;
      hasCallback = isSupportStreet;
      break;
  }

  that.setState(willUpdateState, async () => {
    if (hasCallback) {
      const level = that.getLevel(type);
      await that.getSubArea(type, uidpk, level);
      const { province, city, area, street, streets } = that.state;
      if((isSupportStreet && type === 'street') || (!isSupportStreet && type === 'area') || needMapStateToProps) {
        selectComplete && selectComplete({ province, city, area, street, streets})
      }
    }
  });

  e.stopPropagation();
};

const getSubArea = (that, type, uidpk, level) => {
  return new Promise((resolve, reject) => {
    if (level && uidpk) {
      const url = `${that.props.baseUrl}${GET_SUBAERA_LIST}?uidpk=${uidpk}&level=${level}`;
      xhr.get(url).then(res => {
        if (res && res.data && res.data.subAreaList) {
          const key = AREA_SUB_MAP[type];
          that.setState({
            [key]: res.data.subAreaList
          });
          resolve(res.data.subAreaList);
        }
      });
    } else {
      const key = AREA_SUB_MAP[type];
      that.setState({
        [key]: []
      });
      resolve([]);
    }
  });
};

const getRenderLabel = (that) => {
  const { isSupportStreet } = that.props;
  const { curLabelKey } = that.state;
  const html = [];

  const labels = ADDRESS_SELECT_LABELS.slice(0);
  if (!isSupportStreet) {
    labels.pop();
  }

  labels.forEach((itm, index) => {
    const { key, label } = itm;
    const className = classNames('', {
      'cur': curLabelKey === key
    });
    html.push(
      <li key={index} className={className} onClick={that.onClickLabel.bind(that, key)}>{label}</li>
    );
  });

  return <ul className="address-labels">{html}</ul>;
};

const getRenderSelect = (that, key) => {
  const { state } = that;
  const list = state[`${key}s`];
  const value = state[key];
  return (
    <ul className={`select-item ${key}`}>
      {
        list && list.length ? list.map((item, index) => {
          const { name } = item;
          const className = classNames('', {
            active: name === value
          });
          return <li key={index} className={className} onClick={that.onSelect.bind(that, key, item)}>{name}</li>
        }) : null
      }
    </ul>
  );
};

const onClickLabel = (that, key, e) => {
  const prevStateKey = ADDRSS_PREV_STATE[key];
  if (key === 'province' || that.state[prevStateKey]) {
    that.setState({
      curLabelKey: key
    });
  }
  e.stopPropagation();
};

const toggleSelect = (that, e) => {
  that.setState({
    isShowSelect: !that.state.isShowSelect
  });
  e.stopPropagation();
};

const hideSelect = (that) => {
  that.setState({
    isShowSelect: false
  });
};

const loopInitSublist = (that, list) => {
  const { isSupportStreet } = that.props;
  const keys = ['province', 'city', 'area'];
  if (!isSupportStreet) {
    keys.pop();
  }
  const initSubList = (type, list) => {
    const val = that.state[type];
    const curItem = list.find(itm => itm.name === val);
    if (curItem) {
      const { uidpk } = curItem;
      const level = getLevel(that, type);
      getSubArea(that, type, uidpk, level).then(newList => {
        const nextType = keys.shift();
        if (nextType) {
          initSubList(nextType, newList);
        }
      });
    }
  }

  initSubList(keys.shift(), list);
}

const initData = (that) => {
  that.getProvince()
    .then((list) => {
        const value = that.state['province'];
        if (value) {
          loopInitSublist(that, list);
        }
    });
}

export default {
  getProvince,
  getLevel,
  onSelect,
  getSubArea,
  getRenderLabel,
  getRenderSelect,
  onClickLabel,
  toggleSelect,
  hideSelect,
  initData
};
