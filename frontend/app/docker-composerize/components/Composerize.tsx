"use client";

import React, { useEffect, useRef, useState } from "react";

import { ClipboardGetText, ClipboardSetText } from "$wailsjs/runtime/runtime";
import { Textarea } from "@/components/ui/textarea";
import InputActions, {
  ConvertType,
} from "@/app/docker-composerize/components/InputActions";
import OutputActions from "@/app/base64-string-encode-decode/components/OutputActions";
import { EditorView } from "codemirror";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { yaml } from "@codemirror/legacy-modes/mode/yaml";
import CodeMirror, {
  placeholder,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import composerize from "composerize";
import decomposerize from "decomposerize";

const Composerize: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [convertType, setConvertType] = useState<ConvertType>("composerize");

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);

  const placeholderText: Record<ConvertType, string> = {
    composerize: "Enter your docker run command here",
    "de-composerize": "Enter your docker-compose here",
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    handleConvert(value);
  };

  const handleConverterChange = (type: ConvertType) => {
    setConvertType(type);
  };

  useEffect(() => {
    handleConvert(inputText);
  }, [convertType]);

  const handleConvert = (text: string) => {
    try {
      if (convertType === "composerize") {
        setOutputText(composerize(text) || "");
        return;
      }
      setOutputText(decomposerize(text) || "");
    } catch (error) {
      setOutputText("");
    }
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(outputText);
    void ClipboardSetText(outputText);
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (editorRef.current === null) return;
    editorRef.current.view?.focus();
    setInputText(clipboardText);
    handleConvert(clipboardText);
  };

  const handleUseAsInput = () => {
    if (editorRef.current === null || !outputText) return;
    editorRef.current.view?.focus();
    setInputText(outputText);
    handleConvert(outputText);
    if (convertType === "composerize") {
      setConvertType("de-composerize");
    } else {
      setConvertType("composerize");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col space-y-4 px-8 py-6">
      <div className="flex h-1/2 flex-col">
        <InputActions
          type={convertType}
          onConverterChange={handleConverterChange}
          onPaste={handlePaste}
        />
        <CodeMirror
          ref={editorRef}
          value={inputText}
          lang="yaml"
          className="h-full"
          extensions={[
            placeholder(placeholderText[convertType]),
            EditorView.lineWrapping,
            new LanguageSupport(StreamLanguage.define(yaml)),
          ]}
          theme="dark"
          onChange={handleInputChange}
        />
      </div>
      <div className="h-1/2">
        <OutputActions
          handleCopy={handleCopy}
          handleUseAsInput={handleUseAsInput}
        />
        <Textarea
          className="h-3/4 min-h-16 overflow-y-auto break-all bg-slate-700 px-3 py-2 font-semibold text-orange-200"
          disabled
          value={outputText}
          placeholder="Output will appear here..."
        />
      </div>
    </div>
  );
};

export default Composerize;
