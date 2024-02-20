import { Minify } from '$wailsjs/go/main/App';
import { ClipboardGetText, ClipboardSetText } from '$wailsjs/runtime/runtime';
import ReactJSON from '@microlink/react-json-view';
import { OnChange, OnMount } from '@monaco-editor/react';
import jsonPath from 'jsonpath';
import { Clipboard, Copy } from 'lucide-react';
import React, { useState, useRef, useContext } from 'react';

import sampleJson from '@/assets/sample.json';
import EditorPlaceHolder, {
  EditorPlaceHolderRef,
} from '@/components/EditorPlaceHolder';
import IconInput from '@/components/IconInput';
import IndentSelection from '@/components/IndentSelection';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { IndentContext, IndentContextType } from '@/contexts/IndentContext';
import { jsonViewerStyles } from '@/lib/constants';
import CheatSheetDialog from './CheatSheetDialog';

const jsonViewerInputKey = 'json-viewer-input';

const JsonViewer: React.FC = () => {
  const [parsedJson, setParsedJson] = useState<object>({});
  const [parseErr, setParseErr] = useState<Error | null>(null);
  const { indent, setIndent } = useContext(IndentContext) as IndentContextType;

  const editorRef = useRef<EditorPlaceHolderRef | null>(null);
  const parsedJsonRef = useRef<object>({});
  const { toast } = useToast();

  const handleEditorOnMount: OnMount = () => {
    const inputText = localStorage.getItem(jsonViewerInputKey);
    if (inputText) {
      parseJson(inputText);
      editorRef.current?.setValue(inputText);
    }
    formatJson(indent);
  };

  const handleInputChange: OnChange = (value) => {
    parseJson(value);
  };

  const parseJson = (inputText?: string) => {
    if (!inputText) {
      setParsedJson({});
      setParseErr(null);
      localStorage.setItem(jsonViewerInputKey, '');
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
      const parsedJson = JSON.parse(editorRef.current?.getValue() || '');
      const formattedJson = JSON.stringify(parsedJson, null, indentWidth);
      if (!editorRef.current) return;
      editorRef.current.focus();
      editorRef.current.setValue(formattedJson);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaste = async () => {
    const clipboardText = await ClipboardGetText();
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(clipboardText);
    parseJson(clipboardText);
  };

  const minifyJson = async () => {
    const minifiedJson = await Minify(
      'text/json',
      editorRef.current?.getValue() || '',
    );
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(minifiedJson);
  };

  const useSampleJson = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    editorRef.current.setValue(JSON.stringify(sampleJson, null, indent));
    parseJson(JSON.stringify(sampleJson, null, indent));
  };

  const handleCopy = async () => {
    const text = JSON.stringify(parsedJson, null, indent);
    const success = await ClipboardSetText(text);
    success &&
      toast({
        title: 'Copied to clipboard ✅',
        duration: 800,
      });
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

  const onChangeIndent = (value: number): void => {
    formatJson(value);
  };

  return (
    <div className="flex flex-row p-8 w-full gap-4" style={{ height: '90%' }}>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <Label className="font-semibold text-sm">Input</Label>
          <div className="flex flex-row gap-1 items-center">
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
        <EditorPlaceHolder
          language="json"
          ref={editorRef}
          className="h-full w-full text-sm text-justify overflow-y-scroll relative"
          placeholders={`Paste your JSON here...\nEg:
{
  "category": "fiction",
  "author": "J. R. R. Tolkien",
  "title": "The Lord of the Rings",
  "price": 11.59
}
`}
          handleEditorOnMount={handleEditorOnMount}
          handleInputChange={handleInputChange}
        />
      </div>
      <div className="h-full w-1/2">
        <div className="mb-3 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <label className="font-semibold text-sm">Formatted JSON</label>
            <IndentSelection onChangeIndent={onChangeIndent} />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button onClick={handleCopy} size="sm" className="gap-1">
              Copy <Copy size={16} />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 h-full max-h-full">
          <div className="flex flex-row gap-2 items-center">
            <IconInput
              className="text-sm bg-zinc-800"
              placeholder="JSON Path(Eg: $.store.book[?(@.price < 10)])"
              onChange={(event) => queryJson(event.target.value?.trim())}
            />
            <CheatSheetDialog />
          </div>
          <div
            className={`border ${
              !parseErr ? 'border-gray-300' : 'border-red-500 text-red-500'
            } rounded-md bg-gray-300 w-full h-full overflow-y-scroll`}
          >
            {!parseErr ? (
              <ReactJSON
                theme="monokai"
                src={parsedJson}
                onEdit={false}
                indentWidth={indent}
                style={jsonViewerStyles}
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
