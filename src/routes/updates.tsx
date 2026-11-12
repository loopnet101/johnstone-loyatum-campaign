import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BellRing } from "lucide-react";
import { AppActions } from "@/components/AppActions";

export const Route = createFileRoute("/updates")({
  head: () => ({
    meta: [
      { title: "Campaign Updates — Johnstone Loyatum" },
      { name: "description", content: "Get direct campaign updates from Johnstone Loyatum's Pokot South campaign." },
      { property: "og:title", content: "Campaign Updates — Johnstone Loyatum" },
      { property: "og:description", content: "Choose how you want to follow the Pokot South campaign." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UpdatesPage,
});

function UpdatesPage() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-12 text-center md:py-20">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-sun text-ink">
          <BellRing aria-hidden="true" className="size-7" />
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-bead">Be in the loop</p>
        <h1 className="mt-3 font-display text-5xl sm:text-7xl">Updates, moja kwa moja.</h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
          Get campaign alerts on your phone, or add Loyatum 2027 to your home screen.
        </p>
        <div className="mt-8">
          <AppActions />
        </div>
        <Link to="/track" className="mx-auto mt-8 inline-flex items-center gap-2 text-sm font-bold text-foreground underline decoration-bead underline-offset-4">
          <ArrowLeft aria-hidden="true" className="size-4" /> View the public record
        </Link>
      </section>
    </main>
  );
}