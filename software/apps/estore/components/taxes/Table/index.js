import React, { memo, useCallback } from 'react';
import deletePng from '@resource/static/icons/handleIcon/delet.png';
import editorPng from '@resource/static/icons/handleIcon/editor.png';
import './index.scss';

const TabRowActions = memo(({ item, subItem = null, onEdit, onRemove }) => {
  const handleEdit = useCallback(() => {
    if (!item) return;
    onEdit({ country: item, subRegion: subItem });
  }, [onEdit, item, subItem]);

  const handleRemove = useCallback(() => {
    if (!item) return;
    onRemove({ country: item, subRegion: subItem });
  }, [onRemove, item, subItem]);

  return (
    <div className="store-tax-table-actions">
      <img src={editorPng} onClick={handleEdit} />
      <img src={deletePng} onClick={handleRemove} />
    </div>
  );
});

const MultiTableItemRow = memo(({ item, onEdit, onRemove }) => {
  const { region_name, children = [] } = item;
  return (
    <div className="store-tax-table__multi-item">
      <div className="store-tax-table__multi-item__title row">{region_name}</div>
      {children.map(subItem => {
        return (
          <div key={subItem.region_id} className="store-tax-table__multi-item__sub-row row">
            <div className="store-tax-table__multi-item__sub-row-cell col-1">{`- ${subItem.region_name}`}</div>
            <div className="store-tax-table__multi-item__sub-row-cell col-2">
              {Number(subItem.tax_rates).toFixed(2)}%
            </div>
            <div className="store-tax-table__multi-item__sub-row-cell col-3">
              {subItem.tax_usage === 3 ? 'Yes' : 'No'}
            </div>
            <div className="store-tax-table__multi-item__sub-row-cell col-4">
              <TabRowActions item={item} subItem={subItem} onEdit={onEdit} onRemove={onRemove} />
            </div>
          </div>
        );
      })}
    </div>
  );
});

function Table({ data = [], onEdit, onRemove }) {
  return (
    <div className="store-tax-table">
      <div className="store-tax-table__header row">
        <div className="store-tax-table__header-cell col-1">Clients' Location</div>
        <div className="store-tax-table__header-cell col-2">Tax (%)</div>
        <div className="store-tax-table__header-cell col-3">Apply to Shipping</div>
        <div className="store-tax-table__header-cell col-4">Actions</div>
      </div>
      {data.map(item =>
        item.children ? (
          <MultiTableItemRow item={item} onEdit={onEdit} onRemove={onRemove} />
        ) : (
          <div className="store-tax-table__item row" key={item.region_id}>
            <div className="store-tax-table__item-cell col-1">{item.region_name}</div>
            <div className="store-tax-table__item-cell col-2">{item.tax_rates}%</div>
            <div className="store-tax-table__item-cell col-3">
              {item.tax_usage === 3 ? 'Yes' : 'No'}
            </div>
            <div className="store-tax-table__item-cell col-4">
              <TabRowActions item={item} onEdit={onEdit} onRemove={onRemove} />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default memo(Table);
