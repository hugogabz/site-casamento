import { Check, Heart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default async function GiftConfirmationPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await prisma.giftOrder.findUnique({ where: { id: orderId }, include: { gift: true } });
  if (!order) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f2ea] px-5 py-12 text-[#44362f]">
      <section className="w-full max-w-xl rounded-[2rem] border border-white/80 bg-white/65 p-7 text-center shadow-xl shadow-[#6f5745]/10 backdrop-blur sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#9faf94]/25 text-[#596653]">
          <Check className="size-8" />
        </span>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.26em] text-[#7e7868]">Escolha registrada</p>
        <h1 className="mt-3 font-serif text-4xl">Obrigado, {order.guestName?.split(" ")[0]}!</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#665a52]">
          Registramos sua escolha de <strong>{order.quantity}x {order.gift.name}</strong>, no total de <strong>{currencyFormatter.format(order.totalInCents / 100)}</strong>.
        </p>
        <div className="mt-7 rounded-2xl bg-[#d7b9a3]/15 p-4 text-sm leading-6 text-[#76564f]">
          {order.status === "PAID"
            ? "Pagamento confirmado! O presente já foi reservado para os noivos."
            : "Estamos aguardando a confirmação do pagamento pela InfinitePay."}
        </div>
        <Heart className="mx-auto mt-8 size-6 fill-[#9f6d65] text-[#9f6d65]" />
        <Link href="/presentes" className="mt-6 inline-flex h-11 items-center rounded-full border border-[#596653]/30 px-6 text-sm font-medium text-[#596653] hover:bg-white">
          Voltar para a lista
        </Link>
      </section>
    </main>
  );
}
