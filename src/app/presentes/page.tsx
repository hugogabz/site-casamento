import { ArrowLeft, Heart, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Toaster } from "sonner";

import { GiftGrid } from "@/components/gifts/gift-grid";
import { getPublicGifts } from "@/services/gifts";

export const metadata: Metadata = {
  title: "Lista de presentes | Nosso Casamento",
  description:
    "Escolha um presente e faça parte deste novo capítulo da nossa história.",
};

export default async function GiftsPage() {
  const gifts = await getPublicGifts();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f2ea] px-5 py-8 text-[#44362f] sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#d7b9a3]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-[#9faf94]/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <nav className="flex items-center justify-between py-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#665a52] transition-colors hover:bg-white/60 hover:text-[#44362f]"
          >
            <ArrowLeft className="size-4" />
            Voltar ao convite
          </Link>
          <Heart className="size-6 fill-[#9f6d65] text-[#9f6d65]" />
        </nav>

        <header className="mx-auto max-w-3xl py-14 text-center sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#7e7868]">
            Com carinho
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Lista de presentes
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#665a52] sm:text-lg">
            Sua presença já é o nosso maior presente. Se desejar tornar este
            novo capítulo ainda mais especial, preparamos algumas experiências
            com muito carinho.
          </p>
        </header>

        <GiftGrid gifts={gifts} />

        <footer className="mx-auto mt-14 flex max-w-2xl items-start gap-3 rounded-2xl border border-white/80 bg-white/55 p-5 text-sm leading-6 text-[#665a52] backdrop-blur sm:items-center sm:p-6">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#596653] sm:mt-0" />
          <p>
            Esta é uma demonstração do catálogo. O pagamento seguro será
            ativado na próxima etapa do projeto.
          </p>
        </footer>
      </div>

      <Toaster richColors position="top-center" />
    </main>
  );
}
