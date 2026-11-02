import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(1000).startsWith("https://"),
  keys: z.object({
    p256dh: z.string().min(10).max(200),
    auth: z.string().min(4).max(100),
  }),
  ward: z.string().max(40).optional(),
});

export const savePushSubscription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => subscriptionSchema.parse(input))
  .handler(async ({ data }) => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
      {
        endpoint: data.endpoint,
        p256dh: data.keys.p256dh,
        auth: data.keys.auth,
        ward: data.ward ?? null,
        user_agent: (getRequestHeader("user-agent") ?? "").slice(0, 300),
      },
      { onConflict: "endpoint" },
    );
    if (error) {
      console.error("save subscription failed", error);
      return { ok: false as const };
    }
    return { ok: true as const };
  });

const sendSchema = z.object({
  password: z.string().min(1).max(200),
  title: z.string().trim().min(1).max(80),
  body: z.string().trim().min(1).max(240),
  url: z.string().trim().max(300).optional(),
});

async function passwordMatches(input: string, expected: string) {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(input)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  const x = new Uint8Array(a);
  const y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const sendPushNotification = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => sendSchema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env["SEND_PASSWORD"];
    const privateJWK = process.env["VAPID_PRIVATE_JWK"];
    if (!expected || !privateJWK) return { ok: false as const, error: "Sending is not set up yet." };
    if (!(await passwordMatches(data.password, expected))) {
      return { ok: false as const, error: "Wrong password." };
    }

    const { buildPushHTTPRequest } = await import("@pushforge/builder");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: subs, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("id, endpoint, p256dh, auth")
      .limit(5000);
    if (error) {
      console.error("load subscriptions failed", error);
      return { ok: false as const, error: "Could not load supporters." };
    }

    const url = data.url && data.url.startsWith("/") ? data.url : "/";
    const payload = { title: data.title, body: data.body, url };
    let sent = 0;
    const expired: string[] = [];

    const results = await Promise.allSettled(
      (subs ?? []).map(async (s) => {
        const req = await buildPushHTTPRequest({
          privateJWK,
          subscription: { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          message: {
            payload,
            adminContact: "mailto:campaign@loyatum2027.ke",
            options: { ttl: 86400, urgency: "high" },
          },
        });
        const res = await fetch(req.endpoint, { method: "POST", headers: req.headers, body: req.body });
        if (res.status === 404 || res.status === 410) expired.push(s.id);
        else if (res.ok) sent++;
        else console.error("push failed", res.status, await res.text().catch(() => ""));
      }),
    );
    results.forEach((r) => r.status === "rejected" && console.error("push error", r.reason));

    if (expired.length) await supabaseAdmin.from("push_subscriptions").delete().in("id", expired);

    return { ok: true as const, sent, total: subs?.length ?? 0, removed: expired.length };
  });
