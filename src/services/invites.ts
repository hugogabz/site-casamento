import "server-only";

import { prisma } from "@/lib/prisma";
import { INVITE_STATUS } from "@/types/invite";

export async function expireOldReservations() {
  await prisma.inviteReservation.updateMany({
    where: { status: INVITE_STATUS.PENDING, expiresAt: { lte: new Date() } },
    data: { status: INVITE_STATUS.EXPIRED },
  });
}

export async function getInviteSettings() {
  return prisma.weddingSettings.upsert({
    where: { id: "wedding" },
    update: {},
    create: { id: "wedding" },
  });
}

export async function getInviteAvailability() {
  await expireOldReservations();
  const [settings, reserved] = await Promise.all([
    getInviteSettings(),
    prisma.inviteReservation.aggregate({
      where: { status: { in: [INVITE_STATUS.PENDING, INVITE_STATUS.PAID] } },
      _sum: { quantity: true },
    }),
  ]);

  return {
    settings,
    available: Math.max(settings.totalInvites - (reserved._sum.quantity ?? 0), 0),
  };
}

export async function getAdminInviteReservations() {
  await expireOldReservations();
  return prisma.inviteReservation.findMany({
    include: { guests: { orderBy: [{ isBuyer: "desc" }, { name: "asc" }] } },
    orderBy: { createdAt: "desc" },
  });
}
