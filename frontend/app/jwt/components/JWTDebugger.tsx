"use client";

import { json } from "@codemirror/legacy-modes/mode/javascript";
import CodeMirror from "@uiw/react-codemirror";
import * as jose from "jose";
import React, { useEffect, useMemo, useReducer, useState } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { EditorView } from "codemirror";
import { JWTHeaderParameters, JWTPayload } from "jose";
import JWTInput from "./JWTInput";

const symmetricTypes = ["HS256", "HS384", "HS512"] as const;
export type SymmetricType = (typeof symmetricTypes)[number];

const asymmetricTypes = [
  "RS256",
  "RS384",
  "RS512",
  "ES256",
  "ES384",
  "ES512",
  "PS256",
  "PS384",
  "PS512",
] as const;
export type AsymmetricType = (typeof asymmetricTypes)[number];

export type AlgorithmType = SymmetricType | AsymmetricType;

const fullTypeNames: Record<AlgorithmType, string> = {
  HS256: "HMAC SHA-256",
  HS384: "HMAC SHA-384",
  HS512: "HMAC SHA-512",
  RS256: "RSA SHA-256",
  RS384: "RSA SHA-384",
  RS512: "RSA SHA-512",
  ES256: "ECDSA SHA-256",
  ES384: "ECDSA SHA-384",
  ES512: "ECDSA SHA-512",
  PS256: "RSA-PSS SHA-256",
  PS384: "RSA-PSS SHA-384",
  PS512: "RSA-PSS SHA-512",
};

const publicKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEEVs/o5+uQbTjL3chynL4wXgUg2R9
q9UU8I5mEovUf86QZ7kOBIjJwqnzD1omageEHWwHdBO6B+dFabmdT9POxg==
-----END PUBLIC KEY-----`;

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu
NMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ
qgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulg
p2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlR
ZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwi
VuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV
laAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8
sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83H
mQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwY
dgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cw
ta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQ
DM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2T
N0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t
0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPv
t8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDU
AhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk
48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISL
DY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnK
xt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEA
mNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh
2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfz
et6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhr
VBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicD
TQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cnc
dn/RsYEONbwQSjIfMPkvxF+8HQ==
-----END PRIVATE KEY-----`;

const secrets: Record<
  AlgorithmType,
  string | { publicKey: string; privateKey: string }
> = {
  HS256: "your-256-bit-secret",
  HS384: "your-384-bit-secret",
  HS512: "your-512-bit-secret",
  RS256: {
    publicKey,
    privateKey,
  },
  RS384: {
    publicKey,
    privateKey,
  },
  RS512: {
    publicKey,
    privateKey,
  },
  ES256: { publicKey, privateKey },
  ES384: { publicKey, privateKey },
  ES512: { publicKey, privateKey },
  PS256: { publicKey, privateKey },
  PS384: { publicKey, privateKey },
  PS512: { publicKey, privateKey },
};

const defaultSecret = "your-256-bit-secret";

const SymmetricSignature: React.FC<{ type: SymmetricType }> = ({ type }) => {
  return (
    <pre className="flex flex-col gap-1 rounded-md border bg-gray-800 p-4 text-xs text-blue-300">
      <span className="font-semibold">{fullTypeNames[type]}(</span>
      <span className="ml-5">base64UrlEncode(header) + &quot;.&quot; +</span>
      <span className="ml-5">base64UrlEncode(payload),</span>
      <input
        name="secret"
        defaultValue={defaultSecret}
        className="ml-5 rounded-md border px-2 py-1 focus:border-blue-300 focus:outline-none focus:ring"
        data-tippy=""
        data-original-title="Weak secret!"
      />
      <span className="is-base64-encoded-label">
        ){" "}
        <input
          id="is-base64-encoded"
          type="checkbox"
          name="is-base64-encoded"
          className="mr-2"
        />
        <label htmlFor="is-base64-encoded" className="cursor-pointer">
          secret base64 encoded
        </label>
      </span>
    </pre>
  );
};

const AsymmetricSignature: React.FC<{ type: AsymmetricType }> = ({ type }) => {
  const secret = {
    public: publicKey,
    private: privateKey,
  };

  return (
    <pre className="flex flex-col gap-1 rounded-md border bg-gray-800 p-4 text-xs text-blue-300">
      <span className="font-semibold">{fullTypeNames[type]}(</span>
      <span className="ml-5">base64UrlEncode(header) + &quot;.&quot; +</span>
      <span className="ml-5">base64UrlEncode(payload),</span>
      <textarea
        name="public-key"
        defaultValue={secret.public}
        rows={4}
        className="ml-5 rounded-md border px-2 py-1 text-blue-500 focus:border-blue-500 focus:outline-none focus:ring"
      />
      <textarea
        name="private-key"
        defaultValue={secret.private}
        rows={4}
        className="ml-5 rounded-md border px-2 py-1 text-blue-500 focus:border-blue-500 focus:outline-none focus:ring"
      />
      <span className="is-base64-encoded-label">)</span>
    </pre>
  );
};

type AsymmetricKey = { publicKey: string; privateKey: string };

interface JWTState {
  header: JWTHeaderParameters;
  payload: JWTPayload;
  signature?: string | AsymmetricKey;
}

