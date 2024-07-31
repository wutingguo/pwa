import { Circle, Delete, Edit, StopCircleO } from '@react-vant/icons';
import cls from 'classnames';
import React from 'react';
import { Card } from 'react-vant';

import './index.scss';

const XCard = props => {
  const { rootClassName, children, ...rest } = props;
  // const renderIcon = ({ checked, disabled }) => {
  //   return (
  //     <span className={cls('checked-Card', disabled && 'disabled')}>
  //       {checked && <span className="checked-Card-bg"></span>}
  //     </span>
  //   );
  // };
  return (
    <Card className={cls('cxCard', rootClassName)} {...rest}>
      {children}
    </Card>
  );
};

function XCardHeader(props) {
  const { rootClassName, children, ...rest } = props;
  return (
    <Card.Header className={cls('cxCardHeader', rootClassName)} {...rest}>
      {children}
    </Card.Header>
  );
}
function XCardFooter(props) {
  const { rootClassName, children, ...rest } = props;
  return (
    <Card.Footer className={cls('cxCardFooter', rootClassName)} {...rest}>
      {children}
    </Card.Footer>
  );
}
function XCardBody(props) {
  const { rootClassName, children, ...rest } = props;
  return (
    <Card.Body className={cls('cxCardBody', rootClassName)} {...rest}>
      {children}
    </Card.Body>
  );
}

function XCardCover(props) {
  const { rootClassName, children, ...rest } = props;
  return (
    <Card.Cover className={cls('cxCardCover', rootClassName)} {...rest}>
      {children}
    </Card.Cover>
  );
}

const XCardContainer = XCard;
XCardContainer.Header = XCardHeader;
XCardContainer.Footer = XCardFooter;
XCardContainer.Body = XCardBody;
XCardContainer.Cover = XCardCover;

export default XCardContainer;
