# GameL0 — Portfólio Pessoal

API REST e landing page do portfólio pessoal de Arthur Melo. O projeto permite que visitantes enviem mensagens de contato e exibe os projetos do desenvolvedor, com todas as informações persistidas em banco de dados PostgreSQL.

---

## 🗂️ Estrutura do Projeto

```
GameL0/
├── frontend/          # Landing page estática (HTML, CSS, JS, Tailwind)
├── backend/           # API REST em Express com Prisma e PostgreSQL
│   ├── config/        # Configuração do banco de dados (Prisma Client)
│   ├── controllers/   # Controladores das rotas
│   ├── routes/        # Definição dos endpoints
│   ├── services/      # Regras de negócio
│   ├── repositories/  # Acesso ao banco de dados
│   └── prisma/        # Schema e migrations do banco
├── docker-compose.yml # Configuração do PostgreSQL via Docker
└── README.md
```

---

## 🗄️ Entidades do Banco de Dados

### Message
Armazena as mensagens enviadas pelo formulário de contato.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int | Chave primária, auto-incremento |
| `name` | String | Nome de quem enviou |
| `email` | String | E-mail de quem enviou |
| `message` | String | Conteúdo da mensagem |
| `read` | Boolean | Se a mensagem foi lida (padrão: false) |
| `createdAt` | DateTime | Data de criação (automática) |

### Project
Armazena os projetos do portfólio.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int | Chave primária, auto-incremento |
| `name` | String | Nome do projeto |
| `description` | String | Descrição do projeto |
| `link` | String? | Link do projeto (opcional) |
| `imageUrl` | String? | URL da imagem (opcional) |
| `order` | Int | Ordem de exibição (padrão: 0) |
| `createdAt` | DateTime | Data de criação (automática) |
| `technologies` | Technology[] | Tecnologias usadas (relação) |

### Technology
Armazena as tecnologias que podem ser vinculadas aos projetos.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int | Chave primária, auto-incremento |
| `name` | String | Nome da tecnologia (único) |
| `iconUrl` | String? | URL do ícone (opcional) |
| `projects` | Project[] | Projetos que usam essa tecnologia |

> **Relacionamento:** `Project` ↔ `Technology` é **muitos para muitos** — um projeto pode ter várias tecnologias e uma tecnologia pode pertencer a vários projetos.

---

## 🚀 Endpoints Principais

### Mensagens — `/messages`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `POST` | `/messages` | Cria nova mensagem | `{ name, email, message }` |
| `GET` | `/messages` | Lista todas as mensagens | — |
| `PATCH` | `/messages/:id` | Marca mensagem como lida | — |
| `DELETE` | `/messages/:id` | Deleta uma mensagem | — |

### Projetos — `/projects`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `POST` | `/projects` | Cria novo projeto | `{ name, description, link?, imageUrl?, order?, technologies? }` |
| `GET` | `/projects` | Lista todos os projetos com tecnologias | — |
| `GET` | `/projects/:id` | Busca projeto por ID | — |
| `PUT` | `/projects/:id` | Atualiza um projeto | `{ name, description, link?, imageUrl?, order?, technologies? }` |
| `DELETE` | `/projects/:id` | Deleta um projeto | — |

### Tecnologias — `/technologies`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `POST` | `/technologies` | Cria nova tecnologia | `{ name, iconUrl? }` |
| `GET` | `/technologies` | Lista todas as tecnologias | — |

### Utilitários

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se o servidor está rodando |
| `GET` | `/version` | Retorna a versão da API |

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` com as seguintes variáveis:

```env
PORT=3000
POSTGRES_URL=postgres://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO
DATABASE_URL=postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta onde o servidor Express vai rodar |
| `POSTGRES_URL` | URL de conexão com o PostgreSQL (usada internamente) |
| `DATABASE_URL` | URL de conexão usada pelo Prisma |

> ⚠️ O arquivo `.env` não é versionado. Nunca suba suas credenciais para o GitHub.

---

## 🐳 Como rodar localmente

### Requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- [DBeaver](https://dbeaver.io/) (opcional — para visualizar o banco)

### Passo 1 — Clone o repositório

```bash
git clone https://github.com/GameL0/GameL0.github.io.git
cd GameL0
```

### Passo 2 — Suba o banco de dados com Docker

```bash
docker compose up -d
```

### Passo 3 — Configure as variáveis de ambiente

Dentro da pasta `backend/`, crie o arquivo `.env`:

```env
PORT=3000
POSTGRES_URL=postgres://gamelo_user:gamelo_pass@localhost:5432/portfolio_db
DATABASE_URL=postgresql://gamelo_user:gamelo_pass@localhost:5432/portfolio_db
```

### Passo 4 — Instale as dependências do backend

```bash
cd backend
npm install
```

### Passo 5 — Rode as migrations do banco

```bash
npx prisma migrate dev
```

### Passo 6 — Inicie o servidor

```bash
node app.js
```

O servidor estará rodando em `http://localhost:3000`.

### Passo 7 — Acesse o frontend

Abra o arquivo `frontend/src/pages/index.html` no navegador ou use o Live Server do VS Code.

---

## 🛠️ Tecnologias utilizadas

### Backend
- [Node.js](https://nodejs.org/)
- [Express 5](https://expressjs.com/)
- [Prisma 7](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Zod](https://zod.dev/) — validação de dados
- [dotenv](https://www.npmjs.com/package/dotenv) — variáveis de ambiente
- [cors](https://www.npmjs.com/package/cors)

### Frontend
- HTML5, CSS3, JavaScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

## 👨‍💻 Autor

**Arthur Melo Gusmão**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arthur-melo-gusm%C3%A3o-9a5977248/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/GameL0)
