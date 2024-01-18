import React, { useState, useRef, useEffect } from 'react';
import { IconCopy, IconQuestionMark } from '@tabler/icons-react';
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

const sampleJson = {
  id: 1,
  name: 'John Doe',
  email: 'john@doe.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: 10001,
  },
  orders: [
    {
      id: 1,
      date: '2021-01-01',
      items: [
        {
          productId: 1,
          quantity: 2,
          price: 549,
        },
      ],
    },
    {
      id: 2,
      date: '2021-01-02',
      items: [
        {
          productId: 1,
          quantity: 1,
          price: 549,
        },
      ],
    },
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
          className="h-full w-full text-sm text-justify overflow-y-scroll"
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
        <div className={`flex flex-col gap-2 h-full max-h-full`}>
          <div className="flex flex-row gap-2 items-center">
            <Input
              className="text-sm bg-zinc-800"
              placeholder='JSON Path(Eg: $.orders[?(@.id == "1")].items[0])'
              onChange={(event) => queryJson(event.target.value?.trim())}
            />
            <div className="rounded-full bg-gray-500 p-1 hover:bg-gray-400 cursor-pointer">
              <IconQuestionMark size={20} />
            </div>
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
    </div>
  );
};

export default JsonViewer;
