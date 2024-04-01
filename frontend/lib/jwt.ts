import b64u from "base64url";
import * as jose from "jose";
import { pki } from "node-forge";
import { JWTHeaderParameters, JWTPayload } from "jose";

const strings = {
  common: {
    shareThisJwt: "Share JWT",
    jwtIoUrlCopied: "Copied",
    claims: {
      exp: "Expiration time (seconds since Unix epoch)",
      nbf: "Not valid before (seconds since Unix epoch)",
      iat: "Issued at (seconds since Unix epoch)",
      iss: "Issuer (who created and signed this token)",
      sub: "Subject (whom the token refers to)",
      aud: "Audience (who or what the token is intended for)",
      jti: "JWT ID (unique identifier for this token)",
      typ: "Type of token",
      azp: "Authorized party (the party to which this token was issued)",
      alg: "Signature or encryption algorithm",
      jku: "JSON Web Key Set URL",
      jwk: "JSON Web Key Set (embedded)",
      kid: "Key ID",
      x5u: "X.509 Certificate URL",
      x5t: "X.509 Fingerprint (SHA-1)",
      "x5t#S256": "X.509 Fingerprint (SHA-256)",
      cty: "Content type",
      crit: "Extensions or claims that MUST be processed or verified",
      enc: "Encryption algorithm",
      zip: "Compression algorithm",
      kty: "Key type",
      use: 'Intended use of key: "sig" or "enc" (other values accepted)',
      key_ops: "Intended operations for this key",
      sid: "Session ID (String identifier for a Session)",
      updated_at: "Last modification timestamp",
      at_hash: "Access Token hash value",
      c_hash: "Authorization Code hash value",
      s_hash: "State hash value",
      nonce: "Unique value associating request to token",
      auth_time: "Time when authentication occurred",
      amr: "Authentication methods array",
      acr: "Authentication context class",
    },
  },
  extension: {
    alreadyInstalled: "Already installed",
    addToBrowser: "Add to Browser",
    noJwtsFound: "No JWTs found",
    saveBackTo: "Save back to ",
  },
  editor: {
    signatureVerified: "signature verified",
    signatureInvalid: "invalid signature",
    jwtInvalid: "Invalid JWT",
  },
  warnings: {
    headerBase64Invalid:
      'Looks like your JWT header is not encoded correctly using base64url (https://tools.ietf.org/html/rfc4648#section-5). Note that padding ("=") must be omitted as per https://tools.ietf.org/html/rfc7515#section-2',
    payloadBase64Invalid:
      'Looks like your JWT payload is not encoded correctly using base64url (https://tools.ietf.org/html/rfc4648#section-5). Note that padding ("=") must be omitted as per https://tools.ietf.org/html/rfc7515#section-2',
    signatureBase64Invalid:
      'Looks like your JWT signature is not encoded correctly using base64url (https://tools.ietf.org/html/rfc4648#section-5). Note that padding ("=") must be omitted as per https://tools.ietf.org/html/rfc7515#section-2',
    payloadInvalidJSON:
      "Looks like your JWT payload is not a valid JSON object. JWT payloads must be top level JSON objects as per https://tools.ietf.org/html/rfc7519#section-7.2",
  },
};

function symmetricSecret(key: string, alg: string, base64Secret: boolean) {
  const secret = base64Secret ? Buffer.from(key, "base64") : Buffer.from(key);

  const len = Math.max(parseInt(alg.substring(-3), 10) >> 3, secret.byteLength);

  const padded = new Uint8Array(len);
  padded.set(secret);

  return Promise.resolve(padded);
}

enum Types {
  PRIVATE,
  PUBLIC,
}

const rawPublic = ({
  alg,
  oth,
  d,
  p,
  q,
  dp,
  dq,
  qi,
  use,
  key_ops,
  ext,
  ...jwk
}: any) => jwk;
const rawPrivate = ({ alg, use, key_ops, ext, ...jwk }: any) => jwk;

