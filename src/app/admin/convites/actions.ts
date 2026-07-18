"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export type InviteSettingsState = { error?: string; success?: boolean };

export async function updateInviteSettings(
  _state: InviteSettingsState,
  formData: FormData,
): Promise<InviteSettingsState> {
  await requireAdmin();

  const price = Number(String(formData.get("price") ?? "").replace(",", "."));
  const totalInvites = Number(formData.get("totalInvites"));
  const reservationMinutes = Number(formData.get("reservationMinutes"));
  if (!Number.isFinite(price) || price <= 0) return { error: "Informe um valor válido." };
  if (!Number.isInteger(totalInvites) || totalInvites < 1) return { error: "Informe o estoque total." };
  if (!Number.isInteger(reservationMinutes) || reservationMinutes < 5 || reservationMinutes > 60) {
    return { error: "O prazo deve ficar entre 5 e 60 minutos." };
  }

  const confirmed = await prisma.inviteReservation.aggregate({
    where: { status: "PAID" },
    _sum: { quantity: true },
  });
  if (totalInvites < (confirmed._sum.quantity ?? 0)) {
    return { error: "O estoque não pode ser menor que os convites já confirmados." };
  }

  await prisma.weddingSettings.upsert({
    where: { id: "wedding" },
    update: {
      invitePriceInCents: Math.round(price * 100),
      totalInvites,
      reservationMinutes,
      inviteSalesEnabled: formData.get("inviteSalesEnabled") === "on",
    },
    create: {
      id: "wedding",
      invitePriceInCents: Math.round(price * 100),
      totalInvites,
      reservationMinutes,
      inviteSalesEnabled: formData.get("inviteSalesEnabled") === "on",
    },
  });
  revalidatePath("/admin/convites");
  revalidatePath("/convites");
  return { success: true };
}
