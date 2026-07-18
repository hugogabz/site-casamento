import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkInfinitePayPayment } from "@/services/infinite-pay";
import { confirmPaidInvite, confirmPaidOrder } from "@/services/order-status";

type InfinitePayWebhook = {
  invoice_slug?: string;
  amount?: number;
  transaction_nsu?: string;
  order_nsu?: string;
};

export async function POST(request: Request) {
  try {
    const payload = await request.json() as InfinitePayWebhook;
    if (!payload.order_nsu || !payload.transaction_nsu || !payload.invoice_slug) {
      throw new Error("Notificação incompleta.");
    }

    const [order, invite] = await Promise.all([
      prisma.giftOrder.findUnique({ where: { id: payload.order_nsu } }),
      prisma.inviteReservation.findUnique({ where: { id: payload.order_nsu } }),
    ]);
    const transaction = order ?? invite;
    if (!transaction) throw new Error("Pedido não encontrado.");

    const payment = await checkInfinitePayPayment({
      orderId: transaction.id,
      transactionNsu: payload.transaction_nsu,
      invoiceSlug: payload.invoice_slug,
    });
    if (!payment.success || !payment.paid || payment.amount !== transaction.totalInCents) {
      throw new Error("Pagamento não confirmado.");
    }

    if (order) await confirmPaidOrder(order.id, payload.transaction_nsu);
    else await confirmPaidInvite(transaction.id, payload.transaction_nsu);
    return NextResponse.json({ success: true, message: null });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Erro interno." },
      { status: 400 },
    );
  }
}
