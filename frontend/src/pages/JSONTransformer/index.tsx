import React, { useState, useRef, useContext, useEffect } from 'react';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import ReactJSON from '@microlink/react-json-view';
import jsonPath from 'jsonpath';
import { OnChange, OnMount } from '@monaco-editor/react';
import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';
import { Minify } from '$wailsjs/go/main/App';

import sampleJson from '@/assets/sample.json';
import { jsonViewerStyles } from '@/lib/constants';
import EditorPlaceHolder, {
  EditorPlaceHolderRef,
} from '@/components/EditorPlaceHolder';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { IndentContext, IndentContextType } from '@/contexts/IndentContext';
import { useToast } from '@/components/ui/use-toast';

const jsonViewerInputKey = 'json-viewer-input';

const JSONViewer: React.FC = () => {
  const [parsedJson, setParsedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);
  const { indent, setIndent } = useContext(IndentContext) as IndentContextType;

  const editorRef = useRef<EditorPlaceHolderRef | null>(null);
  const resultEditorRef = useRef<EditorPlaceHolderRef | null>(null);
  const parsedJsonRef = useRef<object>({});
  const { toast } = useToast();

  const handleEditorOnMount: OnMount = (editor, monaco) => {
    console.log('handleEditorOnMount');
    const inputText = localStorage.getItem(jsonViewerInputKey);
    if (inputText) {
      parseJson(inputText);
      editorRef.current?.setValue(inputText);
    }
    formatJson(indent);
  };

  const handleInputChange: OnChange = (value) => {
    parseJson(value);
  };

  const parseJson = (inputText?: string) => {
    if (!inputText) {
      setParsedJson({});
      setParseErr(null);
      localStorage.setItem(jsonViewerInputKey, '');
      return;
    }

    try {
      const parsedJson = JSON.parse(inputText);
      setParsedJson(parsedJson);
      parsedJsonRef.current = parsedJson;
      setParseErr(null);
      localStorage.setItem(jsonViewerInputKey, inputText);
    } catch (error: any) {
      setParseErr(error);
    }
  };

  const formatJson = (indentWidth: number) => {
    try {
      const parsedJson = JSON.parse(editorRef.current?.getValue() || '');
      const formattedJson = JSON.stringify(parsedJson, null, indentWidth);
      if (!editorRef.current) return;
      editorRef.current.focus();
      editorRef.current.setValue(formattedJson);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(clipboardText);
    parseJson(clipboardText);
  };

  const useSampleJson = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(JSON.stringify(sampleJson, null, indent));
    parseJson(JSON.stringify(sampleJson, null, indent));
  };

  const handleCopy = async () => {
    const text = resultEditorRef.current?.getValue();
    if (!text) return;
    const success = await ClipboardSetText(text);
    success && toast({ title: 'Copied to clipboard ✅', duration: 800 });
  };

  return (
    <div className="flex flex-row p-8 w-full gap-4" style={{ height: '90%' }}>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <Label className="font-semibold text-sm">Input</Label>
          <div className="flex flex-row gap-1 items-center">
            <Button onClick={handlePaste} className="gap-1" size="sm">
              Clipboard
              <IconClipboard size={16} />
            </Button>
            <Button onClick={() => formatJson(indent)} size="sm">
              Format
            </Button>
            <Button onClick={useSampleJson} size="sm">
              Sample
            </Button>
          </div>
        </div>
        <EditorPlaceHolder
          language="json"
          ref={editorRef}
          className="h-full w-full text-sm text-justify overflow-y-scroll relative"
          placeholders={`Paste your JSON here...\nEg:
{
  "category": "fiction",
  "author": "J. R. R. Tolkien",
  "title": "The Lord of the Rings",
  "price": 11.59
}
`}
          handleEditorOnMount={handleEditorOnMount}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className="h-full w-1/2">
        <div className="flex flex-row gap-2 items-center mb-3">
          <Button onClick={handleCopy} size="sm" className="gap-1">
            Copy <IconCopy size={16} />
          </Button>
        </div>
        <div className={`flex flex-col gap-2 h-full max-h-full`}>
          <EditorPlaceHolder
            language="json"
            ref={resultEditorRef}
            className="h-full w-full text-sm text-justify overflow-y-scroll relative"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default JSONViewer;
