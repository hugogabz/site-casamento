"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS, type OrderStatus } from "@/types/order";

const allowedStatuses = new Set<OrderStatus>(Object.values(ORDER_STATUS));

export async function updateOrderStatus(orderId: string, nextStatus: OrderStatus) {
  await requireAdmin();

  if (!allowedStatuses.has(nextStatus)) return { error: "Status inválido." };

  try {
    await prisma.$transaction(async (transaction) => {
      const order = await transaction.giftOrder.findUnique({
        where: { id: orderId },
        include: { gift: true },
      });
      if (!order) throw new Error("Pedido não encontrado.");
      if (order.status === nextStatus) return;

      if (nextStatus === ORDER_STATUS.PAID) {
        if (order.status !== ORDER_STATUS.PENDING) {
          throw new Error("Somente pedidos pendentes podem ser confirmados.");
        }
        if (!order.gift.allowsCustomAmount) {
          const available = order.gift.quantity - order.gift.giftedQuantity;
          if (order.quantity > available) {
            throw new Error(`Estoque insuficiente: restam ${available} unidade(s).`);
          }
          await transaction.gift.update({
            where: { id: order.giftId },
            data: { giftedQuantity: { increment: order.quantity } },
          });
        }
      } else if (nextStatus === ORDER_STATUS.CANCELED) {
        if (order.status !== ORDER_STATUS.PENDING) {
          throw new Error("Somente pedidos pendentes podem ser cancelados.");
        }
      } else if (nextStatus === ORDER_STATUS.REFUNDED) {
        if (order.status !== ORDER_STATUS.PAID) {
          throw new Error("Somente pedidos pagos podem ser reembolsados.");
        }
        if (!order.gift.allowsCustomAmount) {
          await transaction.gift.update({
            where: { id: order.giftId },
            data: { giftedQuantity: { decrement: order.quantity } },
          });
        }
      } else {
        throw new Error("Não é possível voltar um pedido para pendente.");
      }

      await transaction.giftOrder.update({
        where: { id: order.id },
        data: { status: nextStatus },
      });
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível atualizar o pedido." };
  }

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/presentes");
  revalidatePath("/");
  revalidatePath("/presentes");
  return { success: true };
}
