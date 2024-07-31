import React, { Component, Fragment } from 'react';
import XButton from '@resource/components/XButton';
import XImageArray from '../ImageArray';
import "./index.scss";

const Group = ({ groupName, list, ungroupEnabled = false, onUngroupClick = () => { } }) => {
    return <div className="group-box mt40">
        <div className="mr40" >
            <h3 className="group-name">{groupName}</h3>
            {ungroupEnabled && <XButton className="group-btn mb40" onClick={onUngroupClick}> Ungroup </XButton>}
        </div>
        <XImageArray list={list} />
    </div>
}

export default Group;