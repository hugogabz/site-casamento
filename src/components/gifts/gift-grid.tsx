import { GiftCard } from "@/components/gifts/gift-card";
import type { Gift } from "@/types/gift";

type GiftGridProps = {
  gifts: Gift[];
};

export function GiftGrid({ gifts }: GiftGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {gifts.map((gift, index) => (
        <GiftCard key={gift.id} gift={gift} index={index} />
      ))}
    </div>
  );
}
