import React, { useState, useRef, useEffect } from 'react';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import ReactJSON from '@microlink/react-json-view';
import jsonPath from 'jsonpath';

import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';
import TextArea from '@/components/TextArea';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Dropdown, { Option } from '@/components/Dropdown';
import sampleJson from './sample.json';
import HtmlDialog from './CheatSheetDialog';

const jsonViewerInputKey = 'json-viewer-input';

const JsonViewer: React.FC = () => {
  const [parsedJson, setParsedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);
  const [indentWidth, setIndentWidth] = useState<number>(2);

  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const parsedJsonRef = useRef<object>({});

  useEffect(() => {
    const inputText = localStorage.getItem(jsonViewerInputKey);
    if (inputText) {
      parseJson(inputText);
      if (inputTextAreaRef.current) {
        inputTextAreaRef.current.value = inputText;
        inputTextAreaRef.current.focus();
      }
    }
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    parseJson(event.target.value);
  };

  const parseJson = (inputText: string) => {
    if (!inputText) {
      setParsedJson({});
      setParseErr(null);
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
    const parsedJson = JSON.parse(inputTextAreaRef.current?.value || '');
    const formattedJson = JSON.stringify(parsedJson, null, indentWidth);
    if (!inputTextAreaRef.current) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = formattedJson;
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!inputTextAreaRef.current) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = clipboardText;
    parseJson(clipboardText);
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
    inputTextAreaRef.current.value = JSON.stringify(
      sampleJson,
      null,
      indentWidth
    );
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

  const changeSpaces = (option: Option): void => {
    const newIndentWidth = Number(option.value);
    setIndentWidth(newIndentWidth);
    formatJson(newIndentWidth);
  };

  return (
    <div className="flex flex-row pb-8 px-8 w-full h-full items-center justify-center gap-8">
      <div className="h-5/6 w-1/2">
        <div className="mb-4 flex flex-row items-center justify-between">
          <label className="font-semibold">Input JSON</label>
          <div className="flex flex-row gap-2 items-center">
            <Button
              onClick={handlePaste}
              className="flex flex-row items-center gap-1"
            >
              Clipboard
              <IconClipboard />
            </Button>
            <Button
              onClick={() => formatJson(indentWidth)}
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
              onChange={changeSpaces}
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
              placeholder="JSON Path(Eg: $.store.book[?(@.price < 10)])"
              onChange={(event) => queryJson(event.target.value?.trim())}
            />
            <HtmlDialog />
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
