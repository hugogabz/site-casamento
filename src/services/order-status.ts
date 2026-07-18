import "server-only";

import { prisma } from "@/lib/prisma";
import { ORDER_STATUS } from "@/types/order";

export async function confirmPaidOrder(orderId: string, paymentReference: string) {
  await prisma.$transaction(async (transaction) => {
    const order = await transaction.giftOrder.findUnique({
      where: { id: orderId },
      include: { gift: true },
    });
    if (!order) throw new Error("Pedido não encontrado.");
    if (order.status === ORDER_STATUS.PAID) return;
    if (order.status !== ORDER_STATUS.PENDING) throw new Error("Pedido não está pendente.");

    const available = order.gift.quantity - order.gift.giftedQuantity;
    if (order.quantity > available) throw new Error("Estoque insuficiente.");

    await transaction.gift.update({
      where: { id: order.giftId },
      data: { giftedQuantity: { increment: order.quantity } },
    });
    await transaction.giftOrder.update({
      where: { id: order.id },
      data: {
        status: ORDER_STATUS.PAID,
        paymentProvider: "INFINITE_PAY",
        paymentReference,
      },
    });
  });
}

export async function confirmPaidInvite(reservationId: string, paymentReference: string) {
  await prisma.$transaction(async (transaction) => {
    const reservation = await transaction.inviteReservation.findUnique({ where: { id: reservationId } });
    if (!reservation) throw new Error("Reserva não encontrada.");
    if (reservation.status === ORDER_STATUS.PAID) return;
    if (reservation.status !== ORDER_STATUS.PENDING && reservation.status !== "EXPIRED") {
      throw new Error("Reserva não pode ser confirmada.");
    }

    const settings = await transaction.weddingSettings.findUniqueOrThrow({ where: { id: "wedding" } });
    const confirmed = await transaction.inviteReservation.aggregate({
      where: { status: ORDER_STATUS.PAID },
      _sum: { quantity: true },
    });
    if ((confirmed._sum.quantity ?? 0) + reservation.quantity > settings.totalInvites) {
      throw new Error("Não há convites suficientes para confirmar este pagamento.");
    }

    await transaction.inviteReservation.update({
      where: { id: reservation.id },
      data: { status: ORDER_STATUS.PAID, paymentProvider: "INFINITE_PAY", paymentReference },
    });
  });
}
