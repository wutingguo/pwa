import React from 'react';
import { XPureComponent, XIcon } from '@common/components';
import TransitionChangeContent from './TransitionChangeContent';

import './index.scss';

const preventEvent = ev => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_Click_Transition'
  });

  ev.stopPropagation();
};

class TransitionChangeButton extends XPureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSubContent: false
    };
  }

  hideSubContent = () => {
    this.setState({
      showSubContent: false
    });
  };

  toogleSubContent = () => {
    this.setState({
      showSubContent: !this.state.showSubContent
    });
  };

  componentDidMount() {
    window.addEventListener('click', this.hideSubContent, false);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.hideSubContent);
  }

  render() {
    const { showSubContent } = this.state;
    const {
      collectionId,
      transitionModes,
      transition_mode,
      transition_duration,
      boundProjectActions
    } = this.props;

    const buttonProps = {
      type: 'transition',
      theme: 'black',
      text: t('TRANSITION'),
      onClick: this.toogleSubContent
    };
    return (
      <div className="transition-change-button" onClick={preventEvent}>
        <XIcon {...buttonProps} />
        {showSubContent && !!transitionModes.size && (
          <div className="transition-change-wrap arrow-center">
            <TransitionChangeContent
              collectionId={collectionId}
              hideSubContent={this.hideSubContent}
              transitionModes={transitionModes}
              transition_mode={transition_mode}
              boundProjectActions={boundProjectActions}
              transition_duration={transition_duration}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TransitionChangeButton;
