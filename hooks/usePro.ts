import { useState, useEffect } from 'react';
import { STORAGE_KEY_PRO } from '../constants';
import { hashString, generateSecureToken, verifySecureToken } from '../utils/security';

export const usePro = () => {
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const token = localStorage.getItem(STORAGE_KEY_PRO);
        const isValid = await verifySecureToken(token);
        if (!mounted) return;
        if (isValid) {
          setIsPro(true);
        } else {
          if (token) localStorage.removeItem(STORAGE_KEY_PRO);
          setIsPro(false);
        }
      } catch (e) {
        console.error("Pro verify error", e);
        setIsPro(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const activatePro = async (code: string): Promise<boolean> => {
    try {
      const inputHash = hashString(code);
      // PRO_ACTIVATION_HASHES comparison is synchronous (legacy hashes stored in constants)
      // If match, generate signed token and store
      // Note: Even if user obtains token, token has expiry and is signed.
      // This reduces trivial tampering.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { PRO_ACTIVATION_HASHES } = require('../constants');
      if (PRO_ACTIVATION_HASHES.includes(inputHash)) {
        const secureToken = await generateSecureToken();
        localStorage.setItem(STORAGE_KEY_PRO, secureToken);
        setIsPro(true);
        return true;
      }
      return false;
    } catch (e) {
      console.error("activatePro error", e);
      return false;
    }
  };

  return { isPro, loading, activatePro };
};