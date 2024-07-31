import React, { PureComponent } from 'react';
import main from './handle/main';
import { XButton } from '@common/components'
import XCheckBox from '@resource/components/XCheckBox';
import PostCardPreviewSection from './PostCardPreviewSection';

import './index.scss';

class PostCardChangeContent extends PureComponent {
  constructor(props) {
    super(props);
    const { postCardList } = props;
    const defaultCard = postCardList.get(0);
    this.state = {
      showModeSelector: false,
      isUnUsePostCard: false,
      visiting_card: props.visiting_card || defaultCard&&defaultCard.get('id') || 0
    };
  }

  getPostCardListSelect = () => main.getPostCardListSelect(this);
  onModeChange = option => main.onModeChange(this, option);
  handleSave = () => main.handleSave(this);

  toogleModeSelector = () => {
    this.setState({
      showModeSelector: !this.state.showModeSelector
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visiting_card !== this.state.visiting_card) {
      this.setState({
        visiting_card: nextProps.visiting_card
      });
    }
  }

  handelRadioChange = (data) => {
    this.setState({
      isUnUsePostCard: data.checked
    });
  };

  render() {
    const { showModeSelector, visiting_card, isUsePostCard } = this.state;
    const { urls, postCardList } = this.props;
    const galleryBaseUrl = urls.get('galleryBaseUrl');
    const defaultCard = postCardList.get(0);
    const selectedPostCard =
      postCardList.find(item => item.get('id') == visiting_card) || defaultCard;
    let postCardPreviewProps = {};
    if(selectedPostCard && selectedPostCard.size) {
      postCardPreviewProps = {
        ...selectedPostCard.toJS(),
        galleryBaseUrl
      };
    }
    // if (!selectedMode) return null;
    return (
      <div className="transition-change-content">
        <div className="transition-change-mode-container">
          <div className="transition-change-mode-value" onClick={this.toogleModeSelector}>
            {selectedPostCard && selectedPostCard.get('card_name')}
          </div>
          {showModeSelector && this.getPostCardListSelect()}
        </div>
        {selectedPostCard && selectedPostCard.size ? (
          <PostCardPreviewSection {...postCardPreviewProps} />
        ) : null}

        <div className="radio-container">
          <XCheckBox
            name="cancel"
            className="black"
            text={t('CANCEL_USE_POST_CARD')}
            onClicked={this.handelRadioChange}
            checked={isUsePostCard}
            value={isUsePostCard}
          />
        </div>
        <div className="button-container">
          <XButton className="black" width={80} height={32} onClicked={this.handleSave}>
            {t('SAVE')}
          </XButton>
        </div>
      </div>
    );
  }
}

export default PostCardChangeContent;
