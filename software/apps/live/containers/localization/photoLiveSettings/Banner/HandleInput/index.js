import PropTypes from 'prop-types';
import React from 'react';

import FButton from '@apps/live/components/FButton';
import FInput from '@apps/live/components/FInput';
import IconEdit from '@apps/live/components/Icons/IconEdit2';

import { Container, Content, Icon, InputBox, Label, Text, TextBox } from './layout';

export default class HandleInput extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    open: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.any,
    value: PropTypes.string,
    labelStyle: PropTypes.any,
  };

  static defaultProps = {
    label: '网址：',
  };

  static getDerivedStateFromProps(props) {
    const { open, value } = props;
    let newState = {};
    if (typeof open === 'boolean') {
      newState.visible = open;
    }
    if (typeof value === 'string') {
      newState.value = value;
    }
    return newState;
  }

  constructor() {
    super();
    this.state = {
      visible: false,
      value: '',
    };
  }

  _onChange = (visible, value) => {
    const { onChange } = this.props;

    if (typeof onChange === 'function') {
      onChange(visible, value);
      return null;
    }

    this.setState({
      visible,
      value,
    });
  };

  inputChange = e => {
    const { value } = e.target;
    this._onChange(true, value);
  };
  render() {
    const { label, style, className, labelStyle, intl } = this.props;
    const { value, visible } = this.state;
    return (
      <Container className={className} style={style}>
        <Label style={labelStyle}>{label}</Label>
        <Content>
          {!visible ? (
            <TextBox>
              <Text title={value}>{value}</Text>
              <Icon onClick={() => this._onChange(true, value)}>
                <IconEdit fill="#222" width={14} />
              </Icon>
            </TextBox>
          ) : (
            <InputBox>
              <FInput
                type="url"
                containerStyle={{ width: '100%' }}
                value={value}
                placeholder={intl.tf('LP_PLEASE_ENTER')}
                onChange={this.inputChange}
              />
              <FButton
                type="link"
                style={{ minWidth: '72px' }}
                color="#0077CC"
                onClick={() => this._onChange(false, value)}
              >
                {intl.tf('LP_BANNER_OK')}
              </FButton>
            </InputBox>
          )}
        </Content>
      </Container>
    );
  }
}
