import classNames from 'classnames';
import React, { memo, useCallback, useEffect, useState } from 'react';

import loadingIcon from '../../../icons/loading.gif';
import minusIcon_disabled from '../../../icons/minus_disabled.svg';
import minusIcon from '../../../icons/minus_normal.svg';
import plusIcon_disabled from '../../../icons/plus_disable.svg';
import plusIcon from '../../../icons/plus_normal.svg';

const QuantitySection = ({
  isSubProject,
  cartItem,
  isShippingItem = false,
  onRemove,
  onQuantityChange,
  disableQuantityChange, // 已经下架,
  refetchCartNums,
  isDigital,
}) => {
  // const { can_change_qty, min_qty = 1 } = cartItem;
  const min_qty = 1;
  const max_qty = 9999;
  const { std_spu_info } = cartItem;
  const quantity = Number(std_spu_info?.quantity);

  const [state, setState] = useState(() => ({
    showOperateLoading: false,
    quantityInputValue: quantity,
  }));

  const triggerOperateLoading = useCallback(v => {
    setState(s => ({ ...s, showOperateLoading: Boolean(v) }));
  }, []);

  const handleRemove = useCallback(() => {
    onRemove({
      start: () => triggerOperateLoading(true),
      done: () => {
        triggerOperateLoading(false);
        refetchCartNums();
      },
    });
  }, [onRemove]);

  const handleInputChange = useCallback(e => {
    const v = Number(e.target.value);
    if (isNaN(v)) return;

    setState(s => ({
      ...s,
      quantityInputValue: Math.min(max_qty, Math.max(v, min_qty)),
    }));
  }, []);

  const handleQuantityChange = useCallback(
    value => {
      // 在数值没有变化时 或者超出最小值时 不执行
      if (value === quantity || value < min_qty || value > max_qty) return;
      onQuantityChange({
        start: () => triggerOperateLoading(true),
        done: () => {
          triggerOperateLoading(false);
          refetchCartNums();
        },
        value,
      });
    },
    [quantity]
  );

  useEffect(() => {
    // 保持输入框的value在每次渲染时与接口数据一致
    handleInputChange({ target: { value: quantity } });
  }, [quantity]);

  const { showOperateLoading, quantityInputValue } = state;

  // const canChangeQuantity = !isSubProject && can_change_qty;
  const canChangeQuantity = !isShippingItem && !disableQuantityChange && !isDigital;
  const canRemove = !isShippingItem;
  const minusIconSrc = quantityInputValue <= min_qty ? minusIcon_disabled : minusIcon;
  const plusIconSrc = quantityInputValue >= 9999 ? plusIcon_disabled : plusIcon;

  return (
    <div className="project-item-quantity-outer-container">
      <div className="project-item-quantity-container">
        {canChangeQuantity ? (
          <div className="project-item-quantity-controller">
            <img
              className={classNames('action-icon', { disabled: quantityInputValue <= min_qty })}
              src={minusIcon}
              onClick={() => {
                window.logEvent.addPageEvent({
                  name: 'ClientEstore_Cart_Click_SubtractQty',
                });
                handleQuantityChange(quantityInputValue - 1);
              }}
            />
            <input
              value={quantityInputValue}
              onChange={handleInputChange}
              onBlur={() => handleQuantityChange(quantityInputValue)}
            />
            <img
              className={classNames('action-icon', { disabled: quantityInputValue >= max_qty })}
              src={plusIcon}
              onClick={() => {
                window.logEvent.addPageEvent({
                  name: 'ClientEstore_Cart_Click_AddQty',
                });
                handleQuantityChange(quantityInputValue + 1);
              }}
            />
          </div>
        ) : (
          <span>{isSubProject ? `x${quantity}` : quantity}</span>
        )}
        {!showOperateLoading && !isSubProject && canRemove && (
          <div className="project-item-remove-button" onClick={handleRemove}>
            {t('REMOVE')}
          </div>
        )}
      </div>
      {showOperateLoading && !isSubProject && (
        <div className="project-item-loading-container">
          <img className="project-item-loading-img" src={loadingIcon} />
        </div>
      )}
    </div>
  );
};

export default memo(QuantitySection);
