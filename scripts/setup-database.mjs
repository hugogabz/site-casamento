import { createHash, randomUUID } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import Database from "better-sqlite3";

process.loadEnvFile?.(".env");

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const databasePath = databaseUrl.replace(/^file:/, "");
const database = new Database(databasePath);

database.pragma("foreign_keys = ON");
database.exec(`
  CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "checksum" TEXT NOT NULL,
    "finished_at" DATETIME,
    "migration_name" TEXT NOT NULL,
    "logs" TEXT,
    "rolled_back_at" DATETIME,
    "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applied_steps_count" INTEGER NOT NULL DEFAULT 0
  );
`);

const migrationsDirectory = resolve("prisma", "migrations");
const migrationNames = readdirSync(migrationsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const migrationName of migrationNames) {
  const appliedMigration = database
    .prepare(
      'SELECT "id" FROM "_prisma_migrations" WHERE "migration_name" = ?',
    )
    .get(migrationName);

  if (appliedMigration) continue;

  const migrationPath = resolve(
    migrationsDirectory,
    migrationName,
    "migration.sql",
  );
  const migrationSql = readFileSync(migrationPath, "utf8");

  database.transaction(() => {
    database.exec(migrationSql);
    database
      .prepare(
        `INSERT INTO "_prisma_migrations"
          ("id", "checksum", "finished_at", "migration_name", "applied_steps_count")
         VALUES (?, ?, CURRENT_TIMESTAMP, ?, 1)`,
      )
      .run(
        randomUUID(),
        createHash("sha256").update(migrationSql).digest("hex"),
        migrationName,
      );
  })();
}

const giftCount = database.prepare('SELECT COUNT(*) AS "count" FROM "Gift"').get();

if (giftCount.count === 0) {
  const insertGift = database.prepare(`
    INSERT INTO "Gift"
      ("id", "name", "description", "imageUrl", "priceInCents", "quantity", "giftedQuantity", "isActive", "updatedAt")
    VALUES
      (@id, @name, @description, @imageUrl, @priceInCents, @quantity, @giftedQuantity, 1, CURRENT_TIMESTAMP)
  `);

  database.transaction((gifts) => {
    for (const gift of gifts) insertGift.run(gift);
  })([
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
  ]);
}

database.close();
console.log("Banco SQLite preparado com sucesso.");
