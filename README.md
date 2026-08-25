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
- **Base de dados**: PostgreSQL (Neon em produção; Docker local em desenvolvimento)

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

Duas opções, à escolha:

```bash
docker compose up -d
```

ou, se já tiver um PostgreSQL local instalado (qualquer versão recente), basta criar a role e a
base de dados usadas por omissão pela aplicação:

```sql
CREATE ROLE lusotop LOGIN PASSWORD 'lusotop';
CREATE DATABASE lusotop OWNER lusotop;
```

### 2. Backend (requer Java 21; o Maven Wrapper já está incluído)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. As migrations Flyway aplicam-se automaticamente e semeiam
os 9 países da CPLP (Angola como único `ACTIVE`, com operadoras e valores demo). Por omissão liga-se
a `localhost:5432` com utilizador/password `lusotop` (ver `backend/src/main/resources/application.yml`
e `.env.example` para apontar para a Neon em produção).

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

## Configuração da base de dados Neon (produção)

Defina as variáveis de ambiente (nunca no código):

```
DATABASE_URL=jdbc:postgresql://<host>/<db>?sslmode=require
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
```

## Modo DEMO

Apenas Angola está marcado como `ACTIVE` nesta fase, com operadoras (Unitel, Movicel) e valores de
recarga claramente identificados como dados de demonstração — não correspondem a uma tabela real de
nenhum fornecedor. Os restantes 8 países aparecem como "Em breve" até haver integração real.

## Documentação

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura, modelo ER, endpoints
