import { createClient } from "@supabase/supabase-js";
import { createServerFn } from "@tanstack/react-start";
import type { Database } from "@/integrations/supabase/types";

type ActivityRow = Database["public"]["Tables"]["activities"]["Row"];
type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type MediaRow = Database["public"]["Tables"]["media"]["Row"];

export type PublicMedia = Pick<MediaRow, "id" | "public_url" | "alt_text" | "caption">;
export type PublicActivity = Pick<
  ActivityRow,
  | "id"
  | "title"
  | "description"
  | "event_at"
  | "location"
  | "category"
  | "status"
  | "media_ids"
  | "published_at"
> & { media: PublicMedia[] };
export type PublicArticle = Pick<
  ArticleRow,
  | "id"
  | "slug"
  | "title"
  | "summary"
  | "body"
  | "category"
  | "author_name"
  | "cover_media_id"
  | "published_at"
  | "seo_title"
  | "seo_description"
> & { cover: PublicMedia | null };

function createPublicClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(
          typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
        );
        if (init?.headers) new Headers(init.headers).forEach((value, name) => headers.set(name, value));
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function getPublicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Public campaign content is temporarily unavailable.");
  return createPublicClient(url, key);
}

async function getPublishedMedia(client: ReturnType<typeof getPublicClient>, ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length === 0) return new Map<string, PublicMedia>();

  const { data, error } = await client
    .from("media")
    .select("id, public_url, alt_text, caption")
    .in("id", uniqueIds)
    .eq("is_published", true);
  if (error) throw new Error("Public campaign media is temporarily unavailable.");
  return new Map((data ?? []).map((media) => [media.id, media]));
}

export const listPublicActivities = createServerFn({ method: "GET" }).handler(async () => {
  const client = getPublicClient();
  const { data, error } = await client
    .from("activities")
    .select("id, title, description, event_at, location, category, status, media_ids, published_at")
    .eq("publication_status", "published")
    .eq("verification_status", "verified")
    .order("event_at", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false });
  if (error) throw new Error("Campaign activities are temporarily unavailable.");

  const rows = data ?? [];
  const media = await getPublishedMedia(client, rows.flatMap((activity) => activity.media_ids));
  return rows.map((activity) => ({
    ...activity,
    media: activity.media_ids.flatMap((id) => {
      const item = media.get(id);
      return item ? [item] : [];
    }),
  }));
});

export const listPublicArticles = createServerFn({ method: "GET" }).handler(async () => {
  const client = getPublicClient();
  const { data, error } = await client
    .from("articles")
    .select("id, slug, title, summary, body, category, author_name, cover_media_id, published_at, seo_title, seo_description")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) throw new Error("Campaign updates are temporarily unavailable.");

  const rows = data ?? [];
  const media = await getPublishedMedia(
    client,
    rows.flatMap((article) => (article.cover_media_id ? [article.cover_media_id] : [])),
  );
  return rows.map((article) => ({
    ...article,
    cover: article.cover_media_id ? (media.get(article.cover_media_id) ?? null) : null,
  }));
});

export const getPublicArticle = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const client = getPublicClient();
    const { data, error } = await client
      .from("articles")
      .select("id, slug, title, summary, body, category, author_name, cover_media_id, published_at, seo_title, seo_description")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error("This campaign update is temporarily unavailable.");
    if (!data) return null;

    const media = data.cover_media_id
      ? await getPublishedMedia(client, [data.cover_media_id])
      : new Map<string, PublicMedia>();
    return {
      ...data,
      cover: data.cover_media_id ? (media.get(data.cover_media_id) ?? null) : null,
    };
  });