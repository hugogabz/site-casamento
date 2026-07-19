"use client";

import { useActionState, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, Save, X } from "lucide-react";
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
  const [previewUrl, setPreviewUrl] = useState(gift?.imageUrl ?? "");
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function selectImage(file?: File) {
    if (!file) return;
    setSelectedFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearSelectedImage() {
    if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setSelectedFileName("");
    setPreviewUrl(gift?.imageUrl ?? "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
        <div className="sm:col-span-2">
          <span className="text-sm font-medium text-[#665a52]">Foto do presente</span>
          <div className="mt-2 grid gap-4 rounded-3xl border border-[#d8cbc0] bg-white/55 p-4 sm:grid-cols-[180px_1fr] sm:p-5">
            <div
              className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#efe3d7] bg-cover bg-center"
              style={previewUrl ? { backgroundImage: `url("${previewUrl}")` } : undefined}
            >
              {!previewUrl ? (
                <span className="grid h-full place-items-center text-[#9a8c82]">
                  <ImagePlus className="size-9" />
                </span>
              ) : null}
            </div>

            <div className="flex flex-col justify-center">
              <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#596653] px-5 text-sm font-medium text-white transition hover:bg-[#46513f] sm:self-start">
                <ImagePlus className="size-4" />
                Escolher foto do dispositivo
                <input
                  ref={fileInputRef}
                  className="sr-only"
                  name="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(event) => selectImage(event.target.files?.[0])}
                />
              </label>
              <p className="mt-3 text-xs leading-5 text-[#7e7868]">
                Use fotos horizontais em 4:3, preferencialmente 1200 × 900 px. JPG, PNG,
                WebP ou AVIF, com no máximo 5 MB.
              </p>
              {selectedFileName ? (
                <button
                  type="button"
                  onClick={clearSelectedImage}
                  className="mt-2 inline-flex items-center gap-1 self-start text-xs font-medium text-[#76564f] hover:underline"
                >
                  <X className="size-3.5" /> Remover {selectedFileName}
                </button>
              ) : null}
            </div>
          </div>

          <details className="mt-3 rounded-2xl border border-[#d8cbc0]/70 bg-white/40 px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-[#665a52]">
              Ou usar o endereço de uma imagem
            </summary>
            <input
              className={inputClassName}
              name="imageUrl"
              defaultValue={gift?.imageUrl ?? ""}
              onChange={(event) => {
                if (!selectedFileName) setPreviewUrl(event.target.value);
              }}
              placeholder="/gifts/imagem.svg ou https://..."
            />
          </details>
        </div>
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
