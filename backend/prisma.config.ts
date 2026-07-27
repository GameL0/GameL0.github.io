import "./config/env.js";
import { defineConfig } from "prisma/config";

// Durante o docker build, a DATABASE_URL fictícia é passada diretamente.
// Em desenvolvimento local, montamos a URL a partir das variáveis separadas do .env.local.
// ?sslmode=require é necessário porque o RDS exige conexões criptografadas (SSL).
const baseUrl =
  process.env.DATABASE_URL ??
  `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;

// Adiciona SSL se ainda não tiver na URL (RDS exige SSL quando IAM auth está habilitado)
const url = baseUrl.includes("sslmode") ? baseUrl : `${baseUrl}?sslmode=require`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});