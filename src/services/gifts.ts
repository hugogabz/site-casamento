import "server-only";

import { prisma } from "@/lib/prisma";
import { getGiftStatus, type Gift } from "@/types/gift";

function serializeGift(gift: {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceInCents: number;
  quantity: number;
  giftedQuantity: number;
  allowsCustomAmount: boolean;
}): Gift {
  return {
    ...gift,
    status: gift.allowsCustomAmount
      ? "AVAILABLE"
      : getGiftStatus(gift.quantity, gift.giftedQuantity),
  };
}

export async function getPublicGifts() {
  const gifts = await prisma.gift.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  return gifts.map(serializeGift);
}

export async function getAdminGifts() {
  return prisma.gift.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
  });
}

export async function getGiftById(id: string) {
  return prisma.gift.findUnique({ where: { id } });
}
