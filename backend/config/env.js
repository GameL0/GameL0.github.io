import dotenv from "dotenv"

// Em desenvolvimento local, rode com:
//   ENV_FILE=.env.local npm start
// No ECS/produção, as variáveis já estão no ambiente — usa .env por padrão

dotenv.config({ path: process.env.ENV_FILE ?? ".env" });