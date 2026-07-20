import { Eye, EyeOff, PackageCheck, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { toggleGift } from "@/app/admin/actions";
import { DeleteGiftButton } from "@/components/admin/delete-gift-button";
import { Button } from "@/components/ui/button";
import { getAdminGifts } from "@/services/gifts";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default async function AdminGiftsPage() {
  const gifts = await getAdminGifts();
  const activeGifts = gifts.filter((gift) => gift.isActive).length;
  const availableUnits = gifts.reduce(
    (total, gift) => total + (gift.allowsCustomAmount
      ? 0
      : Math.max(gift.quantity - gift.giftedQuantity, 0)),
    0,
  );

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7e7868]">Organização</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Lista de presentes</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#665a52]">
            Cadastre experiências, ajuste valores e acompanhe a disponibilidade em um só lugar.
          </p>
        </div>
        <Link
          href="/admin/presentes/novo"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#596653] px-5 text-sm font-medium text-white transition hover:bg-[#46513f]"
        >
          <Plus className="size-4" />
          Adicionar presente
        </Link>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Presentes cadastrados", gifts.length],
          ["Visíveis no site", activeGifts],
          ["Unidades disponíveis", availableUnits],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm">
            <p className="text-sm text-[#7e7868]">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-[#44362f]">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 space-y-4">
        {gifts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#cbbcb0] bg-white/40 p-10 text-center">
            <PackageCheck className="mx-auto size-8 text-[#596653]" />
            <h2 className="mt-4 font-serif text-2xl">Nenhum presente cadastrado</h2>
            <p className="mt-2 text-sm text-[#665a52]">Adicione o primeiro presente para iniciar a lista.</p>
          </div>
        ) : (
          gifts.map((gift) => {
            const available = Math.max(gift.quantity - gift.giftedQuantity, 0);
            return (
              <article
                key={gift.id}
                className="grid gap-5 rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-xl">{gift.name}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${gift.isActive ? "bg-[#9faf94]/20 text-[#596653]" : "bg-[#d7b9a3]/25 text-[#76564f]"}`}>
                      {gift.isActive ? "Visível" : "Oculto"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#665a52]">{gift.description}</p>
                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span><strong>{currencyFormatter.format(gift.priceInCents / 100)}</strong></span>
                    <span>
                      {gift.allowsCustomAmount
                        ? "Contribuição livre"
                        : `${available} de ${gift.quantity} disponíveis`}
                    </span>
                    <span>{gift._count.orders} pedido(s)</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <form action={toggleGift}>
                    <input type="hidden" name="id" value={gift.id} />
                    <Button type="submit" size="sm" variant="outline" className="rounded-full">
                      {gift.isActive ? <EyeOff /> : <Eye />}
                      {gift.isActive ? "Ocultar" : "Exibir"}
                    </Button>
                  </form>
                  <Link
                    href={`/admin/presentes/${gift.id}/editar`}
                    className="inline-flex h-7 items-center gap-1 rounded-full border border-[#d8cbc0] bg-white px-2.5 text-[0.8rem] font-medium transition hover:bg-[#f3ece6]"
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Link>
                  <DeleteGiftButton id={gift.id} name={gift.name} />
                </div>
              </article>
            );
          })
        )}
      </section>
    </main>
  );
}
