import classnames from 'classnames';
import React, { Component, Fragment } from 'react';
import "./index.scss";

const handler = (callback) => {
    const isCustomJump = callback && callback();
    if (!isCustomJump) {
        window.history.back();
    }
}

const Back = ({ className, callback = () => { } }) => {
    const wraps = classnames("ds-navbar", className);
    return <div className={wraps}>
        <a className="nav" href="javascript:void(0)" onClick={() => handler(callback)}>&lt; Back</a>
    </div>
}

export default Back;