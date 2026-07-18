import "server-only";

import { prisma } from "@/lib/prisma";

export async function getAdminOrders() {
  return prisma.giftOrder.findMany({
    include: { gift: true },
    orderBy: { createdAt: "desc" },
  });
}
