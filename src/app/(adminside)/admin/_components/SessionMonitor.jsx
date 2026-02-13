"use client";
import { useEffect } from "react";
export default function SessionMonitor() {
  useEffect(() => {
    const checkExpiry = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/session`,
          { credentials: "include" },
        );
        if (!res.ok) return;
        const data = await res.json();
        const expiresAt = new Date(data.expiresAt);

        const now = new Date();
        const minutesLeft = (expiresAt - now) / (1000 * 60);
        if (minutesLeft <= 2) {
          const continueSession = window.confirm(
            "Your session is about to expire. Continue?",
          );

          if (continueSession) {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
              method: "POST",
              credentials: "include",
            });
          }
        }
      } catch (error) {
        console.error("Error checking session expiry:", error);
      }
    };
    const interval = setInterval(checkExpiry, 20 * 1000);
    return () => clearInterval(interval);
  }, []);
}
