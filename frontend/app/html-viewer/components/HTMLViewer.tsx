"use client";

import React, { useState, useRef, useContext, useCallback } from "react";
import CodeMirror, {
  placeholder,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import beautify from "js-beautify";
import { Clipboard, Copy } from "lucide-react";

import { Minify } from "$wailsjs/go/main/App";
import { ClipboardGetText, ClipboardSetText } from "$wailsjs/runtime/runtime";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { IndentContext, IndentContextType } from "@/contexts/IndentContext";
import { EditorView } from "codemirror";

const htmlViewerInputKey = "html-viewer-input";

const HTMLViewer: React.FC = () => {
  const [htmlText, setHtmlText] = useState<string>("");
  const { indent, setIndent } = useContext(IndentContext) as IndentContextType;
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  const { toast } = useToast();

  const parseHtml = (text = "") => {
    setHtmlText(text);
    localStorage.setItem(htmlViewerInputKey, text);
  };

  const handleInputChange = useCallback((value: string) => {
    parseHtml(value);
  }, []);

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!editorRef.current) return;
    editorRef.current?.editor?.focus();
    editorRef.current?.view?.focus();
    parseHtml(clipboardText);
  };

  const formatHtml = (indent: number) => {
    const formattedHtml = beautify.html(htmlText, {
      indent_size: indent,
      indent_char: " ",
      indent_with_tabs: false,
      preserve_newlines: true,
      max_preserve_newlines: 10,
      wrap_line_length: 0,
      wrap_attributes: "auto",
      unformatted: [],
      content_unformatted: [],
    });
    if (!editorRef.current) return;
    setHtmlText(formattedHtml);
    localStorage.setItem(htmlViewerInputKey, formattedHtml);
  };

  const minifyHtml = async () => {
    const minifiedHtml = await Minify("text/html", htmlText);
    if (!editorRef.current) return;
    editorRef.current?.view?.focus();
    setHtmlText(minifiedHtml);
  };

  const handleCopy = async () => {
    const success = await ClipboardSetText(htmlText);
    success &&
      toast({
        title: "Copied to clipboard ✅",
        duration: 800,
      });
  };

  const useSampleHtml = () => {
    if (!editorRef.current) return;
    editorRef.current?.view?.focus();
    const sample = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>This is a sample HTML page</title>
  </head>
  <body>
    <h1>This is a heading</h1>
    <p>This is a paragraph.</p>
  </body>
</html>`;
    setHtmlText(sample);
    parseHtml(sample);
  };

  const changeSpaces = (value: string): void => {
    const newIndentWidth = Number(value);
    setIndent(newIndentWidth);
    formatHtml(newIndentWidth);
  };

  return (
    <div className="flex h-full w-full flex-col gap-3 p-8">
      <div className="flex flex-row items-center justify-between px-4">
        <div className="flex flex-row items-center gap-1">
          <Button onClick={handlePaste} size="sm" className="gap-1">
            Clipboard
            <Clipboard size={16} />
          </Button>
          <Button size="sm" onClick={() => formatHtml(indent)}>
            Format
          </Button>
          <Button size="sm" onClick={minifyHtml}>
            Minify
          </Button>
          <Button onClick={useSampleHtml} size="sm">
            Sample
          </Button>
          <Button size="sm" onClick={handleCopy}>
            Copy <Copy size={16} />
          </Button>
          <Select onValueChange={changeSpaces}>
            <SelectTrigger className="h-9 w-fit border-none bg-slate-900">
              <SelectValue placeholder={`${indent} spaces`}>
                {indent} spaces
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
        <label className="text-sm font-semibold">Output</label>
      </div>
      <div className="flex h-full w-full flex-row justify-center gap-4 px-4">
        <div className="h-full w-1/2 overflow-auto bg-gray-700">
          <CodeMirror
            value={htmlText}
            ref={editorRef}
            className="h-full"
            width="100%"
            lang="html"
            onChange={handleInputChange}
            extensions={[
              html(),
              placeholder("Paste or type your code here..."),
              EditorView.lineWrapping,
            ]}
            theme="dark"
          />
        </div>
        <div className="h-full w-1/2">
          <div className="h-full max-h-full border border-gray-300 bg-white text-black">
            <iframe
              title="HTML Viewer"
              id="iFrameMD"
              src="data:text/html;charset=utf-8,"
              className="h-full w-full"
              srcDoc={htmlText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLViewer;
