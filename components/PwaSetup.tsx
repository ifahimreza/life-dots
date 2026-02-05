"use client";

import {useEffect} from "react";

export default function PwaSetup() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent fail to avoid breaking the app in dev.
    });
  }, []);

  return null;
}
