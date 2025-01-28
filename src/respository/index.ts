// lib/useLineLogin.ts
import { useState, useEffect } from 'react';
import liff from '@line/liff';

const useLineLogin = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeLiff = async () => {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
        if (!liffId) {
          throw new Error("LIFF ID is not defined in environment variables.");
        }

        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login(); // Prompt user to log in if not already logged in
        } else {
          const profile = await liff.getProfile();
          setUserId(profile.userId); // Save the userId after login
        }
      } catch (error) {
        console.error("LIFF initialization failed:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeLiff();
  }, []);

  return { userId, loading };
};

export default useLineLogin;
