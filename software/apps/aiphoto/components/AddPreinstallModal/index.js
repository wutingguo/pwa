import React, { Component } from 'react';
import XModal from '@apps/workspace/components/XModal';
import './index.scss';
import handler from './_handle';
import PictureCompareBox from '@resource/components/PictureCompareBox';
import classnames from 'classnames';
import { defaultPresetTopics } from '@resource/lib/constants/strings';

export default class AddPreinstallModal extends Component {
  constructor(props) {
    super(props);
    const { effectsList } = this.props;
    this.state = {
      selectedPfc: effectsList.length > 0 ? effectsList[0] : {}
    };
  }

  componentDidMount() {}

  render() {
    const { handleClose, effectsList } = this.props;
    const defaultEffectsList = effectsList.filter(i => defaultPresetTopics.includes(i.topic_code));
    const { selectedPfc } = this.state;
    const xmodalProps = {
      data: {
        title: '',
        className: 'preinstall-modal',
        backdropColor: 'rgba(17, 17, 17, 0.4)',
        isHideIcon: false
      },
      actions: {
        handleClose
      }
    };

    const { topic_code } = selectedPfc;

    const oriImg = `/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/basic/${topic_code}.jpg`;
    const newImg = `/clientassets-cunxin-saas/portal/images/pc/aiphoto/sample/effect/${topic_code}.jpg`;

    // const oriImg = `./sample/basic/${topic_code}.jpg`;
    // const newImg = `./sample/effect/${topic_code}.jpg`;

    return (
      <XModal {...xmodalProps}>
        <div className="p-title">预设选项</div>
        <div className="content">
          <div className="left-select">
            {defaultEffectsList.map(item => {
              const itemClass = classnames('item', {
                active: item.preset_code === selectedPfc.preset_code
              });
              return (
                <div className={itemClass} onClick={() => this.setState({ selectedPfc: item })}>
                  {t(item.topic_code)}
                </div>
              );
            })}
          </div>
          <div className="right-image">
            <PictureCompareBox
              isHOC={true}
              newImage={newImg}
              oriImage={oriImg}
              className="add-preinstall-modal-pc"
            />
          </div>
        </div>
      </XModal>
    );
  }
}
