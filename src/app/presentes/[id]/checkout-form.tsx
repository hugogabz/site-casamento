"use client";

import { useActionState } from "react";
import { Gift, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { createGiftOrder, type CheckoutState } from "@/app/presentes/[id]/actions";
import { Button } from "@/components/ui/button";

const initialState: CheckoutState = {};
const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#d8cbc0] bg-white/80 px-4 py-3 outline-none transition focus:border-[#596653] focus:ring-4 focus:ring-[#9faf94]/20";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-full bg-[#596653] text-white hover:bg-[#46513f]"
    >
      {pending ? <LoaderCircle className="animate-spin" /> : <Gift />}
      {pending ? "Abrindo pagamento..." : "Presentear com InfinitePay"}
    </Button>
  );
}

export function CheckoutForm({
  giftId,
  available,
  allowsCustomAmount,
  minimumAmountInCents,
}: {
  giftId: string;
  available: number;
  allowsCustomAmount: boolean;
  minimumAmountInCents: number;
}) {
  const action = createGiftOrder.bind(null, giftId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-[#665a52]">Seu nome</span>
        <input className={inputClassName} name="guestName" required autoComplete="name" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-[#665a52]">Seu e-mail</span>
        <input className={inputClassName} name="guestEmail" type="email" required autoComplete="email" />
      </label>
      {allowsCustomAmount ? (
        <label className="block">
          <span className="text-sm font-medium text-[#665a52]">Quanto você deseja contribuir?</span>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 mt-1 -translate-y-1/2 text-[#7e7868]">R$</span>
            <input
              className={`${inputClassName} pl-12`}
              name="customAmount"
              type="number"
              inputMode="decimal"
              min={(minimumAmountInCents / 100).toFixed(2)}
              max="100000"
              step="0.01"
              required
              defaultValue={(minimumAmountInCents / 100).toFixed(2)}
            />
          </div>
          <span className="mt-2 block text-xs text-[#7e7868]">Escolha qualquer valor a partir do mínimo indicado.</span>
        </label>
      ) : (
        <label className="block">
          <span className="text-sm font-medium text-[#665a52]">Quantidade</span>
          <select className={inputClassName} name="quantity" defaultValue="1">
            {Array.from({ length: available }, (_, index) => index + 1).map((quantity) => (
              <option key={quantity} value={quantity}>{quantity}</option>
            ))}
          </select>
        </label>
      )}
      <label className="block">
        <span className="text-sm font-medium text-[#665a52]">Mensagem para os noivos (opcional)</span>
        <textarea
          className={`${inputClassName} min-h-28 resize-y`}
          name="guestMessage"
          maxLength={500}
          placeholder="Escreva uma mensagem carinhosa..."
        />
      </label>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-[#9f6d65]/10 p-4 text-sm text-[#76564f]">{state.error}</p>
      ) : null}
      <SubmitButton />
      <p className="text-center text-xs leading-5 text-[#7e7868]">
        Você será direcionado ao checkout seguro da InfinitePay para pagar com Pix ou cartão.
      </p>
    </form>
  );
}
