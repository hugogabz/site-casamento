CREATE TABLE "Gift" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "priceInCents" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "giftedQuantity" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GiftOrder" (
  "id" TEXT NOT NULL,
  "giftId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPriceInCents" INTEGER NOT NULL,
  "totalInCents" INTEGER NOT NULL,
  "guestName" TEXT,
  "guestEmail" TEXT,
  "guestMessage" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "paymentProvider" TEXT,
  "paymentReference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GiftOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WeddingSettings" (
  "id" TEXT NOT NULL DEFAULT 'wedding',
  "invitePriceInCents" INTEGER NOT NULL DEFAULT 0,
  "totalInvites" INTEGER NOT NULL DEFAULT 0,
  "reservationMinutes" INTEGER NOT NULL DEFAULT 15,
  "inviteSalesEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WeddingSettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InviteReservation" (
  "id" TEXT NOT NULL,
  "buyerName" TEXT NOT NULL,
  "buyerEmail" TEXT NOT NULL,
  "buyerPhone" TEXT,
  "quantity" INTEGER NOT NULL,
  "unitPriceInCents" INTEGER NOT NULL,
  "totalInCents" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "paymentProvider" TEXT,
  "paymentReference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InviteReservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InviteGuest" (
  "id" TEXT NOT NULL,
  "reservationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isBuyer" BOOLEAN NOT NULL DEFAULT false,
  "checkedInAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InviteGuest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "GiftOrder_paymentReference_key" ON "GiftOrder"("paymentReference");
CREATE INDEX "GiftOrder_giftId_idx" ON "GiftOrder"("giftId");
CREATE INDEX "GiftOrder_status_idx" ON "GiftOrder"("status");
CREATE UNIQUE INDEX "InviteReservation_paymentReference_key" ON "InviteReservation"("paymentReference");
CREATE INDEX "InviteReservation_status_idx" ON "InviteReservation"("status");
CREATE INDEX "InviteReservation_expiresAt_idx" ON "InviteReservation"("expiresAt");
CREATE INDEX "InviteGuest_reservationId_idx" ON "InviteGuest"("reservationId");
CREATE INDEX "InviteGuest_name_idx" ON "InviteGuest"("name");

ALTER TABLE "GiftOrder"
  ADD CONSTRAINT "GiftOrder_giftId_fkey"
  FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InviteGuest"
  ADD CONSTRAINT "InviteGuest_reservationId_fkey"
  FOREIGN KEY ("reservationId") REFERENCES "InviteReservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "WeddingSettings" ("id", "updatedAt")
VALUES ('wedding', CURRENT_TIMESTAMP);

INSERT INTO "Gift"
  ("id", "name", "description", "imageUrl", "priceInCents", "quantity", "giftedQuantity", "isActive", "updatedAt")
VALUES
  ('jantar-romantico', 'Jantar romântico', 'Uma noite especial para os noivos celebrarem o início dessa nova fase.', '/gifts/romantic-dinner.svg', 28000, 4, 1, true, CURRENT_TIMESTAMP),
  ('passeio-lua-de-mel', 'Passeio na lua de mel', 'Uma experiência inesquecível para guardar entre as melhores memórias da viagem.', '/gifts/honeymoon-trip.svg', 45000, 3, 1, true, CURRENT_TIMESTAMP),
  ('cafe-da-manha', 'Café da manhã especial', 'Um começo de dia tranquilo, com carinho, sabores especiais e uma linda vista.', '/gifts/breakfast.svg', 18000, 2, 2, true, CURRENT_TIMESTAMP);
