import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Send } from "lucide-react";
import { sendPushNotification } from "@/lib/push.functions";

export const Route = createFileRoute("/send")({
  head: () => ({
    meta: [
      { title: "Send Alert — Loyatum 2027 Team" },
      { name: "description", content: "Campaign team page for sending supporter alerts." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Send Alert — Loyatum 2027 Team" },
      { property: "og:description", content: "Campaign team page for sending supporter alerts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SendPage,
});

const field =
  "w-full rounded-sm border-2 border-ink-foreground/30 bg-ink px-4 py-3 text-lg text-ink-foreground placeholder:text-ink-foreground/40 focus:border-sun focus:outline-none";

function SendPage() {
  const send = useServerFn(sendPushNotification);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    setResult(null);
    try {
      const res = await send({
        data: {
          password: String(fd.get("password") ?? ""),
          title: String(fd.get("title") ?? ""),
          body: String(fd.get("body") ?? ""),
          url: String(fd.get("url") ?? "") || undefined,
        },
      });
      if (res.ok) {
        setResult({ ok: true, text: `Imetumwa kwa ${res.sent} kati ya ${res.total} supporters.` });
        (form.elements.namedItem("title") as HTMLInputElement).value = "";
        (form.elements.namedItem("body") as HTMLTextAreaElement).value = "";
      } else {
        setResult({ ok: false, text: res.error });
      }
    } catch {
      setResult({ ok: false, text: "Please fill in every field (title up to 80, message up to 240 characters)." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink px-5 py-12 text-ink-foreground">
      <div className="mx-auto max-w-lg">
        <p className="font-display text-2xl text-sun">Loyatum 2027</p>
        <h1 className="mt-4 font-display text-5xl md:text-6xl">Tuma Alert</h1>
        <p className="mt-3 text-lg text-ink-foreground/70">
          Sends a phone notification to every supporter who tapped “Pata Updates”.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-sun">Team password</span>
            <input name="password" type="password" required autoComplete="current-password" className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-sun">Title</span>
            <input name="title" required maxLength={80} placeholder="Rally Chepareria Leo! 🔥" className={field} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-sun">Message</span>
            <textarea
              name="body"
              required
              maxLength={240}
              rows={4}
              placeholder="Tukutane Chepareria grounds saa nane. Vijana wote mfike!"
              className={field}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-sun">
              Open page (optional)
            </span>
            <input name="url" placeholder="/#vijana" className={field} />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-bead px-8 py-4 text-lg font-bold uppercase tracking-wide text-primary-foreground disabled:opacity-70"
          >
            <Send className="h-5 w-5" /> {busy ? "Inatuma..." : "Tuma Sasa"}
          </button>
          {result && (
            <p className={`text-lg font-semibold ${result.ok ? "text-sun" : "text-destructive"}`}>{result.text}</p>
          )}
        </form>
      </div>
    </main>
  );
}
