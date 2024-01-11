import React, { useState, useEffect } from 'react';
import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode';
import TextArea from '../components/TextArea';

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
        <TextArea
          onChange={handleInputChange}
          value={jwtToken}
          placeholder="Paste your JWT token here..."
        />
      </div>
      <div className="w-1/2 pl-4">
        <label className="block mb-2 font-semibold">Decoded Token</label>
        {decodedToken ? (
          <div>
            <TextArea
              value={JSON.stringify(decodedToken.header)}
              onChange={(e) => handleEditHeader(e.target.value)}
            />
            <TextArea
              value={JSON.stringify(decodedToken.payload)}
              onChange={(e) => handleEditPayload(e.target.value)}
            />
            <TextArea
              value={decodedToken.signature}
              onChange={(e) => handleEditSignature(e.target.value)}
            />
          </div>
        ) : (
          <div className="text-red-500">Invalid JWT token</div>
        )}
      </div>
    </div>
  );
};

export default JWTDecoder;
