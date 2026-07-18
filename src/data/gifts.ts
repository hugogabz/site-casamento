import { getGiftStatus, type Gift } from "@/types/gift";

type GiftSeed = Omit<Gift, "status">;

const giftSeeds: GiftSeed[] = [
  {
    id: "jantar-romantico",
    name: "Jantar romântico",
    description:
      "Uma noite especial para os noivos celebrarem o início dessa nova fase.",
    imageUrl: "/gifts/romantic-dinner.svg",
    priceInCents: 28000,
    quantity: 4,
    giftedQuantity: 1,
  },
  {
    id: "passeio-lua-de-mel",
    name: "Passeio na lua de mel",
    description:
      "Uma experiência inesquecível para guardar entre as melhores memórias da viagem.",
    imageUrl: "/gifts/honeymoon-trip.svg",
    priceInCents: 45000,
    quantity: 3,
    giftedQuantity: 1,
  },
  {
    id: "cafe-da-manha",
    name: "Café da manhã especial",
    description:
      "Um começo de dia tranquilo, com carinho, sabores especiais e uma linda vista.",
    imageUrl: "/gifts/breakfast.svg",
    priceInCents: 18000,
    quantity: 2,
    giftedQuantity: 2,
  },
];

export const gifts: Gift[] = giftSeeds.map((gift) => ({
  ...gift,
  status: getGiftStatus(gift.quantity, gift.giftedQuantity),
}));
