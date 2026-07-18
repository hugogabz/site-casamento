import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createGift } from "@/app/admin/actions";
import { GiftForm } from "@/components/admin/gift-form";

export default function NewGiftPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
      <Link href="/admin/presentes" className="inline-flex items-center gap-2 text-sm text-[#665a52] hover:text-[#44362f]">
        <ArrowLeft className="size-4" /> Voltar para presentes
      </Link>
      <section className="mt-6 rounded-3xl border border-white/80 bg-white/65 p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7e7868]">Novo item</p>
        <h1 className="mt-2 font-serif text-3xl">Adicionar presente</h1>
        <p className="mt-2 text-sm leading-6 text-[#665a52]">Preencha as informações que aparecerão para os convidados.</p>
        <div className="mt-8"><GiftForm action={createGift} /></div>
      </section>
    </main>
  );
}
