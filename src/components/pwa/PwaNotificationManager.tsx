"use client";

import { useEffect, useState } from "react";
import { Bell, Download, X, User, CheckCircle2, ShieldAlert, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";

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

export function PwaNotificationManager() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission | "unsupported">("unsupported");
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manual Dialog Modal State
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

    // 2. Notification Permission Check
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    // 3. PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      const dismissed = localStorage.getItem("pwa_install_banner_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Auto-sync subscription if notification permission is already granted
  useEffect(() => {
    if (
      'Notification' in window &&
      Notification.permission === 'granted' &&
      'serviceWorker' in navigator
    ) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const applicationServerKey = urlBase64ToUint8Array(DEFAULT_VAPID_PUBLIC_KEY);

        let subscription = await registration.pushManager.getSubscription();

        // Se o aparelho já estava inscrito, mas com chave VAPID antiga/diferente, renova automaticamente
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
              console.error('Erro ao obter inscrição push automática no site:', err);
              return null;
            });
        }

        if (subscription) {
          localStorage.setItem("paroquia_site_push_vapid_key", DEFAULT_VAPID_PUBLIC_KEY);
          await sendSubscriptionToApi(subscription);
        }
      });
    }
  }, []);

  // Determine if notification banner should show (Only if install banner is NOT active)
  useEffect(() => {
    if (!showInstallBanner && "Notification" in window) {
      if (Notification.permission === "default") {
        const dismissed = localStorage.getItem("pwa_notif_banner_dismissed");
        if (!dismissed) {
          setShowNotificationBanner(true);
        }
      }
    }
  }, [showInstallBanner]);

  // Listener for custom trigger event (e.g. from footer link or menu)
  useEffect(() => {
    const handleCustomTrigger = () => {
      setModalOpen(true);
    };

    window.addEventListener("open-pwa-notification-prompt", handleCustomTrigger);
    return () => {
      window.removeEventListener(
        "open-pwa-notification-prompt",
        handleCustomTrigger
      );
    };
  }, []);

  const getDeviceInfo = () => {
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
      }
    } catch (err) {
      console.error("Erro ao abrir instalador PWA:", err);
    } finally {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      localStorage.setItem("pwa_install_banner_dismissed", "true");
    }
  };

  const sendSubscriptionToApi = async (subscription: PushSubscription) => {
    const subJson = subscription.toJSON();
    const p256dh = subJson.keys?.p256dh;
    const auth = subJson.keys?.auth;

    if (!p256dh || !auth) {
      console.error("Inscrição Push incompleta: chaves p256dh ou auth ausentes.");
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL as string;
    const nameToSave = visitorName.trim() || `Fiel (${getDeviceInfo()})`;

    try {
      const response = await fetch(`${apiBaseUrl}/push-subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: nameToSave,
          origin: "site",
          deviceInfo: getDeviceInfo(),
          endpoint: subscription.endpoint,
          keys: { p256dh, auth },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Erro ao salvar inscrição na API:", response.status, errText);
      } else {
        console.log("Inscrição salva com sucesso na API!");
      }
    } catch (err) {
      console.error("Falha ao comunicar com a API de notificações:", err);
    }
  };

  const handleRequestNotification = async () => {
    if (!("Notification" in window)) {
      toast.error("Notificações não são suportadas neste navegador.");
      return;
    }

    setIsSubmitting(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      setShowNotificationBanner(false);

      if (permission === "granted") {
        toast.success("Notificações ativadas para avisos e celebrações!");
        if ("serviceWorker" in navigator) {
          const registration = await navigator.serviceWorker.ready;

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
            subscription = await registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey,
            }).catch((err) => {
              console.error("Erro no pushManager.subscribe:", err);
              return null;
            });
          }

          if (subscription) {
            localStorage.setItem("paroquia_site_push_vapid_key", DEFAULT_VAPID_PUBLIC_KEY);
            await sendSubscriptionToApi(subscription);
          }

          registration.showNotification("Paróquia São José", {
            body: `Seja bem-vindo(a) ${visitorName ? visitorName : ""}! Você receberá nossos avisos e notícias.`,
            icon: "/icons/icon-192x192.png",
          });
        }
      } else if (permission === "denied") {
        toast.error(
          "As notificações estão bloqueadas no seu navegador. Clique no ícone de cadeado 🔒 ao lado da URL para permitir."
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão de notificação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestNotification = async () => {
    if ("serviceWorker" in navigator && Notification.permission === "granted") {
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      const applicationServerKey = urlBase64ToUint8Array(DEFAULT_VAPID_PUBLIC_KEY);

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        }).catch(() => null);
      }

      if (subscription) {
        await sendSubscriptionToApi(subscription);
      }

      registration.showNotification("Paróquia São José", {
        body: `Teste de notificação enviado para ${visitorName || "seu dispositivo"}!`,
        icon: "/icons/icon-192x192.png",
      });
      toast.success("Notificação de teste disparada e registrada na API!");
    }
  };

  const dismissInstallBanner = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa_install_banner_dismissed", "true");
  };

  const dismissNotificationBanner = () => {
    setShowNotificationBanner(false);
    localStorage.setItem("pwa_notif_banner_dismissed", "true");
  };

  return (
    <>
      {/* PWA Install Floating Banner (Priority 1) */}
      {showInstallBanner && deferredPrompt ? (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-[#d4a85c]/30 bg-[#7f1d1d] p-4 text-white shadow-xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-lg bg-white/10 p-2 shrink-0">
              <Download className="h-5 w-5 text-[#d4a85c]" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-sm font-semibold text-[#f8f0e7]">
                Instale o App da Paróquia
              </h4>
              <p className="mt-1 text-xs text-stone-200">
                Acesse horários de missas, liturgia e comunidades direto da tela
                inicial.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="rounded-lg bg-[#d4a85c] px-3 py-1.5 text-xs font-semibold text-stone-950 transition hover:bg-[#c3974b] active:scale-95 cursor-pointer"
                >
                  Instalar Agora
                </button>
                <button
                  type="button"
                  onClick={dismissInstallBanner}
                  className="rounded-lg px-2 py-1.5 text-xs text-stone-300 hover:text-white cursor-pointer"
                >
                  Depois
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissInstallBanner}
              className="text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : showNotificationBanner && notificationPermission === "default" ? (
        /* Push Notification Banner (Priority 2) */
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-[#d4a85c]/30 bg-stone-900 p-4 text-white shadow-xl transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-3">
            <div className="rounded-lg bg-[#7f1d1d] p-2 shrink-0">
              <Bell className="h-5 w-5 text-[#d4a85c]" />
            </div>
            <div className="flex-1">
              <h4 className="font-serif text-sm font-semibold text-white">
                Receba Notificações Paroquiais
              </h4>
              <p className="mt-1 text-xs text-stone-300">
                Fique por dentro dos avisos, horários de missas e celebrações.
              </p>

              <div className="mt-3 relative">
                <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full rounded-lg border border-stone-700 bg-stone-800 py-1.5 pl-8 pr-3 text-xs text-white placeholder-stone-400 focus:border-[#d4a85c] focus:outline-none"
                />
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleRequestNotification}
                  className="rounded-lg bg-[#7f1d1d] px-3 py-1.5 text-xs font-semibold text-white border border-[#d4a85c]/40 hover:bg-[#6b1818] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Ativando..." : "Ativar Notificações"}
                </button>
                <button
                  type="button"
                  onClick={dismissNotificationBanner}
                  className="rounded-lg px-2 py-1.5 text-xs text-stone-400 hover:text-white cursor-pointer"
                >
                  Agora Não
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismissNotificationBanner}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Interactive Manual Dialog Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-[#d4a85c]/40 bg-[#18351E] p-6 text-white shadow-2xl">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-[#7f1d1d] p-3 text-[#d4a85c] border border-[#d4a85c]/30">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#f8f0e7]">
                  Notificações & Aplicativo
                </h3>
                <p className="text-xs text-stone-300">
                  Paróquia São José de Caraguatatuba
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-stone-200">
              {/* Notification Status Card */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#d4a85c]">
                    Status das Notificações
                  </span>
                  {notificationPermission === "granted" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Ativadas
                    </span>
                  ) : notificationPermission === "denied" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                      <ShieldAlert className="h-3.5 w-3.5" /> Bloqueadas
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300">
                      <Sparkles className="h-3.5 w-3.5" /> Pendente
                    </span>
                  )}
                </div>

                {notificationPermission === "granted" ? (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-300">
                      As notificações estão totalmente ativas neste dispositivo!
                    </p>

                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Atualizar seu nome"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full rounded-lg border border-stone-700 bg-stone-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-stone-400 focus:border-[#d4a85c] focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleTestNotification}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#7f1d1d] py-2 text-xs font-semibold text-white border border-[#d4a85c]/40 hover:bg-[#6b1818] transition active:scale-95 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5 text-[#d4a85c]" />
                      Enviar Notificação de Teste
                    </button>
                  </div>
                ) : notificationPermission === "denied" ? (
                  <div className="space-y-2">
                    <p className="text-xs text-rose-200 leading-relaxed">
                      As notificações foram bloqueadas no seu navegador. Para
                      reativar, clique no **ícone de cadeado 🔒** ao lado da URL
                      na barra do navegador e altere "Notificações" para
                      "Permitir".
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-300">
                      Ative as notificações para receber avisos de missas, eventos
                      e comunicados paroquiais.
                    </p>

                    <div className="relative">
                      <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Seu nome (opcional)"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full rounded-lg border border-stone-700 bg-stone-900 py-1.5 pl-8 pr-3 text-xs text-white placeholder-stone-400 focus:border-[#d4a85c] focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleRequestNotification}
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#d4a85c] py-2 text-xs font-semibold text-stone-950 hover:bg-[#c3974b] transition active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Bell className="h-4 w-4" />
                      {isSubmitting ? "Ativando..." : "Ativar Notificações Agora"}
                    </button>
                  </div>
                )}
              </div>

              {/* PWA Install Card */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#d4a85c]">
                    Aplicativo Paroquial (PWA)
                  </span>
                </div>
                <p className="text-xs text-stone-300 mb-3">
                  Instale o site da Paróquia como aplicativo direto no seu celular
                  ou computador.
                </p>

                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#d4a85c]/40 bg-white/10 py-2 text-xs font-semibold text-white hover:bg-white/20 transition active:scale-95 cursor-pointer"
                >
                  <Download className="h-4 w-4 text-[#d4a85c]" />
                  Instalar Aplicativo
                </button>
              </div>
            </div>

            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg px-4 py-1.5 text-xs text-stone-300 hover:text-white border border-white/10 cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
