import React, { useState, useEffect } from 'react';
import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import ReactJSON from '@microlink/react-json-view';

import { jsonViewerStyles } from '@/lib/constants';
import { Textarea } from '@/components/ui/textarea';

interface DecodedToken {
  header: JwtHeader;
  payload: JwtPayload;
  signature?: string;
}

const JWTDecoder: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    if (jwtToken) {
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
    } else {
      setDecodedToken(null);
    }
  }, [jwtToken]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJwtToken(event.target.value);
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
    <div className="flex flex-row p-8 w-full h-full mx-auto">
      <div className="w-1/2 pr-4">
        <label className="block mb-2 font-semibold">JWT Token</label>
        <Textarea
          onChange={handleInputChange}
          value={jwtToken}
          placeholder="Paste your JWT token here..."
          className="h-5/6 bg-slate-700"
        />
      </div>
      <div className="w-1/2 pl-4">
        <label className="block mb-2 font-semibold">Decoded Token</label>
        <div className="h-5/6 border border-gray-300 rounded-md">
          <div className="flex flex-col justify-evenly gap-2.5 px-4 pt-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm">Header (algorithm and token type)</span>
              <ReactJSON
                theme="tube"
                src={decodedToken?.header || {}}
                quotesOnKeys={false}
                name={null}
                style={jsonViewerStyles}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm mt-2">Payload</span>
              <ReactJSON
                theme="google"
                src={decodedToken?.payload || {}}
                quotesOnKeys={false}
                name={null}
                style={jsonViewerStyles}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="text-sm mt-2">Signature</span>
              <pre className="border p-4 rounded-md bg-gray-800 flex flex-col gap-1 text-blue-300">
                <span className="font-semibold">HMACSHA256(</span>
                <span className="ml-5">base64UrlEncode(header) + "." +</span>
                <span className="ml-5">base64UrlEncode(payload),</span>
                <input
                  type="text"
                  name="secret"
                  value="your-256-bit-secret"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JWTDecoder;
