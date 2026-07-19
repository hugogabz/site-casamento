import "server-only";

import { prisma } from "@/lib/prisma";

export async function getAdminInviteReservations() {
  return prisma.inviteReservation.findMany({
    include: { guests: { orderBy: [{ isBuyer: "desc" }, { name: "asc" }] } },
    orderBy: { createdAt: "desc" },
  });
}
