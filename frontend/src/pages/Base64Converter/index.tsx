import React, { useState, useRef, useEffect } from 'react';

import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';
import { Textarea } from '@/components/ui/textarea';
import InputActions from './InputActions';
import OutputActions from './OutputActions';

const Base64Converter: React.FC = () => {
  const [outputText, setOutputText] = useState<string>('');
  const [isEncode, setIsEncode] = useState<boolean>(true);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleTabKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const { current } = textAreaRef;
        if (current) {
          const { selectionStart, selectionEnd, value } = current;
          const newValue = `${value.substring(
            0,
            selectionStart,
          )}    ${value.substring(selectionEnd)}`;
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
    handleConvert(textAreaRef.current?.value || '');
  }, [isEncode]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutputText(
      isEncode ? btoa(event.target.value) : atob(event.target.value),
    );
  };

  const handleEncodeDecodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
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
    if (textAreaRef.current === null) return;
    textAreaRef.current.focus();
    textAreaRef.current.value = clipboardText;
    handleConvert(clipboardText);
  };

  const handleUseAsInput = () => {
    if (textAreaRef.current === null) return;
    textAreaRef.current.focus();
    textAreaRef.current.value = outputText;
    handleConvert(outputText);
  };

  return (
    <div className="flex flex-col p-8 w-full h-full mx-auto">
      <div className="h-1/2 flex flex-col gap-1">
        <InputActions
          isEncode={isEncode}
          handleEncodeDecodeChange={handleEncodeDecodeChange}
          handlePaste={handlePaste}
        />
        <Textarea
          className="h-3/4 bg-slate-700"
          ref={textAreaRef}
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
        <OutputActions
          handleCopy={handleCopy}
          handleUseAsInput={handleUseAsInput}
        />
        <Textarea
          className="bg-slate-700 px-3 py-2 min-h-16 h-3/4 break-all overflow-y-auto"
          value={outputText}
          disabled
        />
      </div>
    </div>
  );
};

export default Base64Converter;
