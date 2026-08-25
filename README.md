# LusoTop

Recargas simples. Onde o português conecta.

Plataforma de recargas móveis internacionais para os 9 Estados-Membros da CPLP (Angola, Brasil,
Cabo Verde, Guiné-Bissau, Guiné Equatorial, Moçambique, Portugal, São Tomé e Príncipe, Timor-Leste).

> **Estado atual: FASE 1 (arquitetura) + homepage com fluxo de recarga em modo DEMO.**
> Verificado ponta-a-ponta (backend + frontend + Postgres real, sem erros de consola). Não há
> integração real com fornecedores de pagamento ou airtime ainda — ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Spring Boot 3, Java 21, Spring Data JPA, Flyway
- **Base de dados**: Neon PostgreSQL (projeto `LusoTop`, região `eu-west-2`)

## Estrutura

```
LusoTop/
├── backend/        # API REST (Spring Boot)
├── frontend/        # Aplicação web (Next.js)
├── docker-compose.yml   # Postgres local para desenvolvimento
├── docs/            # Documentação de arquitetura
└── .env.example
```

## Como correr localmente

### 1. Base de dados

A base de dados oficial é a Neon PostgreSQL (projeto `LusoTop`, `gentle-cherry-31889823`). Defina
as variáveis de ambiente (nunca no código -- `backend/.env` está no `.gitignore`):

```
DATABASE_URL=jdbc:postgresql://<host>/<db>?sslmode=require
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
```

A connection string está disponível na Neon Console (Dashboard → Connect) ou via
`npx neon@latest connection-string --project-id gentle-cherry-31889823`.

Alternativa para desenvolvimento totalmente offline (sem conta Neon): `docker compose up -d` sobe
um Postgres local, ou reaproveite um Postgres já instalado criando a role/base:

```sql
CREATE ROLE lusotop LOGIN PASSWORD 'lusotop';
CREATE DATABASE lusotop OWNER lusotop;
```

Nesse caso `DATABASE_URL` aponta para `jdbc:postgresql://localhost:5432/lusotop` (é o valor por
omissão em `application.yml` quando não há variáveis de ambiente definidas).

### 2. Backend (requer Java 21; o Maven Wrapper já está incluído)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. As migrations Flyway aplicam-se automaticamente e semeiam
os 9 países da CPLP, todos `ACTIVE`, cada um com operadoras e valores de recarga demo.

Verificação rápida:

```bash
curl http://localhost:8080/api/countries
curl http://localhost:8080/api/countries/AO/operators
```

### 3. Frontend (requer Node 18+)

```bash
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:3000`. Por padrão aponta para `NEXT_PUBLIC_API_URL=http://localhost:8080`
(ver `frontend/.env.local.example`).

## Modo DEMO

Todos os 9 países da CPLP estão `ACTIVE` e têm operadoras com planos de Saldo, Dados móveis e Voz
simulados — claramente identificados como dados de demonstração e não correspondem a uma tabela
real de nenhum fornecedor. O wizard de recarga funciona ponta-a-ponta para qualquer país, mas
nenhum pagamento ou recarga reais são processados até existir integração com um fornecedor real
(fases futuras).

## Autenticação

Ao contrário da recarga, o registo/login **não é demo** — passwords com hash BCrypt, JWT real
(`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`), sem depender de nenhum
fornecedor externo. Defina `JWT_SECRET` em produção (o valor por omissão em `application.yml`
serve apenas para desenvolvimento local).

## Documentação

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura, modelo ER, endpoints
