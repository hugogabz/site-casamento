import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

import { InviteCheckoutForm } from "@/app/convites/invite-checkout-form";

export default function InvitesPage() {
  return <main className="min-h-screen bg-[#f8f2ea] px-5 py-8 text-[#44362f] sm:px-8"><div className="mx-auto max-w-3xl"><nav className="flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#665a52] hover:bg-white/60"><ArrowLeft className="size-4" /> Voltar ao convite</Link><Heart className="size-6 fill-[#9f6d65] text-[#9f6d65]" /></nav><header className="py-10 text-center sm:py-14"><p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7e7868]">Confirme sua presença</p><h1 className="mt-4 font-serif text-4xl sm:text-5xl">Vamos celebrar juntos</h1><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#665a52]">Informe o nome completo de cada pessoa. Esses nomes serão usados para conferência na entrada da festa.</p></header><section className="rounded-[2rem] border border-white/80 bg-white/65 p-6 shadow-xl shadow-[#6f5745]/10 sm:p-9"><InviteCheckoutForm /></section></div></main>;
}
