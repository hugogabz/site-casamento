import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CheckoutForm } from "@/app/presentes/[id]/checkout-form";
import { GiftImage } from "@/components/gifts/gift-image";
import { getGiftById } from "@/services/gifts";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function GiftCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = await getGiftById(id);
  if (!gift || !gift.isActive) notFound();

  const available = Math.max(gift.quantity - gift.giftedQuantity, 0);
  if (!gift.allowsCustomAmount && available === 0) notFound();

  return (
    <main className="min-h-screen bg-[#f8f2ea] px-5 py-8 text-[#44362f] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <nav className="flex items-center justify-between">
          <Link href="/presentes" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#665a52] hover:bg-white/60">
            <ArrowLeft className="size-4" /> Voltar para presentes
          </Link>
          <Heart className="size-6 fill-[#9f6d65] text-[#9f6d65]" />
        </nav>

        <section className="mt-8 grid overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 shadow-xl shadow-[#6f5745]/10 backdrop-blur md:grid-cols-[1.05fr_0.95fr]">
          <GiftImage
            src={gift.imageUrl}
            alt={`Imagem do presente ${gift.name}`}
            priority
            sizes="(max-width: 768px) 100vw, 52vw"
            className="aspect-[4/3] md:aspect-auto md:min-h-[520px]"
          />
          <div className="p-6 sm:p-9 lg:p-11">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7e7868]">Sua escolha</p>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{gift.name}</h1>
            <p className="mt-4 text-sm leading-6 text-[#665a52]">{gift.description}</p>
            <div className="my-6 flex items-end justify-between border-y border-[#ded2c8] py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#7e7868]">
                  {gift.allowsCustomAmount ? "Contribuição mínima" : "Valor por unidade"}
                </p>
                <p className="mt-1 text-2xl font-semibold">{currencyFormatter.format(gift.priceInCents / 100)}</p>
              </div>
              <p className="text-sm text-[#596653]">
                {gift.allowsCustomAmount
                  ? "Você escolhe o valor"
                  : `${available} disponível${available > 1 ? "is" : ""}`}
              </p>
            </div>
            <CheckoutForm
              giftId={gift.id}
              available={available}
              allowsCustomAmount={gift.allowsCustomAmount}
              minimumAmountInCents={gift.priceInCents}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
