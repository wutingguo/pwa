
import React from 'react';
import "./index.scss";

const ItemBox = ({ domID, children, key }) => {
    return <div id={domID} key={key} className="ds-item mb40">{children}</div>
}
export default ItemBox;