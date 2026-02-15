import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC_KEY = "BNSX7e93CkIpIXw74u75LEbasJjhRVx7wgXrUhnerBI-6BqDEVxKzibEn8BNyaFqjyObeyo1BMtLkeFLziU7mo4";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window;
    setIsSupported(supported);

    if (supported) {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await (reg as any).pushManager.getSubscription();
        setIsSubscribed(!!sub);
      });

      // Register service worker
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) return;
    setIsLoading(true);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setIsLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const sub = await (reg as any).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const { error } = await supabase.functions.invoke("subscribe-push", {
        body: { action: "subscribe", subscription: sub.toJSON() },
      });
      if (error) throw error;

      setIsSubscribed(true);
    } catch (err) {
      console.error("Push subscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await (reg as any).pushManager.getSubscription();
      if (sub) {
        await supabase.functions.invoke("subscribe-push", {
          body: { action: "unsubscribe", subscription: sub.toJSON() },
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error("Push unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggle = useCallback(() => {
    return isSubscribed ? unsubscribe() : subscribe();
  }, [isSubscribed, subscribe, unsubscribe]);

  return { isSupported, isSubscribed, isLoading, toggle };
}
