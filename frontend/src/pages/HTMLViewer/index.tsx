import React, { useState, useEffect } from 'react';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import { OnChange } from '@monaco-editor/react';

import { Button } from '@/components/ui/button';
import EditorPlaceHolder from '@/components/EditorPlaceHolder';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HTMLViewer: React.FC = () => {
  const [htmlText, setHtmlText] = useState<string>();

  useEffect(() => {}, [htmlText]);

  const handleInputChange: OnChange = (value) => {
    setHtmlText(value);
  };

  return (
    <div className="flex flex-row pb-8 px-8 w-full h-full items-center justify-center gap-8">
      <div className="h-5/6 w-1/2 pr-4">
        <div className="mb-3 flex flex-row items-center justify-between">
          <label className="font-semibold text-sm">Input</label>
          <div className="flex flex-row gap-1 items-center">
            <Button
              // onClick={handlePaste}
              size="sm"
              className="gap-1"
            >
              Clipboard
              <IconClipboard size={16} />
            </Button>
            <Button
              size="sm"
              // onClick={() => formatJson(indentWidth)}
            >
              Format
            </Button>
            <Button
              size="sm"
              // onClick={minifyJson}
            >
              Minify
            </Button>
            <Button
              // onClick={useSampleJson}
              size="sm"
            >
              Sample
            </Button>
          </div>
        </div>
        <EditorPlaceHolder
          language="html"
          // ref={editorRef}
          className="h-full w-full text-sm text-justify overflow-y-scroll relative"
          placeholders={'Paste or type your data here..'}
          // handleEditorOnMount={handleEditorOnMount}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className="h-5/6 w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <label className="font-semibold text-sm">Output</label>
            <Select>
              <SelectTrigger className="w-fit bg-slate-900 border-none h-9">
                <SelectValue placeholder="2 spaces">
                  {/* {indentWidth} spaces */}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="">
                <SelectGroup>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button size="sm" className="gap-1">
              Copy <IconCopy size={16} />
            </Button>
          </div>
        </div>
        <div className="h-full max-h-full border border-gray-300 bg-white text-black">
          <iframe
            id="iFrameMD"
            src="data:text/html;charset=utf-8,"
            className="w-full h-full"
            srcDoc={htmlText}
          />
        </div>
      </div>
    </div>
  );
};

export default HTMLViewer;