export type Action = {
  type?: "UPDATE_HEADER" | "UPDATE_PAYLOAD";
  payload: JWTHeaderParameters | JWTPayload | any;
};

export function reducer(state: JWTState, action: Action): JWTState {
  switch (action.type) {
    case "UPDATE_HEADER":
      return { ...state, header: action.payload as JWTHeaderParameters };
    case "UPDATE_PAYLOAD":
      return { ...state, payload: action.payload as JWTPayload };
    default:
      return { ...state, ...action.payload };
  }
}

const defaultToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

const JWTDebugger: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>(defaultToken);
  const [decodedToken, setDecodedToken] = useState<JWTState | null>(null);
  const algorithms = useMemo(() => Object.keys(fullTypeNames), []);
  const [state, dispatch] = useReducer(reducer, {
    header: {
      alg: "HS256",
    },
    payload: {},
    signature: defaultSecret,
  });

  useEffect(() => {
    if (!jwtToken) {
      dispatch({
        payload: {
          header: null,
          payload: null,
        },
      });
      return;
    }

    (async () => {
      try {
        const decoded = await jose.jwtVerify(
          jwtToken,
          new TextEncoder().encode(state.signature as string)
        );
        dispatch({
          payload: {
            header: decoded.protectedHeader,
            payload: decoded.payload,
          },
        });
      } catch (error) {}
    })();
  }, [jwtToken]);

  const editToken = (newToken: string) => {
    setJwtToken(newToken);
  };

  const handleChangeAlgo = async (alg: string) => {
    const newHeader = { ...state.header, alg };
    dispatch({ payload: { header: newHeader } });
    const token = await new jose.SignJWT(state.payload)
      .setProtectedHeader(newHeader)
      .sign(new TextEncoder().encode(state.signature as string));
    setJwtToken(token);
  };

  const handleEditPayload = async (newPayload: string) => {
    try {
      const token = await new jose.SignJWT(JSON.parse(newPayload))
        .setProtectedHeader(state.header)
        .sign(new TextEncoder().encode(state.signature as string));

      setJwtToken(token);
    } catch (error) {
      console.error("Error editing payload:", error);
    }
  };

  const handleEditHeader = async (newHeaderStr: string) => {
    try {
      const alg = state.header.alg;
      const signature = symmetricTypes.includes(alg as never)
        ? new TextEncoder().encode(state.signature as string)
        : await jose.importPKCS8(
            (state.signature as AsymmetricKey).privateKey,
            alg
          );
      const token = await new jose.SignJWT(state.payload)
        .setProtectedHeader(JSON.parse(newHeaderStr))
        // .sign(new TextEncoder().encode(signature));
        .sign(signature);

      setJwtToken(token);
    } catch (error) {
      console.error("Error editing header:", error);
    }
  };

  const handleEditSignature = (newSignature: string) => {
    try {
      const editedToken = `${decodedToken?.header}.${decodedToken?.payload}.${newSignature}`;
      setJwtToken(editedToken);
    } catch (error) {
      console.error("Error editing signature:", error);
    }
  };

  return (
    <div className="flex h-[95%] w-full flex-col items-center justify-center space-y-2 py-4">
      <div className="flex flex-row items-center justify-center space-x-2">
        <Label className="font-semibold">Algorithm</Label>
        <Select onValueChange={handleChangeAlgo}>
          <SelectTrigger className="h-9 w-24 border-none bg-slate-900 text-sm">
            <SelectValue placeholder="HS256"></SelectValue>
          </SelectTrigger>
          <SelectContent className="">
            <SelectGroup>
              {algorithms.map((al) => (
                <SelectItem key={al} value={al}>
                  {al}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mx-auto flex h-full w-full flex-row px-8 pt-2">
        <div className="w-1/2 pr-4">
          <Label className="mb-2 font-semibold">JWT Token</Label>
          <JWTInput token={jwtToken} onChange={editToken} />
        </div>
        <div className="w-1/2 pl-4">
          <Label className="mb-2 font-semibold">Decoded Token</Label>
          <div className="h-full rounded-md border border-gray-300">
            <div className="flex flex-col justify-evenly gap-3 px-4 py-4">
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm uppercase">
                  header (algorithm and token type)
                </span>
                <CodeMirror
                  value={JSON.stringify(state?.header || {}, null, 2)}
                  lang="json"
                  className="h-32"
                  extensions={[
                    EditorView.lineWrapping,
                    new LanguageSupport(StreamLanguage.define(json)),
                  ]}
                  theme="dark"
                  onChange={handleEditHeader}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm uppercase">payload</span>
                <CodeMirror
                  value={JSON.stringify(state?.payload || {}, null, 2)}
                  lang="json"
                  className="h-32"
                  extensions={[
                    EditorView.lineWrapping,
                    new LanguageSupport(StreamLanguage.define(json)),
                  ]}
                  theme="dark"
                  onChange={handleEditPayload}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <span className="text-sm uppercase">verify signature</span>
                {symmetricTypes.includes(state.header.alg as SymmetricType) && (
                  <SymmetricSignature
                    type={state.header.alg as SymmetricType}
                  />
                )}
                {asymmetricTypes.includes(
                  state.header.alg as AsymmetricType
                ) && (
                  <AsymmetricSignature
                    type={state.header.alg as AsymmetricType}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTDebugger;
