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

    if (!order.gift.allowsCustomAmount) {
      const available = order.gift.quantity - order.gift.giftedQuantity;
      if (order.quantity > available) throw new Error("Estoque insuficiente.");

      await transaction.gift.update({
        where: { id: order.giftId },
        data: { giftedQuantity: { increment: order.quantity } },
      });
    }
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
