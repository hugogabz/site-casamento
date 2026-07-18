import { CheckCircle2, Clock3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { INVITE_STATUS } from "@/types/invite";

export default async function InviteConfirmationPage({ params }: { params: Promise<{ reservationId: string }> }) {
  const { reservationId } = await params;
  const reservation = await prisma.inviteReservation.findUnique({ where: { id: reservationId }, include: { guests: true } });
  if (!reservation) notFound();
  const paid = reservation.status === INVITE_STATUS.PAID;
  return <main className="flex min-h-screen items-center justify-center bg-[#f8f2ea] px-5 py-12 text-[#44362f]"><section className="w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/65 p-7 text-center shadow-xl shadow-[#6f5745]/10 sm:p-12">{paid ? <CheckCircle2 className="mx-auto size-14 text-[#596653]" /> : <Clock3 className="mx-auto size-14 text-[#9f6d65]" />}<p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#7e7868]">{paid ? "Presença confirmada" : "Processando pagamento"}</p><h1 className="mt-3 font-serif text-4xl">{paid ? "Nos vemos na festa!" : "Estamos quase lá"}</h1><p className="mt-4 text-sm leading-7 text-[#665a52]">{paid ? `Os ${reservation.quantity} nomes já estão na lista oficial da entrada.` : "Assim que a InfinitePay confirmar o pagamento, os nomes serão incluídos automaticamente na lista."}</p><ul className="mt-6 space-y-2 rounded-2xl bg-white/55 p-4 text-left text-sm">{reservation.guests.map((guest) => <li key={guest.id}>• {guest.name}</li>)}</ul><Link href="/" className="mt-7 inline-flex h-11 items-center rounded-full border border-[#596653]/30 px-6 text-sm font-medium text-[#596653]">Voltar ao convite</Link></section></main>;
}
