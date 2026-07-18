"use client";

import { LoaderCircle, TicketCheck, UserPlus } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { createInviteReservation, type InviteCheckoutState } from "@/app/convites/actions";
import { Button } from "@/components/ui/button";

const initialState: InviteCheckoutState = {};
const inputClass = "mt-2 w-full rounded-2xl border border-[#d8cbc0] bg-white/80 px-4 py-3 outline-none focus:border-[#596653] focus:ring-4 focus:ring-[#9faf94]/20";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-[#596653] text-white hover:bg-[#46513f]">{pending ? <LoaderCircle className="animate-spin" /> : <TicketCheck />}{pending ? "Abrindo pagamento..." : "Ir para o pagamento"}</Button>;
}

export function InviteCheckoutForm({ available, unitPriceInCents }: { available: number; unitPriceInCents: number }) {
  const [quantity, setQuantity] = useState(1);
  const [state, action] = useActionState(createInviteReservation, initialState);
  const maxQuantity = Math.min(available, 10);
  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  return <form action={action} className="space-y-5">
    <label className="block"><span className="text-sm font-medium text-[#665a52]">Seu nome completo</span><input className={inputClass} name="buyerName" required autoComplete="name" /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label><span className="text-sm font-medium text-[#665a52]">E-mail</span><input className={inputClass} name="buyerEmail" type="email" required autoComplete="email" /></label><label><span className="text-sm font-medium text-[#665a52]">Telefone</span><input className={inputClass} name="buyerPhone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" /></label></div>
    <label className="block"><span className="text-sm font-medium text-[#665a52]">Quantidade de convites</span><select className={inputClass} name="quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{Array.from({ length: maxQuantity }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} {value === 1 ? "pessoa" : "pessoas"}</option>)}</select></label>
    {quantity > 1 ? <fieldset className="space-y-4 rounded-3xl border border-[#d8cbc0] bg-white/45 p-5"><legend className="px-2 text-sm font-semibold text-[#665a52]"><span className="inline-flex items-center gap-2"><UserPlus className="size-4" /> Nomes dos acompanhantes</span></legend>{Array.from({ length: quantity - 1 }, (_, index) => <label className="block" key={index}><span className="text-sm text-[#665a52]">Acompanhante {index + 1}</span><input className={inputClass} name={`guestName${index}`} required placeholder="Nome completo para a lista de entrada" /></label>)}</fieldset> : null}
    <div className="flex items-center justify-between rounded-2xl bg-[#d7b9a3]/15 p-4"><span className="text-sm text-[#665a52]">Total</span><strong className="text-xl">{currency.format((unitPriceInCents * quantity) / 100)}</strong></div>
    {state.error ? <p role="alert" className="rounded-xl bg-[#9f6d65]/10 p-4 text-sm text-[#76564f]">{state.error}</p> : null}
    <SubmitButton />
    <p className="text-center text-xs leading-5 text-[#7e7868]">Os nomes entram na lista oficial somente após a confirmação do pagamento.</p>
  </form>;
}
