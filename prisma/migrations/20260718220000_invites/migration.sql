CREATE TABLE "WeddingSettings" (
  "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'wedding',
  "invitePriceInCents" INTEGER NOT NULL DEFAULT 0,
  "totalInvites" INTEGER NOT NULL DEFAULT 0,
  "reservationMinutes" INTEGER NOT NULL DEFAULT 15,
  "inviteSalesEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "InviteReservation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "buyerName" TEXT NOT NULL,
  "buyerEmail" TEXT NOT NULL,
  "buyerPhone" TEXT,
  "quantity" INTEGER NOT NULL,
  "unitPriceInCents" INTEGER NOT NULL,
  "totalInCents" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "expiresAt" DATETIME NOT NULL,
  "paymentProvider" TEXT,
  "paymentReference" TEXT,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "InviteGuest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "reservationId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "isBuyer" BOOLEAN NOT NULL DEFAULT false,
  "checkedInAt" DATETIME,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InviteGuest_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "InviteReservation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "InviteReservation_paymentReference_key" ON "InviteReservation"("paymentReference");
CREATE INDEX "InviteReservation_status_idx" ON "InviteReservation"("status");
CREATE INDEX "InviteReservation_expiresAt_idx" ON "InviteReservation"("expiresAt");
CREATE INDEX "InviteGuest_reservationId_idx" ON "InviteGuest"("reservationId");
CREATE INDEX "InviteGuest_name_idx" ON "InviteGuest"("name");

INSERT INTO "WeddingSettings" ("id", "updatedAt") VALUES ('wedding', CURRENT_TIMESTAMP);
