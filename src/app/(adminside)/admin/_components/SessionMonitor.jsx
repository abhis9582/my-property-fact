"use client";
import { useEffect } from "react";

export default function SessionMonitor() {
  useEffect(() => {
    let timeout;

    const scheduleCheck = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}auth/session`,
          { credentials: "include" },
        );

        if (!res.ok) return;

        const data = await res.json();
        const expiresAt = new Date(data.expiresAt);
        const now = new Date();

        const msUntil5MinBeforeExpiry =
          expiresAt.getTime() - now.getTime() - 5 * 60 * 1000;

        if (msUntil5MinBeforeExpiry <= 0) {
          checkExpiry(expiresAt);
        } else {
          timeout = setTimeout(
            () => checkExpiry(expiresAt),
            msUntil5MinBeforeExpiry,
          );
        }
      } catch (err) {
        console.error("Session scheduling error:", err);
      }
    };

    const checkExpiry = async (expiresAt) => {
      const now = new Date();
      const minutesLeft = (expiresAt - now) / (1000 * 60);

      if (minutesLeft <= 5 && minutesLeft > 0) {
        const continueSession = window.confirm(
          "Your session is about to expire. Continue?",
        );

        if (continueSession) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/refresh-token`, {
            method: "POST",
            credentials: "include",
          });

          // after refresh → reschedule again
          scheduleCheck();
        }
      }
    };

    scheduleCheck();

    return () => clearTimeout(timeout);
  }, []);

  return null;
}