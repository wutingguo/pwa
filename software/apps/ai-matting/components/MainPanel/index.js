import React from 'react'
import ControlPanel from '../ControlPanel';
import getPrefixCls from "../../utils/getPrefixCls";
import './index.scss'
import BookPage from '@apps/ai-matting/konva/BookPage';

const prefixCls = getPrefixCls('main-panel')
export default function MainPanel(props) {
    const {
        property,
        boundProjectActions,
        boundGlobalActions,
        exitImageMatting,
        showRetryModal
    } = props

    const controlPanelProps = {
        property,
        boundProjectActions,
        boundGlobalActions,
        onCancel: exitImageMatting,
        showRetryModal
    }

    return (
        <div className={prefixCls}>
            <div className={`${prefixCls}-page-container`}>
                <BookPage {...props} />
            </div>
            <ControlPanel {...controlPanelProps} /> 
        </div>
    )
}
