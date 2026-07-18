import { Mail, MessageCircle, PackageOpen, UserRound } from "lucide-react";
import { Toaster } from "sonner";

import { OrderActions } from "@/components/admin/order-actions";
import { getAdminOrders } from "@/services/orders";
import { ORDER_STATUS } from "@/types/order";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" });

const statusConfig: Record<string, { label: string; className: string }> = {
  [ORDER_STATUS.PENDING]: { label: "Pendente", className: "bg-[#d7b9a3]/25 text-[#76564f]" },
  [ORDER_STATUS.PAID]: { label: "Pago", className: "bg-[#9faf94]/25 text-[#596653]" },
  [ORDER_STATUS.CANCELED]: { label: "Cancelado", className: "bg-zinc-200 text-zinc-600" },
  [ORDER_STATUS.REFUNDED]: { label: "Reembolsado", className: "bg-[#e4d8ce] text-[#665a52]" },
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  const pendingCount = orders.filter((order) => order.status === ORDER_STATUS.PENDING).length;
  const paidTotal = orders
    .filter((order) => order.status === ORDER_STATUS.PAID)
    .reduce((total, order) => total + order.totalInCents, 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7e7868]">Acompanhamento</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Pedidos de presentes</h1>
        <p className="mt-2 text-sm leading-6 text-[#665a52]">Confira as escolhas dos convidados e confirme pagamentos manualmente.</p>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Pedidos recebidos", orders.length],
          ["Aguardando confirmação", pendingCount],
          ["Total confirmado", currencyFormatter.format(paidTotal / 100)],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm">
            <p className="text-sm text-[#7e7868]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#44362f]">{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#cbbcb0] bg-white/40 p-10 text-center">
            <PackageOpen className="mx-auto size-9 text-[#596653]" />
            <h2 className="mt-4 font-serif text-2xl">Nenhum pedido recebido</h2>
            <p className="mt-2 text-sm text-[#665a52]">As escolhas dos convidados aparecerão aqui.</p>
          </div>
        ) : (
          orders.map((order) => {
            const status = statusConfig[order.status] ?? statusConfig[ORDER_STATUS.PENDING];
            return (
              <article key={order.id} className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm sm:p-6">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-serif text-xl">{order.quantity}x {order.gift.name}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                    </div>
                    <p className="mt-2 text-sm text-[#7e7868]">{dateFormatter.format(order.createdAt)} · {currencyFormatter.format(order.totalInCents / 100)}</p>
                  </div>
                  <OrderActions orderId={order.id} status={order.status} />
                </div>
                <div className="mt-5 grid gap-3 border-t border-[#ded2c8] pt-5 text-sm text-[#665a52] sm:grid-cols-2">
                  <p className="flex items-center gap-2"><UserRound className="size-4 text-[#596653]" /> {order.guestName}</p>
                  <p className="flex items-center gap-2"><Mail className="size-4 text-[#596653]" /> {order.guestEmail}</p>
                  {order.guestMessage ? (
                    <p className="flex items-start gap-2 sm:col-span-2"><MessageCircle className="mt-0.5 size-4 shrink-0 text-[#9f6d65]" /> “{order.guestMessage}”</p>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </section>
      <Toaster richColors position="top-center" />
    </main>
  );
}
