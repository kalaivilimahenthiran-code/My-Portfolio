"use client";

import { useState, useEffect } from "react";

export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [uploadQueue, setUploadQueue] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOnline, uploadQueue };
}
