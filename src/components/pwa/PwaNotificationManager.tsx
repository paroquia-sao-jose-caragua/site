"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import { apiBaseUrl } from "@/lib/api/utils/api";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DEFAULT_VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function areKeysEqual(
  buf1: ArrayBuffer | null | undefined,
  buf2: Uint8Array
): boolean {
  if (!buf1) return false;
  const a = new Uint8Array(buf1);
  if (a.length !== buf2.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== buf2[i]) return false;
  }
  return true;
}

function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "";
  const STORAGE_KEY = "paroquia_push_device_id";
  let deviceId = localStorage.getItem(STORAGE_KEY);
  if (!deviceId) {
    deviceId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, deviceId);
  }
  return deviceId;
}

export function PwaNotificationManager() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registrado com sucesso:", reg.scope);
        })
        .catch((err) => {
          console.error("Falha ao registrar Service Worker:", err);
        });
    }

    // 2. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Auto-sync subscription if notification permission is already granted
  useEffect(() => {
    if (
      "Notification" in window &&
      Notification.permission === "granted" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const applicationServerKey = urlBase64ToUint8Array(DEFAULT_VAPID_PUBLIC_KEY);

        let subscription = await registration.pushManager.getSubscription();

        if (subscription) {
          const currentKey = subscription.options?.applicationServerKey;
          const hasKeyMismatch =
            currentKey && !areKeysEqual(currentKey, applicationServerKey);
          const storedKey = localStorage.getItem("paroquia_site_push_vapid_key");
          const needsRenewal =
            hasKeyMismatch || (storedKey && storedKey !== DEFAULT_VAPID_PUBLIC_KEY);

          if (needsRenewal) {
            try {
              await subscription.unsubscribe();
              subscription = null;
            } catch (err) {
              console.error("Erro ao cancelar inscrição push antiga no site:", err);
            }
          }
        }

        if (!subscription) {
          subscription = await registration.pushManager
            .subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            })
            .catch((err) => {
              console.error("Erro ao obter inscrição push automática no site:", err);
              return null;
            });
        }

        if (subscription && apiBaseUrl) {
          const subJson = subscription.toJSON();
          const deviceId = getOrCreateDeviceId();

          await fetch(`${apiBaseUrl}/push-subscriptions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              endpoint: subJson.endpoint,
              keys: subJson.keys,
              deviceId,
              deviceInfo: `${getBrowserInfo()} (Site)`,
              origin: "site",
            }),
          })
            .then((res) => {
              if (res.ok) {
                localStorage.setItem(
                  "paroquia_site_push_vapid_key",
                  DEFAULT_VAPID_PUBLIC_KEY
                );
              }
            })
            .catch(() => {});
        }
      });
    }
  }, []);

  // Listen for custom open trigger from SiteHeader or SiteFooter
  useEffect(() => {
    const handleOpen = () => {
      setModalOpen(true);
    };
    window.addEventListener("open-pwa-notification-prompt", handleOpen);
    return () => {
      window.removeEventListener("open-pwa-notification-prompt", handleOpen);
    };
  }, []);

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = "Navegador";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";

    let os = "Web";
    if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
    else if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";

    return `${browser} no ${os}`;
  };

  const isStandaloneMode = () => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    );
  };

  const handleInstallClick = async () => {
    if (isStandaloneMode()) {
      toast.success("Você já está usando o aplicativo no modo instalado!");
      setModalOpen(false);
      return;
    }

    if (!deferredPrompt) {
      const ua = navigator.userAgent;
      if (ua.includes("iPhone") || ua.includes("iPad")) {
        toast.info(
          "Para instalar no iOS: toque no botão de Compartilhar ⎋ no Safari e selecione 'Adicionar à Tela de Início' ➕.",
          { duration: 7000 }
        );
      } else if (ua.includes("Mac") && ua.includes("Safari") && !ua.includes("Chrome")) {
        toast.info(
          "Para instalar no Safari do Mac: no menu superior, clique em Arquivo > Adicionar ao Dock.",
          { duration: 7000 }
        );
      } else {
        toast.info(
          "Para instalar: clique no ícone ⊕ na barra de endereço (canto superior direito) ou no menu do navegador (⋮) > Instalar Aplicativo.",
          { duration: 7000 }
        );
      }
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success("Aplicativo instalado com sucesso!");
        setModalOpen(false);
      }
    } catch (err) {
      console.error("Erro ao abrir instalador PWA:", err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => setModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-install-modal-title"
    >
      <div
        className="relative w-full max-w-sm rounded-3xl bg-[#FBF8F3] border border-[#D6A64A]/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-2 bg-[#B8872E] w-full" />

        <button
          type="button"
          onClick={() => setModalOpen(false)}
          aria-label="Fechar modal"
          className="absolute top-5 right-5 text-[#5A463B] hover:text-[#18351E] transition-colors cursor-pointer"
        >
          <X size={22} />
        </button>

        <div className="px-6 pt-7 pb-7 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EFE8DC] flex items-center justify-center mx-auto mb-4">
            <Download size={24} className="text-[#B8872E]" />
          </div>

          <h3
            id="pwa-install-modal-title"
            className="font-serif text-2xl font-bold text-[#18351E]"
          >
            Instalar Aplicativo
          </h3>

          <p className="mt-2.5 text-sm text-[#5A463B] leading-relaxed">
            Tenha acesso rápido aos horários de missa, liturgia diária,
            agendamentos e avisos da paróquia direto na sua tela inicial.
          </p>

          <button
            type="button"
            onClick={handleInstallClick}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#18351E] hover:bg-[#27442A] text-[#eeca94] text-sm font-semibold py-3 px-6 transition-colors cursor-pointer shadow-sm"
          >
            <Download size={16} />
            Baixar Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
}
