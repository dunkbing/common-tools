import React, { useState, useEffect, useRef } from 'react';
import { IconClipboard, IconCopy } from '@tabler/icons-react';
import { OnChange, OnMount } from '@monaco-editor/react';
import beautify from 'js-beautify';

import { Button } from '@/components/ui/button';
import EditorPlaceHolder, {
  EditorPlaceHolderRef,
} from '@/components/EditorPlaceHolder';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';
import { Minify } from '$wailsjs/go/main/App';

const htmlViewerInputKey = 'html-viewer-input';

const HTMLViewer: React.FC = () => {
  const [htmlText, setHtmlText] = useState<string>();
  const editorRef = useRef<EditorPlaceHolderRef | null>(null);

  useEffect(() => {}, [htmlText]);

  const parseHtml = (text = '') => {
    setHtmlText(text);
    localStorage.setItem(htmlViewerInputKey, text);
  };

  const handleEditorOnMount: OnMount = () => {
    const inputText = localStorage.getItem(htmlViewerInputKey);
    if (inputText) {
      setHtmlText(inputText);
      editorRef.current?.focus();
      editorRef.current?.setValue(inputText);
    }
  };

  const handleInputChange: OnChange = (value) => {
    parseHtml(value);
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(clipboardText);
    parseHtml(clipboardText);
  };

  const formatHtml = (indentWidth: number) => {
    const text = editorRef.current?.getValue() || '';
    const formattedHtml = beautify.html(text, {
      indent_size: indentWidth,
      indent_char: ' ',
      indent_with_tabs: false,
      preserve_newlines: true,
      max_preserve_newlines: 10,
      wrap_line_length: 0,
      wrap_attributes: 'auto',
      unformatted: [],
      content_unformatted: [],
    });
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(formattedHtml);
  };

  const minifyHtml = async () => {
    const text = editorRef.current?.getValue() || '';
    const minifiedHtml = await Minify('text/html', text);
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(minifiedHtml);
  };

  const handleCopy = () => {
    const text = editorRef.current?.getValue() || '';
    ClipboardSetText(text);
  };

  const useSampleHtml = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const sample = `<!DOCTYPE html>
<html>
  <head>
    <title>This is a sample HTML page</title>
  </head>
  <body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`;
    editorRef.current.setValue(sample);
    parseHtml(sample);
  };

  return (
    <div className="flex flex-col p-8 w-full h-full gap-3">
      <div className="flex flex-row items-center px-4 justify-between">
        <div className="flex flex-row gap-1 items-center">
          <Button onClick={handlePaste} size="sm" className="gap-1">
            Clipboard
            <IconClipboard size={16} />
          </Button>
          <Button size="sm" onClick={() => formatHtml(2)}>
            Format
          </Button>
          <Button size="sm" onClick={minifyHtml}>
            Minify
          </Button>
          <Button onClick={useSampleHtml} size="sm">
            Sample
          </Button>
          <Button size="sm" onClick={handleCopy}>
            Copy <IconCopy size={16} />
          </Button>
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
        <label className="font-semibold text-sm">Output</label>
      </div>
      <div className="flex flex-row px-4 w-full h-full justify-center gap-4">
        <div className="h-full w-1/2">
          <EditorPlaceHolder
            ref={editorRef}
            language="html"
            className="h-full w-full text-sm text-justify overflow-y-scroll relative"
            placeholders={'Paste or type your data here..'}
            handleEditorOnMount={handleEditorOnMount}
            handleInputChange={handleInputChange}
          />
        </div>
        <div className="h-full w-1/2">
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
    </div>
  );
};

export default HTMLViewer;
