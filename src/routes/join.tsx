import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Share2, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join the Campaign — Johnstone Loyatum" },
      { name: "description", content: "Stand with the Johnstone Loyatum campaign in Pokot South." },
      { property: "og:title", content: "Join the Campaign — Johnstone Loyatum" },
      { property: "og:description", content: "Stand with the Johnstone Loyatum campaign in Pokot South." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JoinPage,
});

function JoinPage() {
  const shareCampaign = () => {
    const message = "Pokot South 2027 — Johnstone Loyatum TOSHA! Tuko pamoja!";
    window.open(`https://wa.me/?text=${encodeURIComponent(`${message} ${window.location.origin}`)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col bg-ink text-ink-foreground">
      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-12 md:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-sun">Pokot South 2027</p>
        <h1 className="mt-4 font-display text-6xl sm:text-8xl">Tuko pamoja.</h1>
        <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink-foreground/80">
          Your voice matters. Share the campaign and make sure your voter registration is ready.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button onClick={shareCampaign} className="h-auto bg-sun px-6 py-4 text-base font-bold uppercase text-ink hover:bg-sun/90">
            <Share2 aria-hidden="true" /> Share on WhatsApp
          </Button>
          <Button asChild variant="outline" className="h-auto border-ink-foreground/50 bg-transparent px-6 py-4 text-base font-bold text-ink-foreground hover:bg-ink-foreground hover:text-ink">
            <a href="https://www.iebc.or.ke" target="_blank" rel="noreferrer">
              <Vote aria-hidden="true" /> Voter registration <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
        </div>
        <Link to="/track" className="mt-10 inline-flex items-center gap-2 self-start text-sm font-bold text-sun underline underline-offset-4">
          See the public record <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </section>
    </main>
  );
}