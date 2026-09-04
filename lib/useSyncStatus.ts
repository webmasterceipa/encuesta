"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { contarEncuestas } from "./db";
import { sincronizarPendientes, type SyncResult } from "./sync";

const INTERVAL_MS = 30_000;

export function useSyncStatus() {
  const [online, setOnline] = useState(true);
  const [total, setTotal] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const syncingRef = useRef(false);

  const refreshCounts = useCallback(async () => {
    try {
      const counts = await contarEncuestas();
      setTotal(counts.total);
      setPendientes(counts.pendientes);
    } catch {
      // IndexedDB aún no disponible (SSR / primer paint)
    }
  }, []);

  const syncNow = useCallback(async (): Promise<SyncResult | null> => {
    if (syncingRef.current) return null;
    syncingRef.current = true;
    setSyncing(true);
    try {
      const result = await sincronizarPendientes();
      setLastMessage(result.message);
      await refreshCounts();
      return result;
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [refreshCounts]);

  useEffect(() => {
    setOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    void refreshCounts();

    const onOnline = () => {
      setOnline(true);
      void syncNow();
    };
    const onOffline = () => setOnline(false);

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    const interval = window.setInterval(() => {
      if (navigator.onLine) {
        void (async () => {
          const counts = await contarEncuestas();
          if (counts.pendientes > 0) {
            await syncNow();
          } else {
            await refreshCounts();
          }
        })();
      }
    }, INTERVAL_MS);

    if (navigator.onLine) {
      void syncNow();
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      window.clearInterval(interval);
    };
  }, [refreshCounts, syncNow]);

  return {
    online,
    total,
    pendientes,
    syncing,
    lastMessage,
    setLastMessage,
    syncNow,
    refreshCounts,
  };
}
