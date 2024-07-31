import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  Close,
  Container,
  Content,
  Dialog,
  Footer,
  Mask,
  Title,
  WrapContent,
} from './layout';

/**
 * @typedef {Object} FDilogProps
 * @property {boolean} open 是否显示
 * @property {String|import('react').ReactElement|undefined} title
 * @property {null|import('react').ReactElement|undefined} footer
 * @property {String} width
 * @property {Object} titleStyle
 * @property {import('react').CSSProperties} maskStyle
 * @property {import('react').CSSProperties} wrapContentStyle
 * @property {Function} onCancel
 * @property {Function} onOk
 * @property {boolean} maskHide
 * @property {Object} style
 * @property {String} cancelText
 * @property {String} okText
 * @property {boolean} [hideCloseIcon=true]
 * @param {FDilogProps} props
 * @returns
 */
export default function FDilog(props) {
  const {
    open,
    title,
    children,
    footer,
    width,
    titleStyle,
    bodyStyle,
    onCancel,
    onOk,
    maskHide = true,
    style,
    cancelText,
    okText,
    maskStyle,
    wrapContentStyle,
    hideCloseIcon = true,
  } = props;
  const [visible, setVisible] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (open !== undefined) {
      setVisible(open);
    }
  }, [open]);
  useEffect(() => {
    boxRef.current.addEventListener('animationend', event => {
      // console.log(event);
    });
  }, []);

  function handleVisible(v = true) {
    if (open !== undefined) return;

    setVisible(v);
  }
  function _onCancel() {
    if (typeof onCancel === 'function') {
      onCancel();
      return;
    }
    handleVisible(false);
  }

  function _onOk() {
    if (typeof onCancel === 'function') {
      onOk();
      return;
    }
    handleVisible(false);
  }

  function maskClick() {
    if (!maskHide) return;
    _onCancel();
  }

  return (
    <Container style={{ display: visible ? '' : 'none' }}>
      <Mask style={maskStyle} onClick={maskClick} />
      <WrapContent style={wrapContentStyle}>
        <Dialog width={width} ref={boxRef} style={style}>
          {title ? <Title style={titleStyle}>{title}</Title> : null}
          {hideCloseIcon ? (
            <Close type="button" className="headerClose" onClick={_onCancel}>
              ×
            </Close>
          ) : null}
          <Content style={bodyStyle}>{children}</Content>
          <Footer>
            {footer === undefined ? (
              <>
                <Button type="button" style={{ marginRight: 30 }} onClick={_onCancel}>
                  {cancelText || '取消'}
                </Button>
                <Button type="button" onClick={_onOk}>
                  {okText || '确认'}
                </Button>
              </>
            ) : (
              footer
            )}
          </Footer>
        </Dialog>
      </WrapContent>
    </Container>
  );
}
