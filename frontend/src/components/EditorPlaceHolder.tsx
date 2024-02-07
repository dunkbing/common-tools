import { Editor, OnChange, OnMount, useMonaco } from '@monaco-editor/react';
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { editor } from 'monaco-editor';

import nordTheme from '../pages/JSONViewer/nord.json';
import { displayEditorPlaceholders } from '@/lib/utils';
import { IndentContext, IndentContextType } from '@/contexts/IndentContext';

type Props = {
  placeholders?: string;
  className?: string;
  handleInputChange?: OnChange;
  handleEditorOnMount?: OnMount;
  language?: string;
};

export type EditorPlaceHolderRef = {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
};

const EditorPlaceHolder = forwardRef<EditorPlaceHolderRef, Props>(
  ({ className, ...props }, ref) => {
    const monaco = useMonaco();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const { indent } = useContext(IndentContext) as IndentContextType;
    console.log('EditorPlaceHolder', indent);

    useImperativeHandle(ref, () => {
      return {
        focus: () => {
          editorRef.current?.focus();
        },
        getValue: () => {
          return editorRef.current?.getValue() || '';
        },
        setValue: (value: string) => {
          editorRef.current?.setValue(value);
        },
      };
    });

    useEffect(() => {
      monaco?.editor.defineTheme('nord', nordTheme as any);
      monaco?.editor.setTheme('nord');
    }, [monaco]);

    const handleInputChange: OnChange = (value, e) => {
      displayEditorPlaceholders(!!!value);
      props.handleInputChange?.(value, e);
    };

    const handleEditorOnMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      editor.focus();
      props.handleEditorOnMount?.(editor, monaco);
      if (!editor.getValue()) {
        displayEditorPlaceholders(true);
      }
    };

    return (
      <div className={className}>
        <Editor
          height="100%"
          language={props.language}
          theme="nord"
          onChange={handleInputChange}
          onMount={handleEditorOnMount}
          options={{
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            tabSize: indent,
          }}
          keepCurrentModel
        />
        <div className="monaco-placeholder">{props.placeholders}</div>
      </div>
    );
  }
);

export default EditorPlaceHolder;
