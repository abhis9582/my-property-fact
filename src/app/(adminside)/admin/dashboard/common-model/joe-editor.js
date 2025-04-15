// components/Editor.js
'use client';

import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

const Editor = ({ value, onChange }) => {
  const editor = useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={value}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
};

export default Editor;
