import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bike,
  Droplets,
  GraduationCap,
  Route as RoadIcon,
  ShieldCheck,
  Sprout,
  Share2,
  Trophy,
  Wifi,
} from "lucide-react";
import heroImg from "@/assets/pokot-rally.jpg";
import { AppActions } from "@/components/AppActions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Johnstone Loyatum — MP Aspirant, Pokot South 2027" },
      {
        name: "description",
        content:
          "Loyatum Tosha! Johnstone Loyatum for Member of Parliament, Pokot South. Maji, elimu, barabara na amani kwa kila ward.",
      },
      { property: "og:title", content: "Johnstone Loyatum — Pokot South Ni Yetu!" },
      {
        property: "og:description",
        content: "The people's choice for Pokot South MP 2027. Chepareria, Batei, Lelan, Tapach — tuko pamoja.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SHARE_TEXT =
  "Pokot South 2027 — Johnstone Loyatum TOSHA! 🔥 Maji, Elimu, Barabara, Amani. Tuko pamoja! ";

const agenda = [
  { icon: Droplets, title: "Maji Safi", text: "Boreholes and dams so no mother walks for water." },
  { icon: GraduationCap, title: "Elimu Bora", text: "Fair bursaries, better classrooms, every child in school." },
  { icon: RoadIcon, title: "Barabara", text: "Roads that open our markets from Chepareria to Lelan." },
  { icon: ShieldCheck, title: "Amani", text: "Peace and security — our herds and families safe." },
  { icon: Sprout, title: "Kazi kwa Vijana", text: "Jobs, livestock value chains and farming that pays." },
];

const wards = ["Chepareria", "Batei", "Lelan", "Tapach"];

const audiences = ["Vijana", "Akina Mama", "Wazee", "Wafugaji", "Wakulima", "Wanabiashara"];

const youthPledges = [
  { icon: Wifi, title: "Ajira Digital", text: "A free Wi-Fi tech hub in every ward. Online work, from home." },
  { icon: Trophy, title: "Talanta", text: "Football, athletics and music — leagues, kits and real stages." },
  { icon: GraduationCap, title: "Bursary Bila Kona", text: "Transparent bursaries, published online. No connections needed." },
  { icon: Bike, title: "Hustle Fund", text: "Seed capital for boda boda, youth SACCOs and small biashara." },
];

// Kenya's general election: second Tuesday of August, 2027.
const ELECTION_DAY = new Date("2027-08-10T06:00:00+03:00").getTime();

function Countdown() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const update = () => setDays(Math.max(0, Math.ceil((ELECTION_DAY - Date.now()) / 86_400_000)));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-ink py-10 text-center text-ink-foreground">
      <p className="text-base font-bold uppercase tracking-[0.3em] text-sun">Election Day · 10 Aug 2027</p>
      <p className="mt-2 font-display text-7xl md:text-9xl">
        {days ?? "—"} <span className="text-sun">siku</span>
      </p>
      <p className="mt-2 text-lg font-semibold text-ink-foreground/80">Saa ni sasa. Every day counts.</p>
    </section>
  );
}

