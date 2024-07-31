import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { isBrowserEnv } from '@resource/lib/utils/env';

import { ADDRESS_SELECT_LABELS } from '@resource/lib/constants/strings';

import handler from './handler';

import './index.scss';

class Cascader extends React.Component {
  constructor(props) {
    super(props);

    const { province, city, area, street } = props;
    this.state = {
      province, // 所选省
      city, // 所选市
      area, // 所选区
      street, // 所选街道
      provinces: [], // 省的集合
      citys: [], // 市的集合
      areas: [], // 区的集合
      streets: [], // 街道结合,
      curLabelKey: ADDRESS_SELECT_LABELS[0].key,
      province_code: '',
    };

    this.getProvince = () => handler.getProvince(this);
    this.initData = () => handler.initData(this);
    this.onSelect = (type, item, e) => handler.onSelect(this, type, item, e);
    this.getSubArea = (type, uidpk, level) => handler.getSubArea(this, type, uidpk, level);
    this.getLevel = type => handler.getLevel(this, type);
    this.onClickLabel = (key, e) => handler.onClickLabel(this, key, e);
    this.getRenderLabel = () => handler.getRenderLabel(this);
    this.getRenderSelect = key => handler.getRenderSelect(this, key);
    this.toggleSelect = e => handler.toggleSelect(this, e);
    this.hideSelect = e => handler.hideSelect(this, e);
  }

  componentDidMount() {
    if (isBrowserEnv()) {
      this.initData();

      window.addEventListener('click', this.hideSelect);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldProvince = this.props.province;
    const newProvince = nextProps.province;
    const oldCity = this.props.city;
    const newCity = nextProps.city;
    const oldArea = this.props.area;
    const newArea = nextProps.area;
    const oldStreet = this.props.street;
    const newStreet = nextProps.street;
    if (
      oldProvince !== newProvince ||
      oldCity !== newCity ||
      oldArea !== newArea ||
      oldStreet !== newStreet
    ) {
      this.setState({
        province: newProvince,
        city: newCity,
        area: newArea,
        street: newStreet,
      });
    }
  }

  componentWillUnmount() {
    if (isBrowserEnv()) {
      window.removeEventListener('click', this.hideSelect);
    }
  }

  render() {
    const { style, isSupportStreet, placeholder, name = '' } = this.props;
    const { curLabelKey, isShowSelect, province, city, area, street } = this.state;

    // 拼接显示的地址
    const address = `${province}/${city}/${area}/${street}`.replace(/(\/{2,}|\/$)/g, '');

    const className = classNames('cascader-new', {
      'support-street': isSupportStreet,
    });

    return (
      <div className={className} style={style}>
        <input
          type="text"
          name={name}
          className="val"
          value={address}
          onClick={this.toggleSelect}
          placeholder={placeholder}
          readOnly
        />
        {isShowSelect ? (
          <div className="select">
            {this.getRenderLabel()}
            {this.getRenderSelect(curLabelKey)}
          </div>
        ) : null}
      </div>
    );
  }
}

Cascader.propTypes = {
  isSupportStreet: PropTypes.bool,
  style: PropTypes.object,
  province: PropTypes.string,
  city: PropTypes.string,
  area: PropTypes.string,
  street: PropTypes.string,
  placeholder: PropTypes.string,
};

Cascader.defaultProps = {
  province: '',
  city: '',
  area: '',
  street: '',
  placeholder: '',
  isSupportStreet: false,
  style: {},
};

export default Cascader;
