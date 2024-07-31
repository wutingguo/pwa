import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import XModal from '@resource/v2Common/ZNOComponents/public/XModal';
import XButton from '@resource/v2Common/ZNOComponents/public/XButton';
import XCheckBox from '@resource/v2Common/ZNOComponents/public/XCheckBox';
import XRadio from '@resource/v2Common/ZNOComponents/cn/XRadio';
import './index.scss';

class DoubleConfirmModal extends Component {
	constructor(props) {
		super(props);

		this.handleConfirm = this.handleConfirm.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.getExternalButtonsHtml = this.getExternalButtonsHtml.bind(this);
		this.onConfirm = this.onConfirm.bind(this);
		this.state = {
			checked: false
		}
	}

	handleConfirm() {
		const { onOkClick, closeConfirmModal, hideOnOk } = this.props;
		onOkClick();

		if (hideOnOk) {
			closeConfirmModal();
		}
	}
	onConfirm({value, checked}, e) {
		this.setState({checked})
	}

	handleCancel() {
		const { onCancelClick, closeConfirmModal } = this.props;
		onCancelClick && onCancelClick();
		closeConfirmModal();
	}

	getExternalButtonsHtml() {
		const { externalButtons } = this.props;

		// externalButtons
		const hasExternalButtons = !!(externalButtons && externalButtons.length);
		if (hasExternalButtons) {
			const html = [];
			externalButtons.forEach((m, i) => {
				switch (m.type) {
					case 'checkbox': {
						html.push(
							<XCheckBox
								key={i}
								checked={m.checked}
								className={m.className}
								subText={m.text}
								onClicked={m.onClick}
							/>
						);
						break;
					}
					case 'button': {
						html.push(
							<XButton key={i} onClicked={m.onClick} className={m.className}>
								{m.text}
							</XButton>
						);
						break;
					}
					case 'radio': {
						html.push(
							<XRadio
								key={i}
								checked={m.checked}
								subText={m.text}
								className={m.className}
								onClicked={m.onClick}
							/>
						);
						break;
					}
					default: {
						break;
					}
				}
			});

			return <div className="external-buttons">{html}</div>;
		}

		return null;
	}

	render() {
		const {
			isShown,
			confirmTitle,
			confirmMessage,
			okButtonText,
      okButtonClass,
			cancelButtonText,
			closeConfirmModalByX,
			externalButtons,
      activeButton = false,
      isButtonAlignCenter = true,
			confirmCheckInfo = '请确认您已阅读并知悉以上内容'
		} = this.props;
		const { checked } = this.state;
    const buttonWrapClass = classNames('button-wrap', {
      'two-buttons': !!cancelButtonText,
      'space-between': !isButtonAlignCenter
    });

		const OKButtonClass = classNames('height-30', okButtonClass);
    const cancelButtonClass = classNames('height-30', 'button-white');

		const confirmMessageData = confirmMessage.toJS ? confirmMessage.toJS() : confirmMessage;
		return (
			<XModal className="confirm-wrap" onClosed={closeConfirmModalByX} opened={isShown}>
				<div className="confirm-title">{confirmTitle}</div>
				<div className="confirm-mes">{confirmMessageData}</div>
				<XCheckBox
					checked={checked}
					className="confirm-check theme-1"
					subText={confirmCheckInfo}
					onClicked={this.onConfirm}
				/>
				<div className={buttonWrapClass}>
					{cancelButtonText ? (
						<XButton className={cancelButtonClass} onClicked={this.handleCancel}>
							{cancelButtonText}
						</XButton>
					) : null}
					<XButton onClicked={this.handleConfirm} disabled={!checked} className={OKButtonClass}>
						{okButtonText}
					</XButton>
				</div>

				{/*渲染附加的按钮*/}
				{this.getExternalButtonsHtml()}
			</XModal>
		);
	}
}

DoubleConfirmModal.propTypes = {
	isShown: PropTypes.bool.isRequired,
	onOkClick: PropTypes.func.isRequired,
	closeConfirmModal: PropTypes.func.isRequired,
	confirmTitle: PropTypes.string,
	confirmMessage: PropTypes.oneOfType([ PropTypes.string, PropTypes.node ]).isRequired,
	okButtonText: PropTypes.string,
	cancelButtonText: PropTypes.string,
	onCancelClick: PropTypes.func,
	okButtonClass: PropTypes.string,
  hideOnOk: PropTypes.bool,
  isButtonAlignCenter: PropTypes.bool,
	externalButtons: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.oneOf([ 'checkbox', 'button', 'radio' ]),
			text: PropTypes.string.isRequired,
			onClick: PropTypes.func.isRequired,
			className: PropTypes.string,
			checked: PropTypes.bool
		})
	)
};

DoubleConfirmModal.defaultProps = {
	okButtonText: 'Done',
  externalButtons: [],

  // 按钮居中显示.
  isButtonAlignCenter: true
};

export default DoubleConfirmModal;
