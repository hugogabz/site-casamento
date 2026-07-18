"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { useFormStatus } from "react-dom";

import type { GiftFormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

type GiftFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  priceInCents: number;
  quantity: number;
  giftedQuantity: number;
  isActive: boolean;
};

type GiftFormProps = {
  action: (state: GiftFormState, formData: FormData) => Promise<GiftFormState>;
  gift?: GiftFormValues;
};

const initialState: GiftFormState = {};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#d8cbc0] bg-white/80 px-4 py-3 text-[#44362f] outline-none transition placeholder:text-[#8d817a] focus:border-[#596653] focus:ring-4 focus:ring-[#9faf94]/20";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 rounded-full bg-[#596653] px-6 text-white hover:bg-[#46513f]"
    >
      {pending ? <LoaderCircle className="animate-spin" /> : <Save />}
      {pending ? "Salvando..." : "Salvar presente"}
    </Button>
  );
}

export function GiftForm({ action, gift }: GiftFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-[#665a52]">Nome</span>
          <input
            className={inputClassName}
            name="name"
            required
            defaultValue={gift?.name}
            placeholder="Ex.: Jantar romântico"
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-[#665a52]">Descrição</span>
          <textarea
            className={`${inputClassName} min-h-28 resize-y`}
            name="description"
            required
            defaultValue={gift?.description}
            placeholder="Conte aos convidados o que este presente representa."
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium text-[#665a52]">Imagem</span>
          <input
            className={inputClassName}
            name="imageUrl"
            required
            defaultValue={gift?.imageUrl ?? "/gifts/romantic-dinner.svg"}
            placeholder="/gifts/imagem.svg ou https://..."
          />
          <span className="mt-2 block text-xs text-[#7e7868]">
            Por enquanto, use uma imagem da pasta public ou uma URL HTTPS.
          </span>
        </label>
        <label>
          <span className="text-sm font-medium text-[#665a52]">Valor (R$)</span>
          <input
            className={inputClassName}
            name="price"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
            defaultValue={gift ? (gift.priceInCents / 100).toFixed(2) : ""}
            placeholder="280.00"
          />
        </label>
        <label>
          <span className="text-sm font-medium text-[#665a52]">Quantidade total</span>
          <input
            className={inputClassName}
            name="quantity"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={gift?.quantity ?? 1}
          />
        </label>
        <label>
          <span className="text-sm font-medium text-[#665a52]">Já presenteados</span>
          <input
            className={inputClassName}
            name="giftedQuantity"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={gift?.giftedQuantity ?? 0}
          />
        </label>
        <label className="flex items-center gap-3 self-end rounded-2xl border border-[#d8cbc0] bg-white/55 px-4 py-3">
          <input
            name="isActive"
            type="checkbox"
            defaultChecked={gift?.isActive ?? true}
            className="size-4 accent-[#596653]"
          />
          <span className="text-sm font-medium text-[#665a52]">Visível na lista pública</span>
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-xl bg-[#9f6d65]/10 p-4 text-sm text-[#76564f]">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
}
