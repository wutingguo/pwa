import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styled from 'styled-components';

import './index.css';

const Container = styled.div`
  background: #fff;
  .quill {
    .ql-container {
      .ql-editor {
        height: 300px;
      }
    }
  }
`;

export default React.forwardRef(Editor);
function Editor(props, ref) {
  const { value, onChange, id, ...rest } = props;

  return (
    <Container id={id}>
      <ReactQuill ref={ref} {...rest} value={value} onChange={onChange}></ReactQuill>
    </Container>
  );
}
