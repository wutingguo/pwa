import React from 'react'
import getPrefixCls from "../../utils/getPrefixCls";
import './index.scss'

const prefixCls = getPrefixCls('header')

export default function Header({
    exitImageMatting
}) {

    const onInternalClose = () => {
        exitImageMatting?.();
    }

    return (
        <div className={prefixCls}>
            <span className={`${prefixCls}-icon-close`} onClick={onInternalClose} />
        </div>
    )
}