import React from 'react';
import classNames from 'classnames';
import { XPureComponent } from '@common/components';
import XSelect from '@resource/components/XSelect';

class MusicTagList extends XPureComponent {
  constructor(props) {
    super(props);
    this.getRenderAllTagList = this.getRenderAllTagList.bind(this);
    this.renderTagItem = this.renderTagItem.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.getRenderNormalTagList = this.getRenderNormalTagList.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  componentDidMount() {

  }

  handleTagChange(field, v) {
    const { handleTagChange } = this.props;
    handleTagChange && handleTagChange(field, v)
  }

  renderTagItem(tag) {
    const { fields } = this.props;
    const { option_key = '', values = []} = tag.toJS();
    return (
      <div className="tag-item" key={option_key}>
        <label>{option_key}</label>
        <XSelect
          options={values}
          value={fields[option_key]}
          placeholder={t('SLIDE_SHOW_PLACEHOLDER_PLEASE_SELECT')}
          onChange={(v) => this.handleTagChange(option_key, v)}
        />
      </div>
    )
  }

  getRenderNormalTagList() {
    const { musicTags } = this.props;
    const newMusicTags = musicTags.slice(0, 3);
    if(newMusicTags && newMusicTags.size > 0) {
      return newMusicTags.map(item => {
        return this.renderTagItem(item)
      })
    }
  }

  getRenderAllTagList() {
    const { musicTags } = this.props;
    if(musicTags && musicTags.size > 0) {
      return musicTags.map(item => {
        return this.renderTagItem(item)
      })
    }
  }

  toggleExpand() {
    const { toggleExpand } = this.props;
    toggleExpand && toggleExpand();
  }

  render() {
    const { expand } = this.props;
    const musicListClass = classNames('music-tags-list-wrap', {
      expand
    });
    return (
      <div className={musicListClass}>
        {expand ? this.getRenderAllTagList() : this.getRenderNormalTagList()}
        <span className="expand-arrow" onClick={this.toggleExpand}></span>
      </div>
    );
  }
}

export default MusicTagList;