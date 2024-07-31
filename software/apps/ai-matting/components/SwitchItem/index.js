import React from 'react'
import Switch from '@apps/gallery/components/Switch';
import Proptypes from 'prop-types';

import getPrefixCls from "../../utils/getPrefixCls";
import './index.scss'

const prefixCls = getPrefixCls('switch-item')

export default function SwitchItem({
    label = '',
    onSwitch,
    checked
}) {
    return (
        <div className={prefixCls}>
            <span className={`${prefixCls}-label`}>{label}</span>
            <Switch onSwitch={onSwitch} checked={checked} />
        </div>
    );
}

SwitchItem.propTypes = {
    onSwitch: Proptypes.func.isRequired,
    checked: Proptypes.bool.isRequired
};

Switch.defaultProps = {};