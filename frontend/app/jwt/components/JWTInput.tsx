import {
  HighlightStyle,
  LanguageSupport,
  StreamLanguage,
  syntaxHighlighting,
} from "@codemirror/language";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";
import { Tag } from "@lezer/highlight";
import CodeMirror, { placeholder } from "@uiw/react-codemirror";
import { EditorView } from "codemirror";
import React from "react";
import "./styles.css";

const re = {
  signed: {
    jwt: /^([^.]+)\.([^.]+)\.([^.]+)$/,
    cm: /^([^.]+)(\.)([^.]+)(\.)([^.]+)$/,
  },
  encrypted: {
    jwt: /^([^.]+)\.([^.]*)\.([^.]+)\.([^.]+)\.([^.]+)$/,
    cm: /^([^.]+)(\.)([^.]*)(\.)([^.]+)(\.)([^.]+)(\.)([^.]+)$/,
  },
};

const jwtMode = simpleMode({
  start: [
    {
      regex: re.signed.cm,
      sol: true,
      token: ["jwt-header", "", "jwt-payload", "", "jwt-signature"],
    },
    {
      regex: re.encrypted.cm,
      sol: true,
      token: [
        "jwt-header",
        "",
        "jwt-key",
        "",
        "jwt-iv",
        "",
        "jwt-payload",
        "",
        "jwt-authtag",
      ],
    },
  ],
  languageData: {
    name: "jwt",
  },
});

jwtMode.tokenTable = {
  "jwt-header": Tag.define(),
  "jwt-payload": Tag.define(),
  "jwt-signature": Tag.define(),
  "jwt-key": Tag.define(),
  "jwt-iv": Tag.define(),
  "jwt-authtag": Tag.define(),
};

const chordProHighlighter = syntaxHighlighting(
  HighlightStyle.define(
    Object.entries(jwtMode.tokenTable).map(([k, v]) => ({
      tag: v,
      class: `cm-${k}`,
    }))
  )
);

type JWTInputProps = {
  token: string;
  onChange?: (jwt: string) => void;
};

const JWTInput: React.FC<JWTInputProps> = (props) => {
  const editToken = (value: string) => {
    props.onChange?.(value);
  };

  return (
    <div className="h-full w-full overflow-auto bg-gray-700">
      <CodeMirror
        className="h-full"
        value={props.token}
        width="100%"
        lang="jwt"
        onChange={editToken}
        extensions={[
          placeholder("Paste your JWT token here..."),
          EditorView.lineWrapping,
          new LanguageSupport(StreamLanguage.define(jwtMode), [
            chordProHighlighter,
          ]),
        ]}
        theme="dark"
      />
    </div>
  );
};

export default JWTInput;
