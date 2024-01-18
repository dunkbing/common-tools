import React, { useState, useRef, useEffect } from 'react';
import { IconCopy } from '@tabler/icons-react';
import ReactJSON from '@microlink/react-json-view';
import jsonPath from 'jsonpath';

import TextArea from '../components/TextArea';
import {
  ClipboardGetText,
  ClipboardSetText,
} from '../../wailsjs/runtime/runtime';
import Button from '../components/Button';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';

// const sampleJson = {
//   menu: {
//     id: 'file',
//     value: 'File',
//     menuitem: [
//       { value: 'New', onclick: 'CreateNewDoc()' },
//       { value: 'Open', onclick: 'OpenDoc()' },
//       { value: 'Close', onclick: 'CloseDoc()' },
//     ],
//   },
// };

const sampleJson = {
  id: '0001',
  type: 'donut',
  name: 'Cake',
  ppu: 0.55,
  batters: {
    batter: [
      { id: '1001', type: 'Regular' },
      { id: '1002', type: 'Chocolate' },
      { id: '1003', type: 'Blueberry' },
      { id: '1004', type: "Devil's Food" },
    ],
  },
  topping: [
    { id: '5001', type: 'None' },
    { id: '5002', type: 'Glazed' },
    { id: '5005', type: 'Sugar' },
    { id: '5007', type: 'Powdered Sugar' },
    { id: '5006', type: 'Chocolate with Sprinkles' },
    { id: '5003', type: 'Chocolate' },
    { id: '5004', type: 'Maple' },
  ],
};

const JsonViewer: React.FC = () => {
  const [parsedJson, setParsedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);
  const [indentWidth, setIndentWidth] = useState<number>(2);

  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const parsedJsonRef = useRef<object>({});

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    parseJson(event.target.value);
  };

  const parseJson = (inputText: string) => {
    try {
      const parsedJson = JSON.parse(inputText);
      setParsedJson(parsedJson);
      parsedJsonRef.current = parsedJson;
      setParseErr(null);
    } catch (error: any) {
      setParseErr(error);
    }
  };

  const formatJson = () => {
    const parsedJson = JSON.parse(inputTextAreaRef.current?.value || '');
    const formattedJson = JSON.stringify(parsedJson, null, 2);
    if (!inputTextAreaRef.current) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = formattedJson;
  };

  const minifyJson = () => {
    const parsedJson = JSON.parse(inputTextAreaRef.current?.value || '');
    const minifiedJson = JSON.stringify(parsedJson);
    if (!inputTextAreaRef.current) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = minifiedJson;
  };

  const useSampleJson = () => {
    if (!inputTextAreaRef.current) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = JSON.stringify(sampleJson, null, 2);
    parseJson(JSON.stringify(sampleJson, null, 2));
  };

  const handleCopy = () => {
    ClipboardSetText(JSON.stringify(parsedJson));
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (inputTextAreaRef.current === null) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = clipboardText;
    parseJson(clipboardText);
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

  return (
    <div className="flex flex-row pb-8 px-8 w-full h-full items-center justify-center gap-8">
      <div className="h-5/6 w-1/2">
        <div className="mb-4 flex flex-row items-center justify-between">
          <label className="font-semibold">Input JSON</label>
          <div className="flex flex-row gap-2 items-center">
            <Button
              onClick={formatJson}
              className="flex flex-row items-center gap-1"
            >
              Format
            </Button>
            <Button
              onClick={minifyJson}
              className="flex flex-row items-center gap-1"
            >
              Minify
            </Button>
            <Button
              onClick={useSampleJson}
              className="flex flex-row items-center gap-1"
            >
              Sample
            </Button>
          </div>
        </div>
        <TextArea
          className="h-full w-full text-sm text-justify overflow-scroll"
          ref={inputTextAreaRef}
          onChange={handleInputChange}
          placeholder="Paste your JSON here..."
        />
      </div>
      <div className="h-5/6 w-1/2">
        <div className="mb-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <label className="font-semibold">Formatted JSON</label>
            <Dropdown
              onChange={(option) => setIndentWidth(Number(option.value))}
              options={[
                { label: '2 spaces', value: '2' },
                { label: '4 spaces', value: '4' },
              ]}
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              onClick={handleCopy}
              className="flex flex-row items-center gap-1"
            >
              Copy <IconCopy size={16} />
            </Button>
          </div>
        </div>
        <div
          className={`flex flex-col gap-2 border ${
            !parseErr ? 'border-gray-300' : 'border-red-500 text-red-500'
          } rounded-md bg-gray-300 px-3 py-2 h-full`}
        >
          <Input
            className="text-sm bg-zinc-600"
            placeholder="JSON Path(Eg: $.menu.menuitem[0].value)"
            onChange={(event) => queryJson(event.target.value?.trim())}
          />
          {!parseErr ? (
            <ReactJSON
              theme="monokai"
              src={parsedJson}
              onEdit={console.log}
              indentWidth={indentWidth}
              style={{
                padding: '0.7rem',
                borderRadius: '0.4rem',
              }}
              quotesOnKeys={false}
              name={null}
            />
          ) : (
            parseErr.message
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
