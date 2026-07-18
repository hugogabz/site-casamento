import { Clock3, TicketCheck, UsersRound } from "lucide-react";

import { InviteSettingsForm } from "@/components/admin/invite-settings-form";
import { getAdminInviteReservations, getInviteAvailability, getInviteSettings } from "@/services/invites";
import { INVITE_STATUS } from "@/types/invite";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" });

const statusLabel: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Confirmado",
  EXPIRED: "Expirado",
  CANCELED: "Cancelado",
  REFUNDED: "Reembolsado",
};

export default async function AdminInvitesPage() {
  const [settings, availability, reservations] = await Promise.all([
    getInviteSettings(), getInviteAvailability(), getAdminInviteReservations(),
  ]);
  const confirmed = reservations.filter((item) => item.status === INVITE_STATUS.PAID);
  const confirmedPeople = confirmed.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7e7868]">Entrada da festa</p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Convites e lista de convidados</h1>
      <p className="mt-2 text-sm text-[#665a52]">Configure as vendas e consulte os nomes confirmados para a recepção.</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          [TicketCheck, "Convites confirmados", confirmedPeople],
          [UsersRound, "Disponíveis", availability.available],
          [Clock3, "Reservas pendentes", reservations.filter((item) => item.status === INVITE_STATUS.PENDING).length],
        ].map(([Icon, label, value]) => {
          const IconComponent = Icon as typeof TicketCheck;
          return <div key={String(label)} className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm"><IconComponent className="size-5 text-[#596653]" /><p className="mt-3 text-sm text-[#7e7868]">{String(label)}</p><p className="mt-1 text-2xl font-semibold">{String(value)}</p></div>;
        })}
      </section>

      <section className="mt-8 rounded-3xl border border-white/80 bg-white/65 p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl">Configurações dos convites</h2>
        <p className="mt-2 mb-6 text-sm text-[#665a52]">O prazo bloqueia temporariamente o estoque durante o pagamento.</p>
        <InviteSettingsForm settings={settings} />
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-4"><div><h2 className="font-serif text-2xl">Lista para conferência</h2><p className="mt-1 text-sm text-[#665a52]">Somente os confirmados poderão entrar na lista oficial.</p></div><p className="text-sm font-medium text-[#596653]">{currency.format(settings.invitePriceInCents / 100)} por pessoa</p></div>
        <div className="mt-5 space-y-4">
          {reservations.length === 0 ? <div className="rounded-3xl border border-dashed border-[#cbbcb0] p-10 text-center text-sm text-[#665a52]">Nenhuma reserva registrada.</div> : reservations.map((reservation) => (
            <article key={reservation.id} className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-serif text-xl">{reservation.buyerName}</h3><p className="mt-1 text-sm text-[#7e7868]">{reservation.buyerEmail} · {reservation.quantity} convite(s) · {date.format(reservation.createdAt)}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${reservation.status === INVITE_STATUS.PAID ? "bg-[#9faf94]/25 text-[#596653]" : "bg-[#d7b9a3]/25 text-[#76564f]"}`}>{statusLabel[reservation.status] ?? reservation.status}</span></div>
              <div className="mt-5 border-t border-[#ded2c8] pt-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e7868]">Nomes vinculados</p><ul className="mt-3 grid gap-2 sm:grid-cols-2">{reservation.guests.map((guest) => <li key={guest.id} className="rounded-xl bg-white/55 px-3 py-2 text-sm">{guest.name}{guest.isBuyer ? " (comprador)" : ""}</li>)}</ul></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
