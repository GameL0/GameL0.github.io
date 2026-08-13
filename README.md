# GameL0 — Portfólio Pessoal

Portfólio pessoal full stack de **Arthur Melo Gusmão**. O projeto conta com uma landing page moderna construída com Vite + Tailwind CSS, um painel administrativo protegido por senha, e uma API REST em Express com autenticação JWT, persistência em PostgreSQL (AWS RDS) via Prisma e deploy automatizado via GitHub Actions + GitHub Pages.

🔗 **Live:** [gamel0.github.io](https://gamel0.github.io)

---

## 🗂️ Estrutura do Projeto

```
GameL0/
├── frontend/                          # Landing page + painel admin (Vite + Tailwind CSS 4)
│   ├── src/
│   │   ├── assets/
│   │   │   └── img/                   # Fotos de perfil, logo SVG, screenshots
│   │   ├── components/
│   │   │   ├── menu-mobile.js         # Toggle do menu responsivo
│   │   │   └── typewriter.js          # Efeito de digitação no hero
│   │   ├── css/
│   │   │   └── style.css              # Importa Tailwind CSS + source paths
│   │   ├── pages/
│   │   │   ├── index.html             # Página principal do portfólio
│   │   │   └── admin.html             # Painel administrativo (mensagens)
│   │   └── utils/
│   │       ├── forms.js               # Envio do formulário de contato
│   │       └── admin.js               # Lógica do painel admin (login, CRUD de mensagens)
│   ├── dist/                          # Build de produção (gerado pelo Vite)
│   ├── nginx.conf                     # Config do Nginx para Docker (SPA fallback)
│   ├── Dockerfile                     # Multi-stage build (Node → Nginx)
│   ├── vite.config.js                 # Vite config (multi-page: index + admin)
│   └── package.json
│
├── backend/                           # API REST (Express 5 + Prisma 7 + PostgreSQL)
│   ├── config/
│   │   ├── env.js                     # Carrega .env via dotenv (suporte a ENV_FILE)
│   │   ├── prisma.js                  # Prisma Client com adapter pg + SSL (AWS RDS)
│   │   └── authMiddleware.js          # Middleware JWT (requireAdmin)
│   ├── controllers/
│   │   ├── messageController.js       # Controller de mensagens (validação com Zod)
│   │   └── projectController.js       # Controller de projetos e tecnologias (validação com Zod)
│   ├── services/
│   │   ├── messageService.js          # Regras de negócio de mensagens
│   │   └── projectService.js          # Regras de negócio de projetos e tecnologias
│   ├── repositories/
│   │   ├── messageRepository.js       # Acesso ao banco — mensagens
│   │   └── projectRepository.js       # Acesso ao banco — projetos e tecnologias
│   ├── routes/
│   │   ├── authRouter.js              # POST /auth/login (bcrypt + JWT)
│   │   ├── messageRouter.js           # CRUD de mensagens (rotas protegidas)
│   │   ├── projectRouter.js           # CRUD de projetos
│   │   └── technologyRouter.js        # GET/POST de tecnologias
│   ├── prisma/
│   │   ├── schema.prisma              # Schema do banco (Message, Project, Technology)
│   │   └── migrations/                # Migrations do Prisma
│   ├── generated/                     # Prisma Client gerado
│   ├── prisma.config.ts               # Config do Prisma (datasource dinâmico + SSL)
│   ├── server.js                      # Entry point da API (CORS configurado)
│   ├── setup-db.js                    # Script de setup inicial do banco (tabelas + IAM)
│   ├── generate-hash.js               # Utilitário para gerar hash bcrypt
│   ├── Dockerfile                     # Build da API com healthcheck
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 # CI/CD — Build do frontend e deploy no GitHub Pages
│
├── docker-compose.yml                 # Orquestra API + PostgreSQL (dev local)
└── README.md
```

---

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas:

```
Request → Router → Controller → Service → Repository → Prisma → PostgreSQL
```

| Camada | Responsabilidade |
|---|---|
| **Router** | Define endpoints e aplica middlewares (ex: `requireAdmin`) |
| **Controller** | Valida input com Zod e delega para o Service |
| **Service** | Contém regras de negócio e validações |
| **Repository** | Acessa o banco de dados via Prisma Client |

O frontend é composto por **duas páginas** servidas via Vite:
- **`index.html`** — Landing page pública com seções: Hero, Sobre Mim, Skills, Projetos, Experiências e Contato
- **`admin.html`** — Painel administrativo protegido por senha para gerenciar mensagens recebidas

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
| `read` | Boolean | Se a mensagem foi lida (padrão: `false`) |
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
| `order` | Int | Ordem de exibição (padrão: `0`) |
| `createdAt` | DateTime | Data de criação (automática) |
| `technologies` | Technology[] | Tecnologias usadas (relação M:N) |

### Technology
Armazena as tecnologias que podem ser vinculadas aos projetos.

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | Int | Chave primária, auto-incremento |
| `name` | String | Nome da tecnologia (único) |
| `iconUrl` | String? | URL do ícone (opcional) |
| `projects` | Project[] | Projetos que usam essa tecnologia |

> **Relacionamento:** `Project` ↔ `Technology` é **muitos para muitos** (tabela implícita `_ProjectToTechnology` gerenciada pelo Prisma).

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** para proteger rotas administrativas.

| Etapa | Descrição |
|---|---|
| **Login** | `POST /auth/login` com `{ password }` → retorna `{ token }` |
| **Validação** | A senha é comparada com o hash bcrypt armazenado em `ADMIN_PASSWORD_HASH` |
| **Token** | JWT assinado com `JWT_SECRET_KEY`, válido por **8 horas** |
| **Middleware** | Rotas protegidas exigem header `Authorization: Bearer <token>` |

### Rotas protegidas vs públicas

| Rota | Pública | Protegida |
|---|---|---|
| `POST /auth/login` | ✅ | — |
| `POST /messages` | ✅ | — |
| `GET /messages` | — | ✅ |
| `PATCH /messages/:id` | — | ✅ |
| `DELETE /messages/:id` | — | ✅ |
| `GET /projects` | ✅ | — |
| `GET /projects/:id` | ✅ | — |
| `POST /projects` | ✅ | — |
| `PUT /projects/:id` | ✅ | — |
| `DELETE /projects/:id` | ✅ | — |
| `GET /technologies` | ✅ | — |
| `POST /technologies` | ✅ | — |

---

## 🚀 Endpoints da API

### Autenticação — `/auth`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `POST` | `/auth/login` | Realiza login e retorna JWT | `{ password }` |

### Mensagens — `/messages`

| Método | Endpoint | Descrição | Auth | Body |
|---|---|---|---|---|
| `POST` | `/messages` | Cria nova mensagem | Não | `{ name, email, message }` |
| `GET` | `/messages` | Lista todas as mensagens | Sim | — |
| `PATCH` | `/messages/:id` | Marca mensagem como lida | Sim | — |
| `DELETE` | `/messages/:id` | Deleta uma mensagem | Sim | — |

### Projetos — `/projects`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `POST` | `/projects` | Cria novo projeto | `{ name, description, link?, imageUrl?, order?, technologies? }` |
| `GET` | `/projects` | Lista todos os projetos com tecnologias | — |
| `GET` | `/projects/:id` | Busca projeto por ID | — |
| `PUT` | `/projects/:id` | Atualiza um projeto | `{ name, description, link?, imageUrl?, order?, technologies? }` |
| `DELETE` | `/projects/:id` | Deleta um projeto | — |

> **Nota:** O campo `technologies` no body de projetos espera um array de **IDs numéricos** (ex: `[1, 3, 5]`).

### Tecnologias — `/technologies`

| Método | Endpoint | Descrição | Body |
|---|---|---|---|
| `GET` | `/technologies` | Lista todas as tecnologias | — |
| `POST` | `/technologies` | Cria nova tecnologia | `{ name, iconUrl? }` |

### Utilitários

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica se o servidor está rodando |
| `GET` | `/version` | Retorna a versão da API (`1.0.0`) |

---

## ⚙️ Variáveis de Ambiente

### Backend (`backend/.env` ou `backend/.env.local`)

```env
PORT=3000
DATABASE_HOSTNAME=localhost
DATABASE_NAME=portfolio_db
DATABASE_PORT=5432
DATABASE_USERNAME=gamelo_user
DATABASE_PASSWORD=sua_senha_aqui
JWT_SECRET_KEY=sua_chave_jwt_aqui
ADMIN_PASSWORD_HASH=$2b$10$...hash_bcrypt...
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `PORT` | Não | Porta do servidor Express (padrão: `3000`) |
| `DATABASE_HOSTNAME` | Sim | Host do PostgreSQL |
| `DATABASE_NAME` | Sim | Nome do banco de dados |
| `DATABASE_PORT` | Sim | Porta do PostgreSQL |
| `DATABASE_USERNAME` | Sim | Usuário do banco |
| `DATABASE_PASSWORD` | Sim | Senha do banco |
| `JWT_SECRET_KEY` | Sim | Chave secreta para assinar tokens JWT |
| `ADMIN_PASSWORD_HASH` | Sim | Hash bcrypt da senha do admin |
| `ENV_FILE` | Não | Caminho do `.env` a carregar (padrão: `.env`) |

> **Dica:** Use `ENV_FILE=.env.local` para desenvolvimento local (ex: `cross-env ENV_FILE=.env.local node app.js`).

### Frontend (`frontend/.env.production`)

```env
VITE_API_URL=https://sua-api.exemplo.com
```

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL base da API em produção (fallback: `http://localhost:3000`) |

> ⚠️ Os arquivos `.env` e `.env.local` não são versionados. Nunca suba suas credenciais para o GitHub.

---

## 🐳 Como rodar localmente

### Requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando

### Passo 1 — Clone o repositório

```bash
git clone https://github.com/GameL0/GameL0.github.io.git
cd GameL0
```

### Passo 2 — Suba o banco de dados com Docker

```bash
docker compose up db -d
```

### Passo 3 — Configure as variáveis de ambiente

Dentro da pasta `backend/`, crie o arquivo `.env.local`:

```env
PORT=3000
DATABASE_HOSTNAME=localhost
DATABASE_NAME=portfolio_db
DATABASE_PORT=5432
DATABASE_USERNAME=gamelo_user
DATABASE_PASSWORD=SUA_SENHA
JWT_SECRET_KEY=uma_chave_secreta_qualquer
ADMIN_PASSWORD_HASH=<hash_gerado>
```

Para gerar o hash da senha do admin:

```bash
cd backend
npm install
node generate-hash.js
```

Copie o hash gerado e cole no campo `ADMIN_PASSWORD_HASH` do `.env.local`.

### Passo 4 — Gere o Prisma Client e rode as migrations

```bash
cd backend
npm run db:generate
npm run db:migrate:local
```

### Passo 5 — Inicie o servidor backend

```bash
npm run start:local
```

O servidor estará rodando em `http://localhost:3000`.

### Passo 6 — Inicie o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O Vite abrirá automaticamente o navegador em `http://localhost:5173`.

---

## 🐳 Docker Compose

O `docker-compose.yml` orquestra a API e o banco de dados:

```bash
docker compose up --build -d
```

| Serviço | Descrição | Porta |
|---|---|---|
| `api` | API Express (build do `backend/Dockerfile`) | `3000` |
| `db` | PostgreSQL 16 | `5432` |

O Dockerfile do backend inclui **healthcheck** automático via endpoint `/health`.

---

## 🔄 CI/CD

O workflow do GitHub Actions (`.github/workflows/deploy.yml`):

1. É acionado em **push na branch `main`** ou **manualmente** (`workflow_dispatch`)
2. Instala dependências e builda o frontend com Vite (injetando `VITE_API_URL`)
3. Faz deploy do conteúdo de `frontend/dist/` no **GitHub Pages**

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime JavaScript |
| [Express 5](https://expressjs.com/) | Framework HTTP |
| [Prisma 7](https://www.prisma.io/) + `@prisma/adapter-pg` | ORM com driver nativo pg |
| [PostgreSQL 16](https://www.postgresql.org/) | Banco de dados relacional |
| [Zod 4](https://zod.dev/) | Validação de dados |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | Autenticação JWT |
| [bcrypt](https://www.npmjs.com/package/bcrypt) | Hash de senhas |
| [dotenv](https://www.npmjs.com/package/dotenv) | Variáveis de ambiente |
| [cors](https://www.npmjs.com/package/cors) | Cross-Origin Resource Sharing |
| [pg](https://www.npmjs.com/package/pg) | Driver PostgreSQL nativo |

### Frontend
| Tecnologia | Uso |
|---|---|
| HTML5 + JavaScript (ES Modules) | Estrutura e lógica |
| [Tailwind CSS 4](https://tailwindcss.com/) | Framework CSS utility-first |
| [Vite 8](https://vitejs.dev/) | Bundler e dev server |
| [Nginx](https://nginx.org/) | Servidor web em produção (Docker) |

### DevOps
| Tecnologia | Uso |
|---|---|
| [Docker](https://www.docker.com/) | Containerização (backend + frontend) |
| [Docker Compose](https://docs.docker.com/compose/) | Orquestração de containers |
| [GitHub Actions](https://docs.github.com/en/actions) | CI/CD |
| [GitHub Pages](https://pages.github.com/) | Hospedagem do frontend |
| [AWS RDS](https://aws.amazon.com/rds/) | PostgreSQL gerenciado em produção |

---

## 👨‍💻 Autor

**Arthur Melo Gusmão**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/arthur-melo-gusm%C3%A3o-9a5977248/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/GameL0)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=flat&logo=instagram&logoColor=white)](https://www.instagram.com/artthurgusmao/)
