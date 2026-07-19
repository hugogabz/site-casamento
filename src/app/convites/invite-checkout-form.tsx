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
  return <Button type="submit" disabled={pending} className="h-12 w-full rounded-full bg-[#596653] text-white hover:bg-[#46513f]">{pending ? <LoaderCircle className="animate-spin" /> : <TicketCheck />}{pending ? "Confirmando..." : "Confirmar presença"}</Button>;
}

export function InviteCheckoutForm() {
  const [quantity, setQuantity] = useState(1);
  const [state, action] = useActionState(createInviteReservation, initialState);

  if (state.success) {
    return <div className="py-8 text-center"><TicketCheck className="mx-auto size-12 text-[#596653]" /><h2 className="mt-4 font-serif text-3xl">Presença confirmada!</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#665a52]">Os nomes informados já estão na lista de convidados de Túlio e Cristiane.</p></div>;
  }

  return <form action={action} className="space-y-5">
    <label className="block"><span className="text-sm font-medium text-[#665a52]">Seu nome completo</span><input className={inputClass} name="buyerName" required autoComplete="name" /></label>
    <div className="grid gap-5 sm:grid-cols-2"><label><span className="text-sm font-medium text-[#665a52]">E-mail</span><input className={inputClass} name="buyerEmail" type="email" required autoComplete="email" /></label><label><span className="text-sm font-medium text-[#665a52]">Telefone</span><input className={inputClass} name="buyerPhone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" /></label></div>
    <label className="block"><span className="text-sm font-medium text-[#665a52]">Quantas pessoas irão?</span><select className={inputClass} name="quantity" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value} {value === 1 ? "pessoa" : "pessoas"}</option>)}</select></label>
    {quantity > 1 ? <fieldset className="space-y-4 rounded-3xl border border-[#d8cbc0] bg-white/45 p-5"><legend className="px-2 text-sm font-semibold text-[#665a52]"><span className="inline-flex items-center gap-2"><UserPlus className="size-4" /> Nomes dos acompanhantes</span></legend>{Array.from({ length: quantity - 1 }, (_, index) => <label className="block" key={index}><span className="text-sm text-[#665a52]">Acompanhante {index + 1}</span><input className={inputClass} name={`guestName${index}`} required placeholder="Nome completo para a lista de entrada" /></label>)}</fieldset> : null}
    {state.error ? <p role="alert" className="rounded-xl bg-[#9f6d65]/10 p-4 text-sm text-[#76564f]">{state.error}</p> : null}
    <SubmitButton />
    <p className="text-center text-xs leading-5 text-[#7e7868]">A confirmação é gratuita. Informe o nome completo de cada pessoa para a lista da entrada.</p>
  </form>;
}
