import React from "react";
import classNames from 'classnames';
import "./index.scss";

// mb24

// LabelItem
const LabelItem = ({ label, value, className, vallClassName, children }) => {
    const wrapVallCls = classNames("label-val", vallClassName);
    return <div className={className}>
        {label ? <label className="label mb24">{label}</label> : null}
        <label className={wrapVallCls}>
            {value ? value : (children ? children : null)}
        </label>
    </div>
}

export default LabelItem;