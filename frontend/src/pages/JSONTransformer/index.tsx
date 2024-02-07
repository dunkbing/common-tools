import React, { useState, useRef, useContext, useEffect } from 'react';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import { OnChange, OnMount } from '@monaco-editor/react';
import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';
import json2ts from 'json-to-ts';

import EditorPlaceHolder, {
  EditorPlaceHolderRef,
} from '@/components/EditorPlaceHolder';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { IndentContext, IndentContextType } from '@/contexts/IndentContext';
import Highlighter from '@/components/Highlighter';
import IndentSelection from '@/components/IndentSelection';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const jsonTransformInputKey = 'json-transformer-input';

const JSONViewer: React.FC = () => {
  const { indent } = useContext(IndentContext) as IndentContextType;
  const editorRef = useRef<EditorPlaceHolderRef | null>(null);
  const { toast } = useToast();
  const [transformedJson, setTransformedJson] = useState<string>();
  const [target, setTarget] = useState<string>();

  const handleEditorOnMount: OnMount = () => {
    const inputText = localStorage.getItem(jsonTransformInputKey);
    if (inputText) {
      editorRef.current?.setValue(inputText);
      transform(inputText);
    }
    formatJson(indent);
  };

  const handleInputChange: OnChange = (value) => {
    transform(value);
  };

  const transform = async (str?: string) => {
    if (!str) return;
    try {
      const obj = JSON.parse(str);
      const code = json2ts(obj, { rootName: 'Root' });
      setTransformedJson(code.join('\n'));
    } catch (error) {
      console.log(error);
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
    transform(clipboardText);
  };

  const useSampleJson = () => {
    const sample = {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    };
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(JSON.stringify(sample, null, indent));
    transform(JSON.stringify(sample, null, indent));
  };

  const handleCopy = async () => {
    const text = transformedJson;
    if (!text) return;
    const success = await ClipboardSetText(text);
    success && toast({ title: 'Copied to clipboard ✅', duration: 800 });
  };

  const onChangeIndent = (value: number): void => {
    formatJson(value);
  };

  return (
    <div className="flex flex-row p-8 w-full gap-2" style={{ height: '90%' }}>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center space-x-3">
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
      <div className="flex flex-col items-center justify-center gap-1">
        <Label className="font-semibold">Transform to</Label>
        <Select>
          <SelectTrigger className="w-32 bg-slate-900 border-none h-9 text-sm">
            <SelectValue placeholder="CSV"></SelectValue>
          </SelectTrigger>
          <SelectContent className="">
            <SelectGroup>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="typescript">Typescript</SelectItem>
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="toml">TOML</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="h-full w-1/2">
        <div className="flex flex-row gap-2 items-center mb-3">
          <IndentSelection onChangeIndent={onChangeIndent} />
          <Button onClick={handleCopy} size="sm" className="gap-1">
            Copy <IconCopy size={16} />
          </Button>
        </div>
        <div
          className={`flex flex-col gap-2 h-full max-h-full bg-slate-700 p-2 text-sm`}
        >
          <Highlighter language="typescript" code={transformedJson} />
        </div>
      </div>
    </div>
  );
};

export default JSONViewer;