function Index() {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Johnstone Loyatum 2027", text: SHARE_TEXT, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + url)}`, "_blank");
  };

  return (
    <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative isolate flex min-h-[100svh] flex-col bg-ink text-ink-foreground">
        <img
          src={heroImg}
          alt="Supporters on the hills of Pokot South at sunrise"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="bg-hero-overlay absolute inset-0 -z-10" />

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
          <span className="font-display text-2xl text-sun">Loyatum 2027</span>
          <a
            href="#join"
            className="rounded-sm bg-sun px-4 py-2 text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            Jiunge
          </a>
        </header>

        <div className="mx-auto mt-auto w-full max-w-6xl px-5 pb-16 md:pb-24">
          <p className="mb-4 inline-block rounded-sm bg-bead px-3 py-1 text-sm font-bold uppercase tracking-widest text-primary-foreground">
            MP Aspirant · Pokot South
          </p>
          <h1 className="font-display text-6xl sm:text-8xl md:text-[9rem]">
            Johnstone
            <br />
            <span className="text-sun">Loyatum</span>
          </h1>
          <p className="mt-6 max-w-xl text-xl font-semibold sm:text-2xl">
            Sauti ya wananchi. Kazi ya ukweli. <span className="text-sun">Pokot South ni yetu!</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#agenda"
              className="rounded-sm bg-bead px-7 py-4 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Our Agenda
            </a>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-sm border-2 border-ink-foreground px-7 py-4 text-lg font-bold uppercase tracking-wide transition-colors hover:bg-ink-foreground hover:text-ink"
            >
              <Share2 className="h-5 w-5" /> Share the Wave
            </button>
          </div>
        </div>
        <div className="bead-strip w-full" />
      </section>

      {/* CHANT MARQUEE */}
      <div className="overflow-hidden bg-sun py-4 text-ink" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-display text-3xl">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-10">
              <span>Loyatum Tosha!</span>
              <span className="text-bead">★</span>
              <span>Ni Yeye 2027</span>
              <span className="text-bead">★</span>
              <span>Tuko Pamoja</span>
              <span className="text-bead">★</span>
              <span>Vijana Tuamke</span>
              <span className="text-bead">★</span>
              <span>Mguu kwa Mguu</span>
              <span className="text-bead">★</span>
              <span>Gen Z Tuko Ready</span>
              <span className="text-bead">★</span>
              <span>Pokot South Mpya</span>
              <span className="text-bead">★</span>
            </div>
          ))}
        </div>
      </div>

      <Countdown />

      {/* WHY */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center md:py-28">
        <h2 className="font-display text-5xl md:text-7xl">
          Mtoto wa <span className="text-bead">nyumbani.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl">
          Raised among us, schooled at Kenyatta University, and ready to carry the voice of
          Pokot South to Parliament. Not promises — <strong className="text-foreground">results.</strong>
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {audiences.map((a) => (
            <span
              key={a}
              className="rounded-full border-2 border-foreground px-5 py-2 text-base font-bold uppercase tracking-wide"
            >
              {a}
            </span>
          ))}
        </div>
      </section>

      {/* YOUTH */}
      <section id="vijana" className="relative overflow-hidden bg-sun py-20 text-ink md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <p className="inline-block -rotate-2 rounded-sm bg-ink px-4 py-2 text-base font-bold uppercase tracking-widest text-sun">
            Gen Z · Millennials · Hustlers
          </p>
          <h2 className="mt-6 font-display text-6xl sm:text-7xl md:text-[8rem]">
            Vijana,
            <br />
            <span className="text-bead">hii ni yetu!</span>
          </h2>
          <p className="mt-6 max-w-2xl text-xl font-semibold md:text-2xl">
            Sisi ndio wengi. Sisi ndio nguvu. Tusipige kelele mtandaoni pekee — tupige kura.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {youthPledges.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-sm bg-ink p-6 text-ink-foreground transition-transform hover:-translate-y-1"
              >
                <Icon className="h-9 w-9 text-sun" strokeWidth={2.2} />
                <h3 className="mt-4 font-display text-3xl">{title}</h3>
                <p className="mt-2 text-lg leading-snug text-ink-foreground/80">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-5 rounded-sm border-4 border-ink p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="font-display text-4xl md:text-5xl">Una ID? Jisajili!</p>
              <p className="mt-2 text-lg font-semibold">
                No card, no voice. Register as a voter and bring five friends.
              </p>
            </div>
            <a
              href="https://www.iebc.or.ke"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 rounded-sm bg-bead px-7 py-4 text-lg font-bold uppercase tracking-wide text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Register to Vote
            </a>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section id="agenda" className="bg-ink py-20 text-ink-foreground md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-5xl md:text-7xl">
            The <span className="text-sun">Agenda</span>
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-sm bg-ink-foreground/15 sm:grid-cols-2 lg:grid-cols-5">
            {agenda.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-ink p-7">
                <Icon className="h-9 w-9 text-sun" strokeWidth={2.2} />
                <h3 className="mt-5 font-display text-3xl">{title}</h3>
                <p className="mt-3 text-lg leading-snug text-ink-foreground/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS + WARDS */}
      <section className="mx-auto max-w-6xl px-5 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            { n: "4", l: "Wards" },
            { n: "40K+", l: "Voters" },
            { n: "80K+", l: "Wananchi" },
          ].map((s) => (
            <div key={s.l} className="border-l-8 border-bead pl-5">
              <div className="font-display text-7xl md:text-8xl">{s.n}</div>
              <div className="mt-1 text-xl font-bold uppercase tracking-widest text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
        <h2 className="mt-20 font-display text-4xl md:text-6xl">
          Kila ward. <span className="text-highland">Kila kijiji.</span>
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {wards.map((w) => (
            <div
              key={w}
              className="rounded-sm bg-highland px-5 py-8 text-center font-display text-3xl text-accent-foreground md:text-4xl"
            >
              {w}
            </div>
          ))}
        </div>
      </section>

      {/* JOIN */}
      <section id="join" className="bg-bead py-20 text-center text-primary-foreground md:py-28">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-6xl md:text-8xl">
            Wave <span className="text-sun">Imefika!</span>
          </h2>
          <p className="mt-6 text-xl font-semibold md:text-2xl">
            Tell your family, your village, your WhatsApp group. 2027 tunaenda na Loyatum.
          </p>
          <div className="mt-10 space-y-4">
            <AppActions />
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-sm bg-sun px-8 py-4 text-lg font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
            >
              <Share2 className="h-5 w-5" /> Share on WhatsApp
            </button>
          </div>
        </div>
      </section>

      <div className="bead-strip w-full" />
      <footer className="bg-ink py-10 text-center text-ink-foreground">
        <p className="font-display text-3xl text-sun">Loyatum Tosha!</p>
        <p className="mt-2 text-base text-ink-foreground/70">
          Johnstone Loyatum · MP Aspirant, Pokot South Constituency · West Pokot County
        </p>
      </footer>
    </main>
  );
}