function getJoseKey(
  header: JWTHeaderParameters,
  key: string,
  base64Secret: boolean,
  type: Types
) {
  if (header.alg.indexOf("HS") === 0) {
    return symmetricSecret(key, header.alg, base64Secret);
  }

  switch (type) {
    case Types.PRIVATE:
      if (key.startsWith("-----BEGIN RSA PRIVATE KEY-----")) {
        key = pki.privateKeyInfoToPem(
          pki.wrapRsaPrivateKey(
            pki.privateKeyToAsn1(pki.privateKeyFromPem(key))
          )
        );
      }
      return Promise.any([
        jose.importPKCS8(key, header.alg),
        Promise.resolve()
          .then(() => JSON.parse(key))
          .then(rawPrivate)
          .then((jwk) => {
            if (!("d" in jwk)) throw new Error("not a private JWK");
            return jose.importJWK(jwk, header.alg);
          }),
      ]);
    case Types.PUBLIC:
      if (key.startsWith("-----BEGIN RSA PUBLIC KEY-----")) {
        key = pki.publicKeyToPem(pki.publicKeyFromPem(key));
      }
      return Promise.any([
        jose.importSPKI(key, header.alg),
        jose.importX509(key, header.alg),
        Promise.resolve()
          .then(() => JSON.parse(key))
          .then(rawPublic)
          .then((jwk) => {
            return jose.importJWK(jwk, header.alg);
          }),
      ]);
    default:
      throw new Error("unreachable");
  }
}

export async function sign(
  header: JWTHeaderParameters,
  payload: JWTPayload | string,
  secretOrPrivateKeyString: string,
  base64Secret = false
) {
  console.log(payload);
  if (!header.alg) {
    return Promise.reject(new Error('Missing "alg" claim in header'));
  }

  const key = await getJoseKey(
    header,
    secretOrPrivateKeyString,
    base64Secret,
    Types.PRIVATE
  );
  if (!(typeof payload === "string")) {
    payload = JSON.stringify(payload);
  }
  const encoder = new TextEncoder();
  return await new jose.CompactSign(encoder.encode(payload))
    .setProtectedHeader(header)
    .sign(key);
}

export async function verify(
  jwt: string,
  secretOrPublicKeyString: string,
  base64Secret = false
) {
  if (!isToken(jwt)) {
    return Promise.resolve({ validSignature: false, verifyResult: null });
  }

  const decoded = decode(jwt);

  if (!decoded.header?.alg || decoded.errors) {
    return Promise.resolve({ validSignature: false, verifyResult: null });
  }

  const key = await getJoseKey(
    decoded.header,
    secretOrPublicKeyString,
    base64Secret,
    Types.PUBLIC
  );

  const verifyResult = await jose.compactVerify(jwt, key);
  return {
    validSignature: true,
    validBase64: jwt
      .split(".")
      .reduce((valid, s) => valid && isValidBase64String(s), true),
    verifyResult,
  };
}

export function decode(jwt: string) {
  const result: {
    header?: JWTHeaderParameters;
    payload: JWTPayload | string;
    errors: boolean;
    warnings: string[];
  } = {
    payload: {},
    errors: false,
    warnings: [],
  };

  if (!jwt) {
    result.errors = true;
    return result;
  }

  const split = jwt.split(".");

  if (!isValidBase64String(split[2])) {
    result.warnings.push(strings.warnings.signatureBase64Invalid);
  }

  try {
    if (!isValidBase64String(split[0])) {
      result.warnings.push(strings.warnings.headerBase64Invalid);
    }
    result.header = JSON.parse(b64u.decode(split[0]));
  } catch (e) {
    result.errors = true;
  }

  try {
    if (!isValidBase64String(split[1])) {
      result.warnings.push(strings.warnings.payloadBase64Invalid);
    }
    result.payload = b64u.decode(split[1]);
  } catch (e) {}

  try {
    if (!isValidJSON(b64u.decode(split[1]))) {
      result.warnings.push(strings.warnings.payloadInvalidJSON);
    }
    result.payload = JSON.parse(b64u.decode(split[1]));
  } catch (e) {}

  return result;
}

export function isValidBase64String(s: string, allowPadding = false) {
  if (allowPadding) {
    return /^[a-zA-Z0-9_=-]*$/.test(s);
  }

  return /^[a-zA-Z0-9_-]*$/.test(s);
}

export function isValidJSON(payload: string) {
  try {
    JSON.parse(payload);
  } catch (e) {
    return false;
  }
  return true;
}

export function isToken(jwt: string, checkTypClaim = false) {
  const decoded = decode(jwt);

  if (decoded.errors) {
    return false;
  }

  if (checkTypClaim && decoded.header?.typ !== "JWT") {
    return false;
  }

  const split = jwt.split(".");
  let valid = true;
  split.forEach((s) => (valid = valid && isValidBase64String(s, true)));

  return valid;
}
