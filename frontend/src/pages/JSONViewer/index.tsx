import React, { useState, useRef } from 'react';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import ReactJSON from '@microlink/react-json-view';
import jsonPath from 'jsonpath';
import { OnChange, OnMount, Editor, useMonaco } from '@monaco-editor/react';
import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';

import IconInput from '@/components/IconInput';
import Dropdown, { Option } from '@/components/Dropdown';
import sampleJson from './sample.json';
import CheatSheetDialog from './CheatSheetDialog';
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
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';

const jsonViewerInputKey = 'json-viewer-input';

const JsonViewer: React.FC = () => {
  const [parsedJson, setParsedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);
  const [indentWidth, setIndentWidth] = useState<number>(2);

  const editorRef = useRef<EditorPlaceHolderRef | null>(null);
  const parsedJsonRef = useRef<object>({});

  const handleEditorOnMount: OnMount = () => {
    const inputText = localStorage.getItem(jsonViewerInputKey);
    if (inputText) {
      parseJson(inputText);
      editorRef.current?.focus();
      editorRef.current?.setValue(inputText);
    }
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
    const parsedJson = JSON.parse(editorRef.current?.getValue() || '');
    const formattedJson = JSON.stringify(parsedJson, null, indentWidth);
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(formattedJson);
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(clipboardText);
    parseJson(clipboardText);
  };

  const minifyJson = () => {
    const parsedJson = JSON.parse(editorRef.current?.getValue() || '');
    const minifiedJson = JSON.stringify(parsedJson);
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(minifiedJson);
  };

  const useSampleJson = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(JSON.stringify(sampleJson, null, indentWidth));
    parseJson(JSON.stringify(sampleJson, null, indentWidth));
  };

  const handleCopy = () => {
    const text = JSON.stringify(parsedJson, null, indentWidth);
    ClipboardSetText(text);
  };

  const queryJson = (query: string) => {
    if (!query) {
      setParsedJson(parsedJsonRef.current);
      return;
    }
    try {
      const result = jsonPath.query(parsedJsonRef.current, query);
      setParsedJson(result);
      setParseErr(null);
    } catch (error: any) {}
  };

  const changeSpaces = (value: string): void => {
    const newIndentWidth = Number(value);
    setIndentWidth(newIndentWidth);
    formatJson(newIndentWidth);
  };

  return (
    <div className="flex flex-row pb-8 px-8 w-full h-full items-center justify-center gap-8">
      <div className="h-5/6 w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <Label className="font-semibold text-sm">Input</Label>
          <div className="flex flex-row gap-1.5 items-center">
            <Button onClick={handlePaste} className="gap-1" size="sm">
              Clipboard
              <IconClipboard size={16} />
            </Button>
            <Button onClick={() => formatJson(indentWidth)} size="sm">
              Format
            </Button>
            <Button onClick={minifyJson} size="sm">
              Minify
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
      <div className="h-5/6 w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <label className="font-semibold text-sm">Formatted JSON</label>
            <Select onValueChange={changeSpaces}>
              <SelectTrigger className="w-fit bg-slate-900 border-none">
                <SelectValue placeholder="2 spaces">
                  {indentWidth} spaces
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="">
                <SelectGroup>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Dropdown
              onChange={changeSpaces}
              options={[
                { label: '2 spaces', value: '2' },
                { label: '4 spaces', value: '4' },
              ]}
            /> */}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button onClick={handleCopy} size="sm" className="gap-1">
              Copy <IconCopy size={16} />
            </Button>
          </div>
        </div>
        <div className={`flex flex-col gap-2 h-full max-h-full`}>
          <div className="flex flex-row gap-2 items-center">
            <IconInput
              className="text-sm bg-zinc-800"
              placeholder="JSON Path(Eg: $.store.book[?(@.price < 10)])"
              onChange={(event) => queryJson(event.target.value?.trim())}
            />
            <CheatSheetDialog />
          </div>
          <div
            className={`border ${
              !parseErr ? 'border-gray-300' : 'border-red-500 text-red-500'
            } rounded-md bg-gray-300 pl-3 py-2 w-full h-full overflow-y-scroll`}
          >
            {!parseErr ? (
              <ReactJSON
                theme="monokai"
                src={parsedJson}
                onEdit={false}
                indentWidth={indentWidth}
                style={jsonViewerStyles}
                quotesOnKeys={false}
                name={null}
              />
            ) : (
              parseErr.message
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
