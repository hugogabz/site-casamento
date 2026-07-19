import { Mail, Phone, UserRound, UsersRound } from "lucide-react";

import { getAdminInviteReservations } from "@/services/invites";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function AdminInvitesPage() {
  const confirmations = (await getAdminInviteReservations()).filter((item) =>
    ["CONFIRMED", "PAID"].includes(item.status),
  );
  const confirmedPeople = confirmations.reduce((total, item) => total + item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7e7868]">Entrada da festa</p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">Lista de convidados confirmados</h1>
      <p className="mt-2 text-sm text-[#665a52]">Consulte o titular e os acompanhantes informados na confirmação de presença.</p>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm">
          <UserRound className="size-5 text-[#596653]" />
          <p className="mt-3 text-sm text-[#7e7868]">Confirmações recebidas</p>
          <p className="mt-1 text-2xl font-semibold">{confirmations.length}</p>
        </div>
        <div className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm">
          <UsersRound className="size-5 text-[#596653]" />
          <p className="mt-3 text-sm text-[#7e7868]">Pessoas confirmadas</p>
          <p className="mt-1 text-2xl font-semibold">{confirmedPeople}</p>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {confirmations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#cbbcb0] bg-white/40 p-10 text-center">
            <UsersRound className="mx-auto size-9 text-[#596653]" />
            <h2 className="mt-4 font-serif text-2xl">Nenhuma presença confirmada</h2>
            <p className="mt-2 text-sm text-[#665a52]">As confirmações aparecerão aqui automaticamente.</p>
          </div>
        ) : confirmations.map((confirmation) => (
          <article key={confirmation.id} className="rounded-3xl border border-white/80 bg-white/65 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-xl">{confirmation.buyerName}</h2>
                  <span className="rounded-full bg-[#9faf94]/25 px-3 py-1 text-xs font-semibold text-[#596653]">Confirmado</span>
                </div>
                <p className="mt-2 text-sm text-[#7e7868]">Confirmado em {dateFormatter.format(confirmation.createdAt)}</p>
              </div>
              <p className="text-sm font-medium text-[#596653]">{confirmation.quantity} pessoa(s)</p>
            </div>

            <div className="mt-5 grid gap-3 border-t border-[#ded2c8] pt-5 text-sm text-[#665a52] sm:grid-cols-2">
              <p className="flex items-center gap-2"><Mail className="size-4 text-[#596653]" /> {confirmation.buyerEmail}</p>
              {confirmation.buyerPhone ? <p className="flex items-center gap-2"><Phone className="size-4 text-[#596653]" /> {confirmation.buyerPhone}</p> : null}
            </div>

            <div className="mt-5 rounded-2xl bg-white/55 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e7868]">Nomes para a entrada</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {confirmation.guests.map((guest) => (
                  <li key={guest.id} className="flex items-center gap-2 text-sm text-[#44362f]"><UserRound className="size-4 text-[#9f6d65]" /> {guest.name}{guest.isBuyer ? " (titular)" : ""}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
