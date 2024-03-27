"use client";

import React, { useState, useRef, useContext } from "react";
import { ClipboardGetText, ClipboardSetText } from "$wailsjs/runtime/runtime";
import json2ts from "json-to-ts";
import { Clipboard, Copy } from "lucide-react";

import Highlighter from "@/components/Highlighter";
import IndentSelection from "@/components/IndentSelection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import CodeMirror, {
  placeholder,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { json } from "@codemirror/legacy-modes/mode/javascript";

const jsonTransformInputKey = "json-transformer-input";

const JSONViewer: React.FC = () => {
  const { indent } = useContext(IndentContext) as IndentContextType;
  const [rawJSON, setRawJSON] = useState("");
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  const { toast } = useToast();
  const [transformedJson, setTransformedJson] = useState<string>();
  const [target, setTarget] = useState<string>();

  const handleInputChange = (value: string) => {
    void transform(value);
  };

  const transform = async (str?: string) => {
    if (!str) return;
    try {
      const obj = JSON.parse(str);
      const code = json2ts(obj, {
        rootName: "Root",
      });
      setTransformedJson(code.join("\n"));
    } catch (error) {
      console.log(error);
    }
  };

  const formatJson = (indentWidth: number) => {
    try {
      const parsedJson = JSON.parse(rawJSON);
      const formattedJson = JSON.stringify(parsedJson, null, indentWidth);
      if (!editorRef.current) return;
      editorRef.current.view?.focus();
      setRawJSON(formattedJson);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!editorRef.current) return;
    editorRef.current.view?.focus();
    setRawJSON(clipboardText);
    await transform(clipboardText);
  };

  const useSampleJson = () => {
    const sample = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    };
    if (!editorRef.current) return;
    editorRef.current.view?.focus();
    setRawJSON(JSON.stringify(sample, null, indent));
    void transform(JSON.stringify(sample, null, indent));
  };

  const handleCopy = async () => {
    const text = transformedJson;
    if (!text) return;
    const success = await ClipboardSetText(text);
    success &&
      toast({
        title: "Copied to clipboard ✅",
        duration: 800,
      });
  };

  const onChangeIndent = (value: number): void => {
    formatJson(value);
  };

  return (
    <div className="flex w-full flex-row gap-2 p-8" style={{ height: "90%" }}>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center space-x-3">
          <Label className="text-sm font-semibold">Input</Label>
          <div className="flex flex-row items-center gap-1">
            <Button onClick={handlePaste} className="gap-1" size="sm">
              Clipboard
              <Clipboard size={16} />
            </Button>
            <Button onClick={() => formatJson(indent)} size="sm">
              Format
            </Button>
            <Button onClick={useSampleJson} size="sm">
              Sample
            </Button>
          </div>
        </div>
        <CodeMirror
          ref={editorRef}
          value={rawJSON}
          lang="json"
          className="relative h-full w-full overflow-y-scroll"
          extensions={[
            placeholder(`Paste your JSON here...\nEg:
{
  "category": "fiction",
  "author": "J. R. R. Tolkien",
  "title": "The Lord of the Rings",
  "price": 11.59
}
`),
            EditorView.lineWrapping,
            new LanguageSupport(StreamLanguage.define(json)),
          ]}
          theme="dark"
          onChange={handleInputChange}
        />
      </div>
      <div className="flex flex-col items-center justify-center gap-1">
        <Label className="font-semibold">Transform to</Label>
        <Select>
          <SelectTrigger className="h-9 w-32 border-none bg-slate-900 text-sm">
            <SelectValue placeholder="CSV"></SelectValue>
          </SelectTrigger>
          <SelectContent className="">
            <SelectGroup>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="typescript">Typescript</SelectItem>
              <SelectItem value="yaml">YAML</SelectItem>
              <SelectItem value="toml">TOML</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center gap-2">
          <IndentSelection onChangeIndent={onChangeIndent} />
          <Button onClick={handleCopy} size="sm" className="gap-1">
            Copy <Copy size={16} />
          </Button>
        </div>
        <div
          className={
            "flex h-full max-h-full flex-col gap-2 rounded-md border border-gray-300 bg-slate-700 p-2 text-sm"
          }
        >
          <Highlighter language="typescript" code={transformedJson} />
        </div>
      </div>
    </div>
  );
};

export default JSONViewer;
