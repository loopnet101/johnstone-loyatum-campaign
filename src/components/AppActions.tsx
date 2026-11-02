import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { BellRing, Check, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { savePushSubscription } from "@/lib/push.functions";
import { isSubscribed, pushSupported, subscribeToPush } from "@/lib/push-client";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function AppActions() {
  const save = useServerFn(savePushSubscription);
  const [installEvt, setInstallEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setInstalled(window.matchMedia("(display-mode: standalone)").matches);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));
    isSubscribed().then(setSubscribed).catch(() => {});
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (installEvt) {
      await installEvt.prompt();
      setInstallEvt(null);
    } else if (isIos) {
      toast("Kwa iPhone: gusa Share ⬆️ kisha 'Add to Home Screen'.");
    } else {
      toast("Fungua menu ya browser (⋮) kisha 'Add to Home screen' / 'Install app'.");
    }
  };

  const handleNotify = async () => {
    if (!pushSupported()) {
      toast(
        isIos
          ? "Kwa iPhone: kwanza weka app kwa Home Screen, kisha ufungue kutoka hapo."
          : "Browser hii haikubali notifications.",
      );
      return;
    }
    setBusy(true);
    try {
      const sub = await subscribeToPush();
      const res = await save({ data: sub });
      if (!res.ok) throw new Error("save");
      setSubscribed(true);
      toast.success("Uko ndani! Utapata updates za kampeni moja kwa moja. 🔥");
    } catch (e) {
      toast.error(
        e instanceof Error && e.message === "denied"
          ? "Umezuia notifications. Ruhusu kwenye settings za browser."
          : "Imeshindikana. Jaribu tena.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button
        onClick={handleNotify}
        disabled={busy || subscribed}
        className="inline-flex items-center gap-2 rounded-sm bg-ink px-8 py-4 text-lg font-bold uppercase tracking-wide text-ink-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-80 disabled:hover:translate-y-0"
      >
        {subscribed ? <Check className="h-5 w-5" /> : <BellRing className="h-5 w-5" />}
        {subscribed ? "Uko Ndani!" : busy ? "Subiri..." : "Pata Updates"}
      </button>
      {!installed && (
        <button
          onClick={handleInstall}
          className="inline-flex items-center gap-2 rounded-sm border-2 border-primary-foreground px-8 py-4 text-lg font-bold uppercase tracking-wide transition-colors hover:bg-primary-foreground hover:text-primary"
        >
          <Smartphone className="h-5 w-5" /> Weka kwa Simu
        </button>
      )}
    </div>
  );
}
