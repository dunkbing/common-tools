"use client";

import React, { useState, useRef, useContext } from "react";
import { Clipboard, Copy } from "lucide-react";
import { JSONPath } from "jsonpath-plus";
import { EditorView } from "codemirror";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { json } from "@codemirror/legacy-modes/mode/javascript";
import CodeMirror, {
  placeholder,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import ReactJSON from "@uiw/react-json-view";
import { vscodeTheme } from "@uiw/react-json-view/vscode";

import { Minify } from "$wailsjs/go/main/App";
import { ClipboardGetText, ClipboardSetText } from "$wailsjs/runtime/runtime";
import IconInput from "@/components/IconInput";
import IndentSelection from "@/components/IndentSelection";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { IndentContext, IndentContextType } from "@/contexts/IndentContext";
import { jsonViewerStyles, sampleJSON } from "@/lib/constants";
import CheatSheetDialog from "@/app/json-viewer/components/CheatSheetDialog";

const jsonViewerInputKey = "json-viewer-input";

const JSONViewer: React.FC = () => {
  const [rawJSON, setRawJSON] = useState("");
  const [parsedJson, setParsedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);
  const { indent } = useContext(IndentContext) as IndentContextType;
  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  const parsedJsonRef = useRef<object>({});
  const { toast } = useToast();

  const handleInputChange = (value: string) => {
    parseJson(value);
  };

  const parseJson = (inputText?: string) => {
    if (!inputText) {
      setParsedJson({});
      setParseErr(null);
      localStorage.setItem(jsonViewerInputKey, "");
      return;
    }

    try {
      const parsedJson = JSON.parse(inputText);
      setParsedJson(parsedJson);
      parsedJsonRef.current = parsedJson;
      setParseErr(null);
      localStorage.setItem(jsonViewerInputKey, inputText);
    } catch (error) {
      setParseErr(error as Error);
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
    parseJson(clipboardText);
  };

  const minifyJson = async () => {
    const minifiedJson = await Minify("text/json", rawJSON);
    if (!editorRef.current) return;
    editorRef.current.view?.focus();
    setRawJSON(minifiedJson);
  };

  const useSampleJson = () => {
    if (!editorRef.current) return;
    editorRef.current.view?.focus();
    setRawJSON(JSON.stringify(sampleJSON, null, indent));
    parseJson(JSON.stringify(sampleJSON, null, indent));
  };

  const handleCopy = async () => {
    const text = JSON.stringify(parsedJson, null, indent);
    const success = await ClipboardSetText(text);
    success &&
      toast({
        title: "Copied to clipboard ✅",
        duration: 800,
      });
  };

  const queryJson = (query: string) => {
    if (!query) {
      setParsedJson(parsedJsonRef.current);
      return;
    }
    try {
      const result = JSONPath({ path: query, json: parsedJsonRef.current });
      setParsedJson(result);
      setParseErr(null);
    } catch (error: any) {}
  };

  const onChangeIndent = (value: number): void => {
    formatJson(value);
  };

  return (
    <div className="flex w-full flex-row gap-4 p-8" style={{ height: "90%" }}>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <Label className="text-sm font-semibold">Input</Label>
          <div className="flex flex-row items-center gap-1">
            <Button onClick={handlePaste} className="gap-1" size="sm">
              Clipboard
              <Clipboard size={16} />
            </Button>
            <Button onClick={() => formatJson(indent)} size="sm">
              Format
            </Button>
            <Button onClick={minifyJson} size="sm">
              Minify
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
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <label className="text-sm font-semibold">Formatted JSON</label>
            <IndentSelection onChangeIndent={onChangeIndent} />
          </div>
          <div className="flex flex-row items-center gap-2">
            <Button onClick={handleCopy} size="sm" className="gap-1">
              Copy <Copy size={16} />
            </Button>
          </div>
        </div>
        <div className="flex h-full max-h-full flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <IconInput
              className="bg-zinc-800 text-sm"
              placeholder="JSON Path(Eg: $.store.book[?(@.price < 10)])"
              onChange={(event) => queryJson(event.target.value?.trim())}
            />
            <CheatSheetDialog />
          </div>
          <div
            className={`border ${
              !parseErr ? "border-gray-300" : "border-red-500 text-red-500"
            } h-full w-full overflow-y-scroll rounded-md bg-gray-300`}
          >
            {!parseErr ? (
              <ReactJSON
                value={parsedJson}
                style={{ ...vscodeTheme, ...jsonViewerStyles }}
                className="text-lg"
                displayDataTypes={false}
                indentWidth={indent * 10}
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

export default JSONViewer;
