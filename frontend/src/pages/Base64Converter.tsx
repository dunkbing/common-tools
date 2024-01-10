import React, { useState, useRef, useEffect } from 'react';
import {
  ClipboardGetText,
  ClipboardSetText,
} from '../../wailsjs/runtime/runtime';
import Button from '../components/Button';
import {
  IconClipboard,
  IconCopy,
  IconCornerRightUpDouble,
} from '@tabler/icons-react';
import TextArea from '../components/TextArea';

const Base64Converter: React.FC = () => {
  const [outputText, setOutputText] = useState<string>('');
  const [isEncode, setIsEncode] = useState<boolean>(true);

  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleTabKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const { current } = inputTextAreaRef;
        if (current) {
          const { selectionStart, selectionEnd, value } = current;
          const newValue =
            value.substring(0, selectionStart) +
            '    ' +
            value.substring(selectionEnd);
          current.value = newValue;
          current.setSelectionRange(selectionStart + 4, selectionStart + 4);
        }
      }
    };

    window.addEventListener('keydown', handleTabKeyPress);

    return () => {
      window.removeEventListener('keydown', handleTabKeyPress);
    };
  }, []);

  useEffect(() => {
    handleConvert(inputTextAreaRef.current?.value || '');
  }, [isEncode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputText(
      isEncode ? btoa(event.target.value) : atob(event.target.value)
    );
  };

  const handleEncodeDecodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsEncode(event.target.value === 'encode');
  };

  const handleConvert = (inputText: string) => {
    try {
      setOutputText(isEncode ? btoa(inputText) : atob(inputText));
    } catch (error) {
      setOutputText('Invalid input for decoding');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    ClipboardSetText(outputText);
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (inputTextAreaRef.current === null) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = clipboardText;
    handleConvert(clipboardText);
  };

  const handleUseAsInput = () => {
    if (inputTextAreaRef.current === null) return;
    inputTextAreaRef.current.focus();
    inputTextAreaRef.current.value = outputText;
    handleConvert(outputText);
  };

  return (
    <div className="flex flex-col p-8 w-full h-full mx-auto">
      <div className="h-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <label className="font-semibold">Input</label>
          <div className="flex flex-row gap-2 items-center">
            <label>
              <input
                type="radio"
                value="encode"
                checked={isEncode}
                onChange={handleEncodeDecodeChange}
              />
              <span className="ml-2">Encode</span>
            </label>
            <label>
              <input
                type="radio"
                value="decode"
                checked={!isEncode}
                onChange={handleEncodeDecodeChange}
              />
              <span className="ml-2">Decode</span>
            </label>
            <Button
              onClick={handlePaste}
              className="flex flex-row items-center gap-2"
            >
              Paste from Clipboard <IconClipboard />
            </Button>
          </div>
        </div>
        <TextArea
          ref={inputTextAreaRef}
          onChange={handleInputChange}
          placeholder={`
            - Paste your text here
            - Drag and drop a file here
            - Right click -> Load from file
            - Ctrl/Cmd + F to search
            - Ctrl/Cmd + Shift + F to replace
          `}
        />
      </div>
      <div className="h-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <label className="font-semibold">Output</label>
          <div className="flex flex-row gap-2 items-center">
            <Button
              onClick={handleCopy}
              className="flex flex-row items-center gap-1"
            >
              Copy
              <IconCopy />
            </Button>
            <Button
              onClick={handleUseAsInput}
              className="flex flex-row items-center gap-1"
            >
              Use as input
              <IconCornerRightUpDouble />
            </Button>
          </div>
        </div>
        <div className="border border-gray-300 rounded-md bg-slate-700 px-3 py-2 min-h-16 h-3/4">
          {outputText}
        </div>
      </div>
    </div>
  );
};

export default Base64Converter;
