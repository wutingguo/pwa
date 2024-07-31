import React, {PureComponent} from 'react';

import main from './main';

import image1 from './images/1.jpg';
import image4 from './images/4.jpg';
import image5 from './images/5.jpg';

import './index.scss';

class PostCardEffectSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      imageCount: 3,
      currentTime: 0,
      itemTimeTotal: 2,
      itemTimeWithoutTrantision: 2
    };
  }

  getRenderImages = () => main.getRenderImages(this)
  getImageItemStyle = (index) => main.getImageItemStyle(this, index)
  startRenderLoop = (props) => main.startRenderLoop(this, props)
  cancelRenderLoop = () => main.cancelRenderLoop(this)

  componentDidMount() {
    this.startRenderLoop(this.props);
  }

  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.transition_mode !== this.props.transition_mode ||
      nextProps.transition_duration !== this.props.transition_duration
    ) {
      this.cancelRenderLoop();
      this.startRenderLoop(nextProps);
    }
  }

  render() {
    return (
      <div className="transition-change-effect-section">
        {this.getRenderImages()}
      </div>
    );
  }
}
 
export default PostCardEffectSection;