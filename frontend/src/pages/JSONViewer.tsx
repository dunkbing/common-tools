import React, { useState, useRef, useEffect } from 'react';
import {
  IconClipboard,
  IconCopy,
  IconCornerRightUpDouble,
} from '@tabler/icons-react';
import ReactJSON from '@microlink/react-json-view';

import TextArea from '../components/TextArea';
import {
  ClipboardGetText,
  ClipboardSetText,
} from '../../wailsjs/runtime/runtime';
import Button from '../components/Button';

const JsonViewer: React.FC = () => {
  const [formattedJson, setFormattedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);

  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // handleFormatJson(inputTextAreaRef.current?.value || '');
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleFormatJson(event.target.value);
  };

  const handleFormatJson = (inputText: string) => {
    try {
      const parsedJson = JSON.parse(inputText);
      setFormattedJson(parsedJson);
      setParseErr(null);
    } catch (error: any) {
      setParseErr(error);
    }
  };

  const handleCopy = () => {
    ClipboardSetText(JSON.stringify(formattedJson));
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (inputTextAreaRef.current === null) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = clipboardText;
    handleFormatJson(clipboardText);
  };

  const handleUseAsInput = () => {
    // if (inputTextAreaRef.current === null) return;
    // inputTextAreaRef.current.focus();
    // inputTextAreaRef.current.value = formattedJson;
    // handleFormatJson(formattedJson);
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
              Format
              <IconClipboard />
            </Button>
            <Button
              onClick={handlePaste}
              className="flex flex-row items-center gap-1"
            >
              Minify
              <IconClipboard />
            </Button>
          </div>
        </div>
        <TextArea
          className="h-full"
          ref={inputTextAreaRef}
          onChange={handleInputChange}
          placeholder="Paste your JSON here..."
        />
      </div>
      <div className="h-5/6 w-1/2">
        <div className="mb-4 flex flex-row items-center justify-between">
          <label className="font-semibold">Formatted JSON</label>
          <div className="flex flex-row gap-2 items-center">
            <Button
              onClick={handleCopy}
              className="flex flex-row items-center gap-1"
            >
              Copy <IconCopy />
            </Button>
            <Button
              onClick={handleUseAsInput}
              className="flex flex-row items-center gap-1"
            >
              Use as Input <IconCornerRightUpDouble />
            </Button>
          </div>
        </div>
        <div
          className={`border ${
            !parseErr ? 'border-gray-300' : 'border-red-500 text-red-500'
          } rounded-md bg-gray-300 px-3 py-2 h-full`}
        >
          {!parseErr ? (
            <ReactJSON src={formattedJson} onEdit={console.log} />
          ) : (
            parseErr.message
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
