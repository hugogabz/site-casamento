"use client";

import { motion } from "framer-motion";
import { Gift as GiftIcon, Sparkles } from "lucide-react";
import Link from "next/link";

import { GiftImage } from "@/components/gifts/gift-image";
import { getAvailableQuantity, type Gift } from "@/types/gift";

type GiftCardProps = {
  gift: Gift;
  index: number;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function GiftCard({ gift, index }: GiftCardProps) {
  const availableQuantity = getAvailableQuantity(gift);
  const isSoldOut = gift.status === "SOLD_OUT";
  const progress = Math.min((gift.giftedQuantity / gift.quantity) * 100, 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 shadow-lg shadow-[#6f5745]/10 backdrop-blur transition-shadow duration-300 hover:shadow-xl hover:shadow-[#6f5745]/15"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#efe3d7]">
        <GiftImage
          src={gift.imageUrl}
          alt={`Imagem do presente ${gift.name}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full"
          imageClassName="transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#596653] shadow-sm backdrop-blur">
          {gift.allowsCustomAmount
            ? "Valor livre"
            : isSoldOut
              ? "Esgotado"
              : `${availableQuantity} disponível${availableQuantity > 1 ? "is" : ""}`}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2 text-[#9f6d65]">
          <Sparkles className="size-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">
            Presente especial
          </span>
        </div>

        <h2 className="font-serif text-2xl text-[#44362f]">{gift.name}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#665a52]">
          {gift.description}
        </p>

        {!gift.allowsCustomAmount ? <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-[#7e7868]">
            <span>{gift.giftedQuantity} presenteado(s)</span>
            <span>{gift.quantity} no total</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#e4d8ce]">
            <div
              className="h-full rounded-full bg-[#9faf94] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div> : null}

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#ded2c8] pt-5">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[#7e7868]">
              Valor
            </p>
            <p className="mt-1 text-xl font-semibold text-[#44362f]">
              {gift.allowsCustomAmount
                ? `A partir de ${currencyFormatter.format(gift.priceInCents / 100)}`
                : currencyFormatter.format(gift.priceInCents / 100)}
            </p>
          </div>
          {isSoldOut ? (
            <span className="inline-flex h-11 items-center gap-2 rounded-full bg-[#596653]/50 px-5 text-sm font-medium text-white">
              <GiftIcon className="size-4" /> Esgotado
            </span>
          ) : (
            <Link
              href={`/presentes/${gift.id}`}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-[#596653] px-5 text-sm font-medium text-white transition hover:bg-[#46513f]"
            >
              <GiftIcon className="size-4" /> Presentear
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
