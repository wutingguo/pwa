import React, { Component } from 'react';
import classNames from 'classnames';
import './index.scss';

class CustomTabs extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      activityTab: 'common'
    };

    this.onTabClick = this.onTabClick.bind(this);
    this.getRenderTabs = this.getRenderTabs.bind(this);
  }

  onTabClick(tab) {
    const { onTabChange } = this.props;
    const { key } = tab;
    this.setState({
      activityTab: key
    });
    onTabChange && onTabChange(tab);
  }

  getRenderTabs() {
    const html = [];
    const { tabs } = this.props;
    const { activityTab } = this.state;

    tabs.forEach(tab => {
      const { key, name } = tab;
      const className = classNames('tab-item', {
        selected: key === activityTab
      })
      html.push(
        <li className={className} key={key} onClick={this.onTabClick.bind(this, tab)}>{name}</li>
      );
    });

    return html;
  }

  render() {
    return (
      <ul className="custom-tabs">{this.getRenderTabs()}</ul>
    );
  }
}


CustomTabs.defaultProps = {
  tabs: []
};

export default CustomTabs;
