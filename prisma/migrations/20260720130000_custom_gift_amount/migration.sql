ALTER TABLE "Gift"
ADD COLUMN "allowsCustomAmount" BOOLEAN NOT NULL DEFAULT false;

INSERT INTO "Gift"
  ("id", "name", "description", "imageUrl", "priceInCents", "quantity", "giftedQuantity", "allowsCustomAmount", "isActive", "createdAt", "updatedAt")
VALUES
  ('contribuicao-lua-de-mel', 'Contribuição para a lua de mel', 'Ajude os noivos a viverem momentos inesquecíveis na lua de mel. Escolha livremente o valor da sua contribuição.', '/gifts/honeymoon-trip.svg', 5000, 1, 0, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
