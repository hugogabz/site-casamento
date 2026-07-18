"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export type CheckoutState = {
  error?: string;
};

function requiredText(formData: FormData, field: string, label: string) {
  const value = String(formData.get(field) ?? "").trim();
  if (!value) throw new Error(`Preencha ${label}.`);
  return value;
}

export async function createGiftOrder(
  giftId: string,
  _previousState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  try {
    const guestName = requiredText(formData, "guestName", "seu nome");
    const guestEmail = requiredText(formData, "guestEmail", "seu e-mail");
    if (!/^\S+@\S+\.\S+$/.test(guestEmail)) {
      throw new Error("Informe um e-mail válido.");
    }

    const quantity = Number(formData.get("quantity"));
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Escolha uma quantidade válida.");
    }

    const gift = await prisma.gift.findUnique({ where: { id: giftId } });
    if (!gift || !gift.isActive) throw new Error("Este presente não está mais disponível.");

    const available = gift.quantity - gift.giftedQuantity;
    if (quantity > available) {
      throw new Error(`Restam apenas ${available} unidade(s) deste presente.`);
    }

    const order = await prisma.giftOrder.create({
      data: {
        giftId,
        quantity,
        unitPriceInCents: gift.priceInCents,
        totalInCents: gift.priceInCents * quantity,
        guestName,
        guestEmail,
        guestMessage: String(formData.get("guestMessage") ?? "").trim() || null,
      },
    });

    redirect(`/presente-confirmado/${order.id}`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return {
      error: error instanceof Error ? error.message : "Não foi possível registrar o presente.",
    };
  }
}
