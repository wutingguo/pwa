import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';

import { IntlText } from '@common/components/InternationalLanguage';

import FButton from '@apps/live/components/FButton';

import CameramanModal from './CameramanModal';

const Selector = ({ list, onChange, customerIds }) => {
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState([]);
  const handleCheckboxChange = () => {
    const updatedList = list.map(item => {
      if (ids.includes(item.customer_id + '')) {
        item.checked = true;
        return item;
      }
      item.checked = false;
      return item;
    });
    onChange(updatedList);
  };

  useEffect(() => {
    if (!open) return;
    const newIds = customerIds.length === 0 ? [] : customerIds.split(',');
    setIds(newIds);
  }, [customerIds, open]);

  function handleChange(id) {
    const newIds = ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id];
    setIds(newIds);
  }

  function onOk() {
    setOpen(false);
    handleCheckboxChange();
  }

  function handleClick() {
    setOpen(true);
  }

  function allChange(e) {
    const checked = e.target.checked;
    const newIds = [];

    if (checked) {
      list.forEach(item => {
        newIds.push(item.customer_id + '');
      });
    }
    setIds(newIds);
  }
  const allChecked = useMemo(() => {
    return list?.length === ids.length;
  }, [ids]);

  return (
    <div className="pm-selector">
      {/* <span className="pm-selector-label">
        <IntlText>LP_PHOTOGRAPHER</IntlText>：
      </span> */}
      <FButton onClick={handleClick} style={{ marginBottom: '20px', marginTop: 10 }}>
        <IntlText>LP_PHOTOGRAPHER</IntlText>
      </FButton>
      <CameramanModal
        open={open}
        list={list}
        onChange={handleChange}
        ids={ids}
        onOk={onOk}
        onCancel={() => setOpen(false)}
        allChecked={allChecked}
        allChange={allChange}
      />
    </div>
  );
};

export default Selector;
