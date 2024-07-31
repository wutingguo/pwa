import React from 'react';
import classNames from 'classnames';
import { XPureComponent, XCollectionCover } from '@common/components';
import SettingList from './SettingList';
import './index.scss';

class EditorSelectionActionbar extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      navList: [
        {
          name: 'Design & Publish'
        },
        {
          name: 'Download Settings'
        }
      ],
      active: 0
    };
  }

  componentDidMount() {
    // this.setState({active:0})
  }

  //publish
  clickNav = index => {
    // console.log('clickNav...props...', this.props);
    const {
      history: { push },
      params: { id }
    } = this.props;
    let path = '/software/slide-show/collection/:id/publish';

    if (index) {
      path = '/software/slide-show/collection/:id/setting';
      window.logEvent.addPageEvent({
        name: 'SlideshowConfig_Click_DownloadSettings'
      });
    }
    let url = path.replace(':id', id);
    push(url);
    this.setState(
      {
        active: index
      },
      () => {}
    );
  };
  render() {
    const { name, coverProps, items, selectedKeys, collectionDetail, onSelect } = this.props;
    const { navList, active } = this.state;
    const setListProps = {
      items,
      selectedKeys,
      collectionDetail,
      onSelect
    };

    // console.log("setListProps....", setListProps)

    return (
      <div className="slide-show-editor-sidebar-photos-wrapper">
        {/* <nav className="slide-show-name">{name}</nav> */}
        {__isCN__ ? (
          <nav className="slide-show-name">{name}</nav>
        ) : (
          <SettingList {...setListProps} />
        )}

        {/* <div className="nav-list">
          {navList.map((item, index) => {
            return (
              <div
                className={classNames('nav-list-item', { active: active === index })}
                key={index}
                onClick={() => {
                  this.clickNav(index);
                }}
              >
                {item.name}
              </div>
            );
          })}
        </div> */}

        <div className="slide-show-editor-sidebar-photos-cover">
          <XCollectionCover {...coverProps} />
        </div>
      </div>
    );
  }
}

export default EditorSelectionActionbar;
