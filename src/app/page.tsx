import { CalendarDays, ChevronDown, Clock3, Gift, Heart, MapPin, TicketCheck } from "lucide-react";
import Link from "next/link";

import { GiftGrid } from "@/components/gifts/gift-grid";
import { AnimatedSection } from "@/components/home/animated-section";
import { Countdown } from "@/components/home/countdown";
import { wedding } from "@/data/wedding";
import { getPublicGifts } from "@/services/gifts";

export default async function Home() {
  const gifts = await getPublicGifts();
  return (
    <main className="overflow-hidden bg-[#f8f2ea] text-[#44362f]">
      <section className="relative flex min-h-screen items-center justify-center px-5 py-16 text-center sm:px-8">
        <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-[#d7b9a3]/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-10 size-96 rounded-full bg-[#9faf94]/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-5 rounded-[2.5rem] border border-white/60 sm:inset-8" />

        <AnimatedSection hero className="relative mx-auto max-w-4xl">
          <Heart className="mx-auto size-8 fill-[#9f6d65] text-[#9f6d65]" />
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.4em] text-[#7e7868]">Vamos nos casar</p>
          <h1 className="mt-7 font-serif text-6xl leading-[0.92] sm:text-8xl lg:text-[7.5rem]">
            {wedding.couple.first}
            <span className="mx-auto my-3 block font-serif text-4xl italic text-[#9f6d65] sm:text-5xl">&</span>
            {wedding.couple.second}
          </h1>
          <div className="mx-auto mt-9 flex max-w-xl items-center justify-center gap-4 text-sm uppercase tracking-[0.16em] text-[#596653] sm:text-base">
            <span className="h-px flex-1 bg-[#596653]/25" />
            <span>{wedding.dateLabel}</span>
            <span className="h-px flex-1 bg-[#596653]/25" />
          </div>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/convites" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#596653] px-8 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#46513f]">
              <TicketCheck className="size-4" /> Confirmar presença
            </Link>
            <Link href="#presentes" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#9f6d65]/35 bg-white/45 px-8 text-sm font-medium text-[#76564f] transition hover:-translate-y-0.5 hover:bg-white/80">
              <Gift className="size-4" /> Lista de presentes
            </Link>
          </div>
        </AnimatedSection>

        <a href="#historia" aria-label="Ver mais" className="absolute bottom-9 left-1/2 -translate-x-1/2 animate-bounce text-[#7e7868]">
          <ChevronDown className="size-5" />
        </a>
      </section>

      <section id="historia" className="relative bg-[#fffaf4] px-5 py-24 sm:px-8 sm:py-32">
        <AnimatedSection className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#9f6d65]">Nossa história</p>
          <h2 className="mt-5 font-serif text-4xl sm:text-5xl">O amor nos trouxe até aqui</h2>
          <div className="mx-auto my-7 flex items-center justify-center gap-3"><span className="h-px w-14 bg-[#d7b9a3]" /><Heart className="size-4 fill-[#9f6d65] text-[#9f6d65]" /><span className="h-px w-14 bg-[#d7b9a3]" /></div>
          <p className="text-base leading-8 text-[#665a52] sm:text-lg">{wedding.story}</p>
        </AnimatedSection>
      </section>

      <section className="relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9faf94]/15 blur-3xl" />
        <AnimatedSection className="relative mx-auto max-w-4xl">
          <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#7e7868]">Contagem regressiva</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">Para o nosso grande dia</h2></div>
          <div className="mt-10"><Countdown targetDate={wedding.date} /></div>
        </AnimatedSection>
      </section>

      <section className="bg-[#596653] px-5 py-24 text-[#fffaf4] sm:px-8 sm:py-32">
        <AnimatedSection className="mx-auto max-w-5xl">
          <div className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d7b9a3]">Onde e quando</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">A celebração</h2></div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              [CalendarDays, "Data", wedding.dateLabel],
              [Clock3, "Horário", wedding.timeLabel],
              [MapPin, "Local", wedding.venue],
            ].map(([Icon, label, value]) => {
              const IconComponent = Icon as typeof CalendarDays;
              return <div key={String(label)} className="rounded-3xl border border-white/15 bg-white/10 p-6 text-center"><IconComponent className="mx-auto size-6 text-[#d7b9a3]" /><p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7b9a3]">{String(label)}</p><p className="mt-2 font-serif text-xl">{String(value)}</p></div>;
            })}
          </div>
          <div className="mt-7 text-center"><p className="text-sm text-white/70">{wedding.city}</p><a href={wedding.mapUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-6 text-sm font-medium transition hover:bg-white/10"><MapPin className="size-4" /> Abrir no mapa</a></div>
        </AnimatedSection>
      </section>

      <section id="presentes" className="bg-[#fffaf4] px-5 py-24 sm:px-8 sm:py-32">
        <AnimatedSection className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#9f6d65]">Com carinho</p>
            <h2 className="mt-5 font-serif text-4xl sm:text-5xl">Lista de presentes</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#665a52]">Sua presença já é o nosso maior presente. Se desejar, escolha uma experiência para tornar este novo capítulo ainda mais especial.</p>
          </div>
          <GiftGrid gifts={gifts} />
        </AnimatedSection>
      </section>

      <section className="px-5 py-24 text-center sm:px-8 sm:py-32">
        <AnimatedSection className="mx-auto max-w-2xl"><Heart className="mx-auto size-7 fill-[#9f6d65] text-[#9f6d65]" /><h2 className="mt-6 font-serif text-4xl sm:text-5xl">Queremos celebrar com você</h2><p className="mt-5 leading-7 text-[#665a52]">Confirme sua presença e informe o nome de cada acompanhante para a lista da recepção.</p><Link href="/convites" className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#596653] px-8 text-sm font-medium text-white transition hover:bg-[#46513f]"><TicketCheck className="size-4" /> Confirmar presença</Link></AnimatedSection>
      </section>

      <footer className="border-t border-[#ded2c8] px-5 py-8 text-center text-sm text-[#7e7868]">Feito com carinho para {wedding.couple.first} & {wedding.couple.second}</footer>
    </main>
  );
}
