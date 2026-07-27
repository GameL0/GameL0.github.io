import "./env.js";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js"

const hostname = process.env.DATABASE_HOSTNAME;
const dbName   = process.env.DATABASE_NAME;
const port     = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;

if(!hostname || !dbName || !port || !username || !password){
    throw new Error(
        "Variáveis de ambiente ausentes. Verifique: " +
    "DATABASE_HOSTNAME, DATABASE_NAME, DATABASE_PORT, DATABASE_USERNAME, DATABASE_PASSWORD"
    );
}

const connectionString =
    `postgresql://${username}:${encodeURIComponent(password)}@${hostname}:${port}/${dbName}`;

// Criamos o pool configurando o SSL para aceitar o certificado em nuvem da AWS RDS
const pool = new pg.Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });