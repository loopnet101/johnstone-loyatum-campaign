import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, FileText, Images, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Team Preview — Johnstone Loyatum Campaign" },
      { name: "description", content: "Sample campaign posts, event planning, and media links for the Johnstone Loyatum team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Team Preview — Johnstone Loyatum Campaign" },
      { property: "og:description", content: "A sample workspace for campaign posts, events, and media." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TeamPreviewPage,
});

type AdminTab = "posts" | "events" | "media";

const posts = [
  { title: "Jacaranda meet-up — mnauliza, tunasikiliza.", kind: "Meetup", status: "Sample · details unconfirmed", anchor: "jacaranda-meetup" },
  { title: "Next stop: listening session with the community.", kind: "Upcoming", status: "Sample · date unconfirmed", anchor: "community-listening" },
  { title: "How it went down: listening first, then the next step.", kind: "Recap", status: "Sample recap format", anchor: "meetup-recap" },
  { title: "Mguu kwa mguu: ward tour planning thread.", kind: "Tour", status: "Sample · route unconfirmed", anchor: "ward-tour" },
];

const events = [
  { title: "Jacaranda community meet-up", detail: "Sample campaign gathering · date and venue to be confirmed", icon: CalendarDays },
  { title: "Community listening session", detail: "Sample event · ward and schedule to be confirmed", icon: MapPin },
  { title: "Pokot South ward tour", detail: "Sample route: Chepareria, Batei, Lelan and Tapach · itinerary unconfirmed", icon: Clock3 },
];

const demoImages = [
  { label: "Community meetup", id: "samples/people/jazz" },
  { label: "Landscape", id: "samples/landscapes/landscape-panorama" },
  { label: "Meetup recap", id: "samples/people/bicycle" },
];

const demoCloud = "https://res.cloudinary.com/demo/image/upload";
const tabs: { id: AdminTab; label: string; icon: typeof FileText }[] = [
  { id: "posts", label: "Posts", icon: FileText },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "media", label: "Media", icon: Images },
];

function TeamPreviewPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("posts");

  return (
    <main className="min-h-screen bg-background px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] text-foreground md:px-8 md:pb-10">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-border py-7 md:py-10">
          <p className="text-sm font-extrabold uppercase text-bead">Johnstone Loyatum · Team desk</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-display text-5xl sm:text-6xl">Campaign workspace</h1>
            <span className="bg-sun px-3 py-1 text-xs font-extrabold uppercase text-ink">Preview only</span>
          </div>
          <p className="mt-4 max-w-2xl text-base font-semibold leading-relaxed text-muted-foreground">
            Sample content and Cloudinary demo links. This page is not private; nothing here publishes or saves changes.
          </p>
          <div className="mt-6 grid grid-cols-3 divide-x divide-border border-y border-border py-4">
            <div className="px-3 first:pl-0">
              <p className="font-display text-3xl">{posts.length}</p>
              <p className="text-xs font-bold text-muted-foreground">Sample posts</p>
            </div>
            <div className="px-3">
              <p className="font-display text-3xl">{events.length}</p>
              <p className="text-xs font-bold text-muted-foreground">Sample events</p>
            </div>
            <div className="px-3">
              <p className="font-display text-3xl">{demoImages.length}</p>
              <p className="text-xs font-bold text-muted-foreground">Demo images</p>
            </div>
          </div>
        </header>

        <section className="py-6" aria-live="polite">
          {activeTab === "posts" ? <PostsPanel /> : null}
          {activeTab === "events" ? <EventsPanel /> : null}
          {activeTab === "media" ? <MediaPanel /> : null}
        </section>
      </div>

      <nav aria-label="Team navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:mx-auto md:mt-3 md:max-w-4xl md:border-t-0 md:pb-0">
        <div className="mx-auto flex h-16 max-w-lg items-stretch px-2 md:max-w-none md:justify-end md:gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              type="button"
              variant="ghost"
              aria-pressed={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`h-full min-w-0 flex-1 flex-col gap-1 rounded-none text-xs font-bold md:h-11 md:flex-none md:flex-row md:px-5 ${activeTab === id ? "text-bead" : "text-muted-foreground"}`}
            >
              <Icon aria-hidden="true" className="size-5" />
              {label}
            </Button>
          ))}
        </div>
      </nav>
    </main>
  );
}

function PanelHeading({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="font-display text-3xl">{title}</h2>
      <span className="text-sm font-bold text-muted-foreground">{count} samples</span>
    </div>
  );
}

function PostsPanel() {
  return (
    <div>
      <PanelHeading title="Post queue" count={posts.length} />
      <div className="divide-y divide-border border-y border-border">
        {posts.map((post) => (
          <article key={post.anchor} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold uppercase">
                <span className="text-bead">{post.kind}</span>
                <span className="text-muted-foreground">{post.status}</span>
              </div>
              <h3 className="mt-1 text-lg font-extrabold leading-snug">{post.title}</h3>
            </div>
            <Button asChild variant="outline" className="shrink-0 self-start sm:self-auto">
              <Link to="/track" hash={post.anchor}>Preview thread <ArrowUpRight aria-hidden="true" /></Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}

function EventsPanel() {
  return (
    <div>
      <PanelHeading title="Events & meetups" count={events.length} />
      <div className="divide-y divide-border border-y border-border">
        {events.map(({ title, detail, icon: Icon }) => (
          <article key={title} className="flex gap-3 py-5">
            <Icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-bead" />
            <div>
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-sm font-semibold text-muted-foreground">Event announcements, dates, venues and recaps must be confirmed by the campaign team before publishing.</p>
    </div>
  );
}

function MediaPanel() {
  return (
    <div>
      <PanelHeading title="Media library" count={demoImages.length} />
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Cloudinary demo images only · replace with approved campaign media.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoImages.map(({ label, id }) => {
          const imageUrl = `${demoCloud}/c_fill,w_900,h_560,q_auto,f_auto/${id}.jpg`;
          return (
            <article key={id} className="overflow-hidden border border-border bg-card">
              <img src={imageUrl} alt={`Cloudinary demo image: ${label}`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-extrabold">{label}</h3>
                  <p className="text-xs font-semibold text-muted-foreground">Demo asset</p>
                </div>
                <Button asChild variant="ghost" size="icon" aria-label={`Open Cloudinary demo image: ${label}`}>
                  <a href={imageUrl} target="_blank" rel="noreferrer"><ArrowUpRight aria-hidden="true" /></a>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}