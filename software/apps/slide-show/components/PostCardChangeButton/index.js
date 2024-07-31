import React from 'react';
import { XPureComponent, XIcon } from '@common/components';
import PostCardChangeContent from './PostCardChangeContent';
import {CONFIRM_MODAL} from "@resource/lib/constants/modalTypes";


import './index.scss';

const preventEvent = ev => {
  window.logEvent.addPageEvent({
    name: 'EditSlideshows_Click_Transition'
  });

  ev.stopPropagation();
};

class PostCardChangeButton extends XPureComponent {
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
    const { postCardList, boundGlobalActions, history } = this.props;
    const {showModal, hideModal } = boundGlobalActions;
    if(postCardList.size) {
      this.setState({
        showSubContent: !this.state.showSubContent
      });
    } else {
      const data = {
        title: t('ADD_POST_CARD'),
        message: t('ADD_POST_CARD_CONFIRM_MESSAGE'),
        close: () => hideModal(CONFIRM_MODAL),
        buttons: [
          {
            text: t('CANCEL'),
            className: 'confirm-btn-delete-cancel',
          },
          {
            text: t('OK'),
            className: 'confirm-btn-delete-confirm',
            onClick: () => {
                history.push('/software/slide-show/post-card/create');
            }
          }
        ]
      };

      showModal(
        CONFIRM_MODAL,
        data
      );
    }

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
      urls,
      projectId,
      visiting_card,
      postCardList,
      boundGlobalActions,
      boundProjectActions
    } = this.props;

    const buttonProps = {
      type: 'add',
      theme: 'black',
      text: t('ADD_POST_CARD'),
      onClick: this.toogleSubContent
    };
    return (
      <div className="transition-change-button" onClick={preventEvent}>
        <XIcon {...buttonProps} />
        {showSubContent && !!postCardList.size && (
          <div className="transition-change-wrap arrow-center">
            <PostCardChangeContent
              urls={urls}
              projectId={projectId}
              hideSubContent={this.hideSubContent}
              postCardList={postCardList}
              visiting_card={visiting_card}
              boundProjectActions={boundProjectActions}
              boundGlobalActions ={boundGlobalActions}
            />
          </div>
        )}
      </div>
    );
  }
}

export default PostCardChangeButton;
