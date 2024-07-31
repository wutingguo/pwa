import { fromJS } from 'immutable';
import { template } from 'lodash';
import Proptypes from 'prop-types';
import React from 'react';
import ItemsCarousel from 'react-items-carousel';

import { XPureComponent } from '@common/components';

import './index.scss';

class DesignTplCarousel extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeId: 'center',
    };
  }

  onClick = e => {
    const id = e.target.id;
    const { onClickItem } = this.props;
    this.setState({
      activeId: id,
    });
    onClickItem(id);
  };

  render() {
    const { templates, setActiveItemIndex, coverTemplateUrl, cover_spec, template } = this.props;
    const { activeId } = this.state;
    const templatesArr = cover_spec && cover_spec?.get('templates');
    return (
      <div className="design-tpl-carousel">
        {cover_spec && cover_spec.size ? (
          <ItemsCarousel
            requestToChangeActive={setActiveItemIndex}
            activeItemIndex={1}
            numberOfCards={7}
            gutter={20}
            // leftChevron={<button>{'<'}</button>}
            // rightChevron={<button>{'>'}</button>}
            leftChevron={'L'}
            rightChevron={'R'}
            outsideChevron
            // chevronWidth={'0.33rem'}
            chevronWidth={180}
            classes={{
              wrapper: 'wrapper',
              itemsWrapper: 'itemsWrapper',
              itemsInnerWrapper: 'itemsInnerWrapper',
              itemWrapper: 'itemWrapper',
              rightChevronWrapper: 'rightChevronWrapper',
              leftChevronWrapper: 'leftChevronWrapper',
            }}
          >
            {templatesArr.map(item => {
              const imgsrc = `/clientassets/portal/v2/images/saas/${item}.jpg`;
              return (
                <div
                  onClick={this.onClick}
                  key={item}
                  className={`item ${activeId === item || template === item ? 'active' : ''}`}
                  id={item}
                >
                  <img src={imgsrc} className="itemWrapper-img" />
                  <div className="itemWrapper-text">{item}</div>
                </div>
              );
            })}
          </ItemsCarousel>
        ) : null}
      </div>
    );
  }
}

export default DesignTplCarousel;

DesignTplCarousel.propTypes = {
  templates: Proptypes.object.isRequired,
  // activeItemIndex: Proptypes.string.isRequired,
  setActiveItemIndex: Proptypes.func.isRequired,
  onClickItem: Proptypes.func.isRequired,
};

DesignTplCarousel.defaultProps = {
  templates: fromJS([]),
  setActiveItemIndex: () => {},
  onClickItem: () => {},
};
