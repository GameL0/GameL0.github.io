import pg from "pg";

const client = new pg.Client({
  host: "portfolio-db.c6boeoi4onzb.us-east-1.rds.amazonaws.com",
  port: 5432,
  user: "gamelo_user",
  password: process.argv[2], // passa a senha como argumento
  database: "portfolio_db",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("Conectado ao banco!");

  // 1. Grant IAM auth
  await client.query("GRANT rds_iam TO gamelo_user");
  console.log("GRANT rds_iam OK!");

  // 2. Criar tabelas (migration)
  await client.query(`
    CREATE TABLE IF NOT EXISTS "Message" (
      "id" SERIAL NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "read" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "Project" (
      "id" SERIAL NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "link" TEXT,
      "imageUrl" TEXT,
      "order" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "Technology" (
      "id" SERIAL NOT NULL,
      "name" TEXT NOT NULL,
      "iconUrl" TEXT,
      CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "_ProjectToTechnology" (
      "A" INTEGER NOT NULL,
      "B" INTEGER NOT NULL,
      CONSTRAINT "_ProjectToTechnology_AB_pkey" PRIMARY KEY ("A","B")
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "Technology_name_key" ON "Technology"("name");
    CREATE INDEX IF NOT EXISTS "_ProjectToTechnology_B_index" ON "_ProjectToTechnology"("B");

    ALTER TABLE "_ProjectToTechnology" DROP CONSTRAINT IF EXISTS "_ProjectToTechnology_A_fkey";
    ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_A_fkey" 
      FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    ALTER TABLE "_ProjectToTechnology" DROP CONSTRAINT IF EXISTS "_ProjectToTechnology_B_fkey";
    ALTER TABLE "_ProjectToTechnology" ADD CONSTRAINT "_ProjectToTechnology_B_fkey" 
      FOREIGN KEY ("B") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  `);
  console.log("Tabelas criadas!");

  // 3. Registrar migration no Prisma
  await client.query(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" VARCHAR(36) NOT NULL PRIMARY KEY,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMPTZ,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMPTZ,
      "started_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    );
    INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
    VALUES (gen_random_uuid(), 'manual', '20260704234416_init', NOW(), 1)
    ON CONFLICT DO NOTHING;
  `);
  console.log("Migration registrada!");

  console.log("\n--- TUDO PRONTO! ---");
} catch (err) {
  console.error("Erro:", err.message);
} finally {
  await client.end();
}
