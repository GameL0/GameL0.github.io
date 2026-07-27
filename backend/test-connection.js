import pg from "pg";
import fs from "fs";
import path from "path";

// Aceita o token IAM como argumento do terminal
const token = process.argv[2];

if (!token) {
  console.error("Uso: node test-connection.js SEU_TOKEN_IAM");
  process.exit(1);
}

const client = new pg.Client({
  host: "portfolio-db.c6boeoi4onzb.us-east-1.rds.amazonaws.com",
  port: 5432,
  user: "gamelo_user",
  password: token,
  database: "portfolio_db",
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  console.log("1. Conectado ao banco!");

  // Lê e executa o migration.sql da pasta do Prisma
  const migrationPath = path.join("prisma", "migrations", "20260704234416_init", "migration.sql");
  const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

  await client.query(migrationSQL);
  console.log("2. Tabelas criadas! (migration.sql executado)");

  // Registra a migration na tabela do Prisma
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
  console.log("3. Migration registrada no Prisma!");

  // Verifica as tabelas criadas
  const tables = await client.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' ORDER BY table_name
  `);
  console.log("\nTabelas no banco:");
  tables.rows.forEach((r) => console.log("  -", r.table_name));

  console.log("\n--- TUDO PRONTO! ---");
} catch (err) {
  console.error("ERRO:", err.message);
} finally {
  await client.end();
}
