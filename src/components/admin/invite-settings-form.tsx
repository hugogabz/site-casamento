"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateInviteSettings, type InviteSettingsState } from "@/app/admin/convites/actions";
import { Button } from "@/components/ui/button";

const initialState: InviteSettingsState = {};
const inputClassName = "mt-2 w-full rounded-2xl border border-[#d8cbc0] bg-white/80 px-4 py-3 outline-none focus:border-[#596653] focus:ring-4 focus:ring-[#9faf94]/20";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-full bg-[#596653] text-white hover:bg-[#46513f]">
      {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
      {pending ? "Salvando..." : "Salvar configurações"}
    </Button>
  );
}

export function InviteSettingsForm({ settings }: {
  settings: { invitePriceInCents: number; totalInvites: number; reservationMinutes: number; inviteSalesEnabled: boolean };
}) {
  const [state, action] = useActionState(updateInviteSettings, initialState);
  return (
    <form action={action} className="grid gap-5 sm:grid-cols-3">
      <label>
        <span className="text-sm font-medium text-[#665a52]">Valor por pessoa (R$)</span>
        <input className={inputClassName} name="price" type="number" min="0.01" step="0.01" required defaultValue={(settings.invitePriceInCents / 100).toFixed(2)} />
      </label>
      <label>
        <span className="text-sm font-medium text-[#665a52]">Quantidade total</span>
        <input className={inputClassName} name="totalInvites" type="number" min="1" step="1" required defaultValue={settings.totalInvites || 1} />
      </label>
      <label>
        <span className="text-sm font-medium text-[#665a52]">Reserva por minutos</span>
        <input className={inputClassName} name="reservationMinutes" type="number" min="5" max="60" step="1" required defaultValue={settings.reservationMinutes} />
      </label>
      <label className="flex items-center gap-3 rounded-2xl border border-[#d8cbc0] bg-white/55 px-4 py-3 sm:col-span-3">
        <input name="inviteSalesEnabled" type="checkbox" defaultChecked={settings.inviteSalesEnabled} className="size-4 accent-[#596653]" />
        <span className="text-sm font-medium text-[#665a52]">Liberar venda de convites no site</span>
      </label>
      {state.error ? <p className="rounded-xl bg-[#9f6d65]/10 p-4 text-sm text-[#76564f] sm:col-span-3">{state.error}</p> : null}
      {state.success ? <p className="rounded-xl bg-[#9faf94]/20 p-4 text-sm text-[#596653] sm:col-span-3">Configurações salvas com sucesso.</p> : null}
      <div className="sm:col-span-3"><SubmitButton /></div>
    </form>
  );
}
