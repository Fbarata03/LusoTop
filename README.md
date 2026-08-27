# LusoTop

Recargas simples. Onde o português conecta.

Plataforma de recargas móveis internacionais para 7 países da CPLP com cobertura real de operadora
(Angola, Brasil, Cabo Verde, Guiné-Bissau, Moçambique, Portugal, São Tomé e Príncipe).

> **Estado atual: pagamentos e recargas reais em produção.**
> O checkout usa a Stripe (Checkout Sessions + webhook assinado) e, após confirmação do
> pagamento, a recarga é enviada de imediato através da API SendTransfer da DingConnect. Se a
> entrega falhar depois do pagamento confirmado, o valor é reembolsado automaticamente pela
> Stripe ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

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
os 7 países da CPLP com cobertura real de operadora, cada um com os produtos de airtime da
DingConnect já ligados por SKU.

Para pagamentos e recargas reais, defina também:

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=https://<domínio>/recarga/sucesso?session_id={CHECKOUT_SESSION_ID}
STRIPE_CANCEL_URL=https://<domínio>/recarga/cancelada
DINGCONNECT_API_KEY=...
```

Sem estas variáveis a criação da sessão de checkout falha (`STRIPE_ERROR`) e a entrega da recarga
falha (sem `DINGCONNECT_API_KEY`), mas o resto da aplicação continua a funcionar.

A DingConnect exige que os pedidos em modo Live venham de um IP fixo autorizado por eles
(confirmado pelo suporte deles por email — não aceitam autenticação só por API key). Se o
backend não tiver IP de saída fixo (ex: Render sem add-on de IP dedicado, que só está disponível
em planos caros), define `DINGCONNECT_PROXY_URL=http://user:pass@host:porta` para encaminhar as
chamadas através de um proxy HTTP num servidor com IP fixo, e autoriza esse IP na DingConnect.

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

## Pagamentos e recargas

Fluxo completo: o cliente escolhe país/operadora/número/valor, paga via Stripe Checkout, o
webhook `checkout.session.completed` confirma o pagamento (assinatura validada com
`STRIPE_WEBHOOK_SECRET`) e o backend envia a recarga através do `SendTransfer` da DingConnect na
mesma transação. A linha do pedido fica bloqueada (`PESSIMISTIC_WRITE`) durante essa confirmação
para impedir que o webhook e o polling do frontend disparem duas entregas para o mesmo pagamento.
Se a entrega falhar, o pedido fica `FAILED` e o pagamento é reembolsado automaticamente.

## Autenticação

Registo/login com passwords em hash BCrypt e JWT real (`POST /api/auth/register`,
`POST /api/auth/login`, `GET /api/auth/me`), sem depender de nenhum fornecedor externo. Defina
`JWT_SECRET` em produção (o valor por omissão em `application.yml` serve apenas para
desenvolvimento local). Atualmente não é obrigatório ter sessão iniciada para pedir e pagar uma
recarga.

## Documentação

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arquitetura, modelo ER, endpoints

## Licença

Software proprietário. Todos os direitos reservados — ver [LICENSE](LICENSE).
