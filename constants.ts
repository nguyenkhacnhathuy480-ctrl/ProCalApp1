// SECURITY UPDATE: Codes are hashed for comparison in client.
// For a production-ready flow, perform activation/receipt verification server-side.

export const PRO_ACTIVATION_HASHES = [
  "NDIwMk9SUF9QUk9GSVRfU0VDVVJFXzIwMjQ=", // PRO2024
  "ODg4UElWX1BST0ZJVF9TRUNVUkVfMjAyNA==", // VIP888
  "TklNREFfUFJPRklUX1NFQ1VSRV8yMDI0",     // ADMIN
  "MDVFTBFTX1BST0ZJVF9TRUNVUkVfMjAyNA==", // SALE50
  "UFVUUkFUU19QUk9GSVRfU0VDVVJFXzIwMjQ=", // STARTUP
  "WEFNVElGT1JQX1BST0ZJVF9TRUNVUkVfMjAyNA==" // PROFITMAX
];

export const STORAGE_KEY_PRO = "profitcalc_secure_token_v1";
export const STORAGE_KEY_HISTORY = "profitcalc_history";

export const INITIAL_INPUTS = {
  purchasePrice: '' as const,
  sellingPrice: '' as const,
  platformFeePercent: '' as const,
  shippingFee: '' as const,
  adCost: '' as const,
};

export const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days (client-side token expiry)