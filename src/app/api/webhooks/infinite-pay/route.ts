import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { checkInfinitePayPayment } from "@/services/infinite-pay";
import { confirmPaidOrder } from "@/services/order-status";

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

    const order = await prisma.giftOrder.findUnique({ where: { id: payload.order_nsu } });
    if (!order) throw new Error("Pedido não encontrado.");

    const payment = await checkInfinitePayPayment({
      orderId: order.id,
      transactionNsu: payload.transaction_nsu,
      invoiceSlug: payload.invoice_slug,
    });
    if (!payment.success || !payment.paid || payment.amount !== order.totalInCents) {
      throw new Error("Pagamento não confirmado.");
    }

    await confirmPaidOrder(order.id, payload.transaction_nsu);
    revalidatePath("/");
    revalidatePath("/presentes");
    revalidatePath("/admin/presentes");
    revalidatePath("/admin/pedidos");
    return NextResponse.json({ success: true, message: null });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Erro interno." },
      { status: 400 },
    );
  }
}
