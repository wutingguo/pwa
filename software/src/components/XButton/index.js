import React, { Component } from 'react';
import Button from '@resource/components/XButton';
import classnames from 'classnames';

import "./index.scss";

const XButton = ({ disabled, loading = false, className, children, ...props }) => {
    const wrapClass = classnames("button-text-wrapper", className);
    return <Button disabled={loading || disabled} {...props} className={wrapClass} >
        {loading && <i className="loading-icon" />}
        {children}
    </Button>

}

export default XButton;

