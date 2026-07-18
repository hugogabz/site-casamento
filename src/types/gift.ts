export type GiftStatus = "AVAILABLE" | "SOLD_OUT";

export type Gift = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceInCents: number;
  quantity: number;
  giftedQuantity: number;
  status: GiftStatus;
};

export function getGiftStatus(
  quantity: number,
  giftedQuantity: number,
): GiftStatus {
  return giftedQuantity >= quantity ? "SOLD_OUT" : "AVAILABLE";
}

export function getAvailableQuantity(gift: Gift) {
  return Math.max(gift.quantity - gift.giftedQuantity, 0);
}
