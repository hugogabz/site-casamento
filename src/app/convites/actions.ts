"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createInfinitePayLink } from "@/services/infinite-pay";
import { INVITE_STATUS } from "@/types/invite";

export type InviteCheckoutState = { error?: string };

function text(formData: FormData, name: string, label: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`Preencha ${label}.`);
  return value;
}

export async function createInviteReservation(
  _state: InviteCheckoutState,
  formData: FormData,
): Promise<InviteCheckoutState> {
  let reservationId: string | undefined;
  try {
    const buyerName = text(formData, "buyerName", "o nome do comprador");
    const buyerEmail = text(formData, "buyerEmail", "o e-mail");
    if (!/^\S+@\S+\.\S+$/.test(buyerEmail)) throw new Error("Informe um e-mail válido.");
    const buyerPhone = String(formData.get("buyerPhone") ?? "").trim() || null;
    const quantity = Number(formData.get("quantity"));
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Escolha entre 1 e 10 convites.");

    const guestNames = Array.from({ length: quantity - 1 }, (_, index) =>
      text(formData, `guestName${index}`, `o nome do acompanhante ${index + 1}`),
    );
    const normalizedNames = [buyerName, ...guestNames].map((name) => name.toLocaleLowerCase("pt-BR"));
    if (new Set(normalizedNames).size !== normalizedNames.length) throw new Error("Cada convite precisa ter um nome diferente.");

    const { reservation, settings } = await prisma.$transaction(async (transaction) => {
      await transaction.inviteReservation.updateMany({
        where: { status: INVITE_STATUS.PENDING, expiresAt: { lte: new Date() } },
        data: { status: INVITE_STATUS.EXPIRED },
      });
      const [currentSettings, reserved] = await Promise.all([
        transaction.weddingSettings.findUniqueOrThrow({ where: { id: "wedding" } }),
        transaction.inviteReservation.aggregate({
          where: { status: { in: [INVITE_STATUS.PENDING, INVITE_STATUS.PAID] } },
          _sum: { quantity: true },
        }),
      ]);
      if (!currentSettings.inviteSalesEnabled) throw new Error("A venda de convites ainda não foi liberada.");
      const available = Math.max(currentSettings.totalInvites - (reserved._sum.quantity ?? 0), 0);
      if (quantity > available) throw new Error(`Restam apenas ${available} convite(s).`);

      const createdReservation = await transaction.inviteReservation.create({
        data: {
          buyerName,
          buyerEmail,
          buyerPhone,
          quantity,
          unitPriceInCents: currentSettings.invitePriceInCents,
          totalInCents: currentSettings.invitePriceInCents * quantity,
          status: INVITE_STATUS.PENDING,
          expiresAt: new Date(Date.now() + currentSettings.reservationMinutes * 60_000),
          guests: {
            create: [
              { name: buyerName, isBuyer: true },
              ...guestNames.map((name) => ({ name })),
            ],
          },
        },
      });
      return { reservation: createdReservation, settings: currentSettings };
    });
    reservationId = reservation.id;

    const checkout = await createInfinitePayLink({
      orderId: reservation.id,
      description: `Convite de casamento (${quantity} pessoa${quantity > 1 ? "s" : ""})`,
      quantity,
      priceInCents: settings.invitePriceInCents,
      customerName: buyerName,
      customerEmail: buyerEmail,
      returnPath: `/convite-confirmado/${reservation.id}`,
    });
    await prisma.inviteReservation.update({
      where: { id: reservation.id },
      data: { paymentProvider: "INFINITE_PAY" },
    });
    redirect(checkout.url);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    if (reservationId) await prisma.inviteReservation.delete({ where: { id: reservationId } }).catch(() => undefined);
    return { error: error instanceof Error ? error.message : "Não foi possível iniciar a compra." };
  }
}
