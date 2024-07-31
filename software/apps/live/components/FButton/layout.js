import styled from 'styled-components';

export const ButtonBox = styled.button`
  border-radius: 4px;
  border: none;
  cursor: ${cursor};
  padding: ${padding};
  background: ${background};
  color: ${color};
  &:active {
    transform: ${activeTransform};
  }
  &:hover {
    background: ${({ type }) => (type !== 'link' ? '#393939' : '')};
  }
  svg {
    vertical-align: text-top;
    margin-right: 3px;
  }
  &.white {
    background: #fff;
    color: #222;
    border: 1px solid #d8d8d8;
  }
`;

function cursor({ disabled }) {
  if (disabled) {
    return 'not-allowed';
  }
  return 'pointer';
}

function padding({ size }) {
  if (size === 'medium') {
    return '12px 33px;';
  } else if (size === 'large') {
    return '16px 44px;';
  }
  return '8px 22px;';
}

function background({ type }) {
  if (type === 'link') {
    return 'transparent';
  }

  return '#000';
}

function color({ color }) {
  if (color) {
    return color;
  }

  return '#ffffff';
}

function activeTransform({ disabled }) {
  if (disabled) {
    return 'none';
  }
  return 'scale(0.95)';
}
