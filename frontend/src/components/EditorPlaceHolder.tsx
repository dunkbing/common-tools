import { Editor, OnChange, OnMount, useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

import nordTheme from '@/assets/nord.json';
import { IndentContext, IndentContextType } from '@/contexts/IndentContext';

type Props = {
  placeholders?: string;
  className?: string;
  handleInputChange?: OnChange;
  handleEditorOnMount?: OnMount;
  language?: string;
  readOnly?: boolean;
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
    const placeholderRef = useRef<HTMLDivElement | null>(null);
    const { indent } = useContext(IndentContext) as IndentContextType;

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

    function displayEditorPlaceholders(on: boolean) {
      if (!placeholderRef.current) return;
      placeholderRef.current.style.display = on ? 'block' : 'none';
    }

    const handleInputChange: OnChange = (value, e) => {
      displayEditorPlaceholders(!value);
      props.handleInputChange?.(value, e);
    };

    const handleEditorOnMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      editor.focus();
      props.handleEditorOnMount?.(editor, monaco);
      const value = editor.getValue();
      if (!value) {
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
            readOnly: props.readOnly,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            tabSize: indent,
          }}
          keepCurrentModel
        />
        <div ref={placeholderRef} className="monaco-placeholder">
          {props.placeholders}
        </div>
      </div>
    );
  },
);

export default EditorPlaceHolder;
