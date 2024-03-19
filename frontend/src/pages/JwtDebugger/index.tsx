import ReactJSON from '@microlink/react-json-view';
import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import React, { useState, useEffect, useMemo, useReducer } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { jsonViewerStyles } from '@/lib/constants';
import JwtInput from './JwtInput';

export type SymmetricType = 'HS256' | 'HS384' | 'HS512';

export type AsymmetricType =
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512';

export type AlgorithmType = SymmetricType | AsymmetricType;

const fullTypeNames: Record<AlgorithmType, string> = {
  HS256: 'HMAC SHA-256`',
  HS384: 'HMAC SHA-384`',
  HS512: 'HMAC SHA-512`',
  RS256: 'RSA SHA-256`',
  RS384: 'RSA SHA-384`',
  RS512: 'RSA SHA-512`',
  ES256: 'ECDSA SHA-256`',
  ES384: 'ECDSA SHA-384`',
  ES512: 'ECDSA SHA-512`',
  PS256: 'RSA-PSS SHA-256`',
  PS384: 'RSA-PSS SHA-384`',
  PS512: 'RSA-PSS SHA-51',
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
  HS256: 'your-256-bit-secret',
  HS384: 'your-384-bit-secret',
  HS512: 'your-512-bit-secret',
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

const SymmetricSignature: React.FC<{ type: SymmetricType }> = ({ type }) => {
  const secret = `your-${type}-bit-secret`;

  return (
    <pre className="border p-4 rounded-md bg-gray-800 flex flex-col gap-1 text-blue-300">
      <span className="font-semibold">{fullTypeNames[type]}(</span>
      <span className="ml-5">base64UrlEncode(header) + "." +</span>
      <span className="ml-5">base64UrlEncode(payload),</span>
      <input
        name="secret"
        defaultValue={secret}
        className="border rounded-md px-2 py-1 focus:outline-none focus:ring focus:border-blue-300 ml-5"
        data-tippy=""
        data-original-title="Weak secret!"
      />
      <span className="is-base64-encoded-label">
        ){' '}
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
    <pre className="border p-4 rounded-md bg-gray-800 flex flex-col gap-1 text-blue-300 text-sm">
      <span className="font-semibold">{fullTypeNames[type]}(</span>
      <span className="ml-5">base64UrlEncode(header) + "." +</span>
      <span className="ml-5">base64UrlEncode(payload),</span>
      <textarea
        name="public-key"
        defaultValue={secret.public}
        rows={4}
        className="border rounded-md px-2 py-1 text-blue-500 focus:outline-none focus:ring focus:border-blue-500 ml-5"
      />
      <textarea
        name="private-key"
        defaultValue={secret.private}
        rows={4}
        className="border rounded-md px-2 py-1 text-blue-500 focus:outline-none focus:ring focus:border-blue-500 ml-5"
      />
      <span className="is-base64-encoded-label">)</span>
    </pre>
  );
};

interface DecodedToken {
  header: JwtHeader;
  payload: JwtPayload;
  signature?: string | { publicKey: string; privateKey: string };
}

export type Action =
  | { type: 'UPDATE_HEADER'; payload: JwtHeader }
  | { type: 'UPDATE_PAYLOAD'; payload: JwtPayload };

export function reducer(state: DecodedToken, action: Action): DecodedToken {
  switch (action.type) {
    case 'UPDATE_HEADER':
      return { ...state, header: action.payload };
    case 'UPDATE_PAYLOAD':
      return { ...state, payload: action.payload };
    default:
      return state;
  }
}

const Index: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const algorithms = useMemo(() => Object.keys(fullTypeNames), []);
  const [state, dispatch] = useReducer(reducer, {
    header: {},
    payload: {},
  });

  useEffect(() => {
    if (!jwtToken) {
      setDecodedToken(null);
      return;
    }

    try {
      const decoded = jwtDecode(jwtToken);
      const decodedHeader = jwtDecode(jwtToken, { header: true });
      setDecodedToken({
        header: decodedHeader,
        payload: decoded,
      });
    } catch (error) {
      setDecodedToken(null);
    }
  }, [jwtToken]);

  const editToken = (newToken: string) => {
    setJwtToken(newToken);
  };

  const handleEditPayload = (newPayload: string) => {
    try {
      const editedToken = `${decodedToken?.header}.${btoa(newPayload)}.${
        decodedToken?.signature
      }`;
      setJwtToken(editedToken);
    } catch (error) {
      console.error('Error editing payload:', error);
    }
  };

  const handleChangeAlgo = (algo: string) => {};

  const handleEditHeader = (newHeader: string) => {
    try {
      const editedToken = `${btoa(newHeader)}.${decodedToken?.payload}.${
        decodedToken?.signature
      }`;
      setJwtToken(editedToken);
    } catch (error) {
      console.error('Error editing header:', error);
    }
  };

  const handleEditSignature = (newSignature: string) => {
    try {
      const editedToken = `${decodedToken?.header}.${decodedToken?.payload}.${newSignature}`;
      setJwtToken(editedToken);
    } catch (error) {
      console.error('Error editing signature:', error);
    }
  };

  return (
    <div className="w-full h-[95%] flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-center space-x-2 mt-8">
        <Label className="font-semibold">Algorithm</Label>
        <Select onValueChange={handleChangeAlgo}>
          <SelectTrigger className="w-24 bg-slate-900 border-none h-9 text-sm">
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
      <div className="flex flex-row px-8 py-4 w-full h-full mx-auto">
        <div className="w-1/2 pr-4">
          <Label className="mb-2 font-semibold">JWT Token</Label>
          <JwtInput token={jwtToken} onChange={editToken} />
        </div>
        <div className="w-1/2 pl-4">
          <Label className="mb-2 font-semibold">Decoded Token</Label>
          <div className="h-full border border-gray-300 rounded-md">
            <div className="flex flex-col justify-evenly gap-2.5 px-4 pt-4">
              <div className="flex flex-col space-y-2">
                <span className="text-sm uppercase">
                  header (algorithm and token type)
                </span>
                <ReactJSON
                  theme="tube"
                  src={decodedToken?.header || {}}
                  quotesOnKeys={false}
                  name={null}
                  style={jsonViewerStyles}
                  onEdit={console.log}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm mt-2 uppercase">payload</span>
                <ReactJSON
                  theme="google"
                  src={decodedToken?.payload || {}}
                  quotesOnKeys={false}
                  name={null}
                  style={jsonViewerStyles}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <span className="text-sm mt-2 uppercase">verify signature</span>
                {/* <SymmetricSignature type="HS256" /> */}
                <AsymmetricSignature type="ES256" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
