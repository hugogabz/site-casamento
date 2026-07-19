"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type InviteCheckoutState = { error?: string; success?: boolean };

function text(formData: FormData, name: string, label: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`Preencha ${label}.`);
  return value;
}

export async function createInviteReservation(
  _state: InviteCheckoutState,
  formData: FormData,
): Promise<InviteCheckoutState> {
  try {
    const buyerName = text(formData, "buyerName", "seu nome");
    const buyerEmail = text(formData, "buyerEmail", "o e-mail").toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(buyerEmail)) throw new Error("Informe um e-mail válido.");
    const buyerPhone = String(formData.get("buyerPhone") ?? "").trim() || null;
    const quantity = Number(formData.get("quantity"));
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Escolha entre 1 e 10 convites.");

    const guestNames = Array.from({ length: quantity - 1 }, (_, index) =>
      text(formData, `guestName${index}`, `o nome do acompanhante ${index + 1}`),
    );
    const normalizedNames = [buyerName, ...guestNames].map((name) => name.toLocaleLowerCase("pt-BR"));
    if (new Set(normalizedNames).size !== normalizedNames.length) throw new Error("Cada convite precisa ter um nome diferente.");

    await prisma.$transaction(async (transaction) => {
      const existingConfirmation = await transaction.inviteReservation.findFirst({
        where: { buyerEmail, status: { in: ["CONFIRMED", "PAID"] } },
      });
      if (existingConfirmation) {
        throw new Error("Este e-mail já possui uma presença confirmada.");
      }

      await transaction.inviteReservation.create({
        data: {
          buyerName,
          buyerEmail,
          buyerPhone,
          quantity,
          unitPriceInCents: 0,
          totalInCents: 0,
          status: "CONFIRMED",
          expiresAt: new Date("2999-12-31T23:59:59.000Z"),
          guests: {
            create: [
              { name: buyerName, isBuyer: true },
              ...guestNames.map((name) => ({ name })),
            ],
          },
        },
      });
    });
    revalidatePath("/admin/convites");
    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível confirmar sua presença." };
  }
}
