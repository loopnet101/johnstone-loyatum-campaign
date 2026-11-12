import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, FileClock, MessageCircle, Pin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Record — Johnstone Loyatum, Pokot South" },
      { name: "description", content: "A public record of dated, sourced campaign progress for Pokot South." },
      { property: "og:title", content: "Track Record — Johnstone Loyatum" },
      { property: "og:description", content: "Follow sourced campaign progress and public updates for Pokot South." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-ink text-ink-foreground">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-8 md:pb-12 md:pt-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-sun">Pokot South · Public record</p>
          <h1 className="mt-3 font-display text-5xl sm:text-7xl">Track the work.</h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-foreground/80 md:text-xl">
            A clear record of progress, with dates and sources. No big claims without proof.
          </p>
        </div>
      </header>

      <section aria-label="Public campaign record" className="mx-auto max-w-3xl px-5 py-8 md:py-12">
        <div className="flex items-center gap-3 border-b border-border pb-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted text-bead">
            <FileClock aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="text-xl font-extrabold">Progress log</h2>
            <p className="text-sm text-muted-foreground">Public updates · Pokot South</p>
          </div>
        </div>

        <article className="relative border-b border-border py-7 pl-9">
          <span className="absolute left-0 top-8 grid size-6 place-items-center rounded-full bg-sun text-ink">
            <Pin aria-hidden="true" className="size-3.5" />
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-bold">Campaign record</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-semibold text-highland">Open record</span>
          </div>
          <h3 className="mt-3 font-display text-3xl sm:text-4xl">Proof over noise.</h3>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
            No dated, independently verifiable progress reports have been added here yet. Campaign proposals are not presented as completed work.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><BadgeCheck aria-hidden="true" className="size-4 text-highland" /> Source-linked updates</span>
            <span className="inline-flex items-center gap-1.5"><MessageCircle aria-hidden="true" className="size-4" /> Ward-by-ward progress</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" className="border-border bg-background text-foreground">
              <Link to="/join">Join the campaign <ArrowUpRight aria-hidden="true" /></Link>
            </Button>
            <span className="text-sm text-muted-foreground">Milestones will appear here when they can be sourced.</span>
          </div>
        </article>
      </section>
    </main>
  );
}