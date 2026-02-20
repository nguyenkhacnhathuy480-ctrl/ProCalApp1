// SECURITY UTILITIES (UPDATED)
// - Keep legacy hashString (compatible with constants.PRO_ACTIVATION_HASHES).
// - Use Web Crypto HMAC-SHA256 to sign tokens (generateSecureToken / verifySecureToken).
// - Tokens include expiry (exp) to avoid permanent activation when token is copied.

const SALT = "_PROFIT_SECURE_2024"; // visible client-side (cannot be secret in client-only apps)
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

const encoder = (s: string) => new TextEncoder().encode(s);

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Legacy hash used for comparing activation codes stored in constants.
 * Algorithm kept for backward compatibility:
 * Base64(Reverse(Input) + Salt)
 */
export const hashString = (str: string): string => {
  try {
    const reversed = str.trim().toUpperCase().split('').reverse().join('');
    return btoa(reversed + SALT);
  } catch (e) {
    // Keep simple failure mode
    console.error("Hashing error", e);
    return "";
  }
};

/**
 * Create an HMAC-SHA256 signature for a payload string using SALT as key.
 * Returns Base64(signature).
 */
const signPayload = async (payloadStr: string): Promise<string> => {
  const keyData = encoder(SALT);
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder(payloadStr));
  return arrayBufferToBase64(sig);
};

/**
 * Generates a signed token for storing in localStorage.
 * Token payload includes status, timestamp, device, and expiry.
 * Returns Base64(JSON({ payload, signature }))
 */
export const generateSecureToken = async (): Promise<string> => {
  const payload = {
    status: 'active',
    timestamp: Date.now(),
    device: navigator.userAgent.slice(0, 64),
    exp: Date.now() + TOKEN_TTL_MS
  };

  const payloadStr = JSON.stringify(payload);
  const signature = await signPayload(payloadStr);

  return btoa(JSON.stringify({ payload: payloadStr, signature }));
};

/**
 * Verifies token integrity and expiry. Returns boolean.
 */
export const verifySecureToken = async (token: string | null): Promise<boolean> => {
  if (!token) return false;

  try {
    const decodedPackage = JSON.parse(atob(token));
    const { payload, signature } = decodedPackage;

    const calculatedSig = await signPayload(payload);

    if (calculatedSig !== signature) return false;

    // Check expiry
    const parsedPayload = JSON.parse(payload);
    if (parsedPayload.exp && typeof parsedPayload.exp === 'number') {
      return parsedPayload.exp > Date.now();
    }

    // If no expiry provided, fail closed
    return false;
  } catch (e) {
    console.warn("Token verification failed", e);
    return false;
  }
};