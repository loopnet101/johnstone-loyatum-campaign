import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Heart,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Radio,
  Share2,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track — Johnstone Loyatum, Pokot South" },
      { name: "description", content: "Campaign meetups, public events and community updates from Pokot South." },
      { property: "og:title", content: "Track — Johnstone Loyatum" },
      { property: "og:description", content: "Follow campaign meetups, upcoming events and public updates for Pokot South." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

type Post = {
  id: string;
  kind: "Meetup" | "Upcoming" | "Recap" | "Tour";
  time: string;
  title: string;
  body: string;
  location: string;
  date?: string;
  cloudinaryPublicId?: string;
  likes: number;
  comments: number;
  replies: string[];
};

const DEMO_CLOUD = "https://res.cloudinary.com/demo/image/upload";

const initialPosts: Post[] = [
  {
    id: "jacaranda-meetup",
    kind: "Meetup",
    time: "Today · 42 min ago",
    title: "Jacaranda meet-up — mnauliza, tunasikiliza.",
    body: "A community check-in for the young people, hustlers and neighbours shaping Pokot South. Bring your questions and ideas; this is a sample event post awaiting confirmed details.",
    location: "Jacaranda Gardens · Sample location",
    date: "Date to be confirmed",
    cloudinaryPublicId: "samples/people/jazz",
    likes: 128,
    comments: 18,
    replies: ["Venue iko wapi?", "Full details to be confirmed by the campaign team."],
  },
  {
    id: "community-listening",
    kind: "Upcoming",
    time: "Yesterday · 6:10 PM",
    title: "Next stop: listening session with the community.",
    body: "Bring what matters to your ward: water, schools, roads, livelihoods or peace. Sample programme only — date, venue and attendance details need confirmation.",
    location: "Chepareria · Sample stop",
    date: "Date to be confirmed",
    cloudinaryPublicId: "samples/landscapes/landscape-panorama",
    likes: 86,
    comments: 11,
    replies: ["Tapach pia tupatane!", "Ward schedule will be shared once confirmed."],
  },
  {
    id: "meetup-recap",
    kind: "Recap",
    time: "Mon · 8:25 PM",
    title: "How it went down: listening first, then the next step.",
    body: "Sample recap format for a completed community meetup. Add verified photos, attendee feedback and agreed follow-ups before publishing this as a real event report.",
    location: "Community meetup · Sample recap",
    cloudinaryPublicId: "samples/people/bicycle",
    likes: 204,
    comments: 27,
    replies: ["Tuko pamoja!", "We’ll share confirmed follow-ups after the real meetup."],
  },
  {
    id: "ward-tour",
    kind: "Tour",
    time: "Sun · 3:45 PM",
    title: "Mguu kwa mguu: ward tour planning thread.",
    body: "Chepareria, Batei, Lelan and Tapach deserve time and attention. This sample tour notice has no confirmed dates or itinerary yet.",
    location: "Pokot South · Route to be confirmed",
    likes: 153,
    comments: 22,
    replies: ["Lelan iko ready!", "Tour stops and timings need confirmation."],
  },
];

const kindStyle: Record<Post["kind"], string> = {
  Meetup: "bg-bead text-primary-foreground",
  Upcoming: "bg-sun text-ink",
  Recap: "bg-highland text-accent-foreground",
  Tour: "bg-ink text-ink-foreground",
};

function TrackPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const toggleLike = (postId: string) => {
    const wasLiked = likedPosts.includes(postId);
    setLikedPosts((current) =>
      wasLiked ? current.filter((id) => id !== postId) : [...current, postId],
    );
    setPosts((current) =>
      current.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + (wasLiked ? -1 : 1) } : post,
      ),
    );
  };

  const sharePost = async (post: Post) => {
    const url = `${window.location.origin}/track#${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.body, url });
        return;
      } catch {
        // The share sheet may be dismissed; keep a copy-link fallback available.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid max-w-6xl md:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-label="Campaign thread feed" className="min-w-0 border-x border-border">
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-bead">Pokot South · Public campaign log</p>
                <h1 className="mt-1 font-display text-4xl">Track the work.</h1>
              </div>
              <span className="grid size-11 shrink-0 place-items-center bg-ink text-sun" aria-label="Campaign updates">
                <Radio aria-hidden="true" className="size-5" />
              </span>
            </div>
            <nav aria-label="Feed sections" className="mt-4 flex gap-5 overflow-x-auto text-sm font-bold">
              <a href="#latest" className="whitespace-nowrap border-b-2 border-bead pb-1 text-foreground">For you</a>
              <a href="#upcoming" className="whitespace-nowrap pb-1 text-muted-foreground">Upcoming</a>
              <a href="#recaps" className="whitespace-nowrap pb-1 text-muted-foreground">Meetups & recaps</a>
            </nav>
          </header>

          <div className="border-b border-border bg-muted px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-sun">
                <Sparkles aria-hidden="true" className="size-5" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                Sample feed · Events, locations, photos and reactions below are illustrative, not confirmed campaign activity.
              </p>
            </div>
          </div>

          <div id="latest">
            {posts.map((post) => {
              const hasLiked = likedPosts.includes(post.id);
              const commentsOpen = expandedPost === post.id;

              return (
                <article
                  id={post.id}
                  key={post.id}
                  className="border-b border-border px-5 py-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bead font-display text-lg text-primary-foreground">
                      JL
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
                        <span className="font-extrabold">Johnstone Loyatum</span>
                        <BadgeCheck aria-label="Campaign account" className="size-4 fill-highland text-background" />
                        <span className="text-muted-foreground">@Loyatum2027 · {post.time}</span>
                        <Button variant="ghost" size="icon" className="ml-auto size-8 text-muted-foreground" aria-label={`More options for ${post.title}`}>
                          <MoreHorizontal aria-hidden="true" className="size-5" />
                        </Button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-extrabold uppercase ${kindStyle[post.kind]}`}>
                          {post.kind === "Meetup" ? <UsersRound aria-hidden="true" className="size-3.5" /> : null}
                          {post.kind === "Upcoming" ? <CalendarDays aria-hidden="true" className="size-3.5" /> : null}
                          {post.kind === "Recap" ? <BadgeCheck aria-hidden="true" className="size-3.5" /> : null}
                          {post.kind === "Tour" ? <MapPin aria-hidden="true" className="size-3.5" /> : null}
                          {post.kind}
                        </span>
                        <span className="text-xs font-semibold text-bead">Sample post · unconfirmed</span>
                      </div>

                      <h2 className="mt-3 text-lg font-extrabold leading-snug">{post.title}</h2>
                      <p className="mt-2 text-[1.05rem] leading-relaxed text-foreground/90">{post.body}</p>

                      {post.date ? (
                        <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground">
                          <CalendarDays aria-hidden="true" className="size-4 text-bead" /> {post.date}
                        </p>
                      ) : null}

                      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <MapPin aria-hidden="true" className="size-4 text-highland" /> {post.location}
                      </p>

                      {post.cloudinaryPublicId ? (
                        <a
                          href={`${DEMO_CLOUD}/${post.cloudinaryPublicId}.jpg`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open Cloudinary demo photo for ${post.kind.toLowerCase()} sample`}
                          className="mt-4 block overflow-hidden border border-border bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <img
                            src={`${DEMO_CLOUD}/c_fill,w_1000,h_560,q_auto,f_auto/${post.cloudinaryPublicId}.jpg`}
                            alt={`Cloudinary demo image placeholder for a sample ${post.kind.toLowerCase()} post`}
                            loading="lazy"
                            className="aspect-[16/9] w-full object-cover"
                          />
                          <span className="flex items-center justify-between gap-3 px-3 py-2 text-xs font-bold text-muted-foreground">
                            <span>Cloudinary demo image · replace with campaign media</span>
                            <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                          </span>
                        </a>
                      ) : null}

                      <div className="mt-3 flex items-center justify-between gap-2 text-sm text-muted-foreground">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => toggleLike(post.id)}
                          aria-label={`${hasLiked ? "Unlike" : "Like"} this post, ${post.likes} likes`}
                          aria-pressed={hasLiked}
                          className={`h-10 min-w-16 justify-start gap-2 px-2 ${hasLiked ? "text-bead" : "text-muted-foreground"}`}
                        >
                          <Heart aria-hidden="true" className={`size-5 ${hasLiked ? "fill-current" : ""}`} />
                          <span>{post.likes}</span>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setExpandedPost(commentsOpen ? null : post.id)}
                          aria-label={`${commentsOpen ? "Hide" : "Show"} ${post.comments} sample comments`}
                          aria-expanded={commentsOpen}
                          className="h-10 min-w-16 justify-start gap-2 px-2 text-muted-foreground"
                        >
                          <MessageCircle aria-hidden="true" className="size-5" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => void sharePost(post)} aria-label={`Share ${post.title}`} className="size-10 px-0 text-muted-foreground">
                          <Share2 aria-hidden="true" className="size-5" />
                        </Button>
                      </div>

                      {commentsOpen ? (
                        <div className="mt-3 border-l-2 border-sun pl-4">
                          <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Sample replies · not real comments</p>
                          {post.replies.map((reply, index) => (
                            <p key={`${post.id}-${index}`} className="py-1.5 text-sm leading-relaxed text-foreground/90">{reply}</p>
                          ))}
                          <Button type="button" variant="link" className="mt-1 h-auto p-0 text-sm font-bold text-bead" disabled>
                            Replying will be available after team setup
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="px-5 py-8 text-center text-sm font-semibold text-muted-foreground">
            You’re up to date · Confirmed campaign updates will be added here.
          </div>
        </section>

        <aside className="hidden space-y-6 px-5 py-6 md:block">
          <section aria-label="Next sample event" id="upcoming" className="border-y border-border py-5">
            <p className="text-xs font-extrabold uppercase text-bead">Next on the calendar</p>
            <h2 className="mt-2 font-display text-3xl">Jacaranda meet-up</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">A sample event card. Date, venue and campaign participation have not been confirmed.</p>
            <p className="mt-3 flex items-center gap-2 text-sm font-bold"><CalendarDays aria-hidden="true" className="size-4 text-bead" /> Date to be confirmed</p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <a href="#jacaranda-meetup">View sample thread <ArrowUpRight aria-hidden="true" /></a>
            </Button>
          </section>

          <section aria-label="Suggested campaign pages" className="border-y border-border py-5">
            <p className="text-xs font-extrabold uppercase text-bead">Keep moving</p>
            <Link to="/updates" className="mt-3 flex items-center justify-between py-2 text-sm font-bold hover:text-bead">
              Get campaign updates <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <Link to="/join" className="flex items-center justify-between py-2 text-sm font-bold hover:text-bead">
              Join the campaign <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}