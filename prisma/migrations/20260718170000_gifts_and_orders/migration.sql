-- CreateTable
CREATE TABLE "Gift" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "priceInCents" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "giftedQuantity" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GiftOrder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "giftId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPriceInCents" INTEGER NOT NULL,
  "totalInCents" INTEGER NOT NULL,
  "guestName" TEXT,
  "guestEmail" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "paymentProvider" TEXT,
  "paymentReference" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "GiftOrder_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftOrder_paymentReference_key" ON "GiftOrder"("paymentReference");
CREATE INDEX "GiftOrder_giftId_idx" ON "GiftOrder"("giftId");
CREATE INDEX "GiftOrder_status_idx" ON "GiftOrder"("status");
