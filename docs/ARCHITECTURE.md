# Arquitetura — FASE 1

## Visão geral

```
Next.js (frontend)  →  Spring Boot REST API (backend)  →  Neon PostgreSQL
                                     │
                                     ├─→ Payment Provider (mock nesta fase)
                                     └─→ Airtime Provider (mock nesta fase)
```

O frontend nunca chama fornecedores externos (pagamento, airtime) diretamente — tudo passa pelo backend.

## Camadas do backend

```
Controller → Service → Repository → Entity → Neon PostgreSQL
```

Pacotes (`com.lusotop.api`):
- `config` — CORS e segurança (apenas GETs públicos liberados nesta fase).
- `common` — tratamento de erros padronizado (`ApiError`, `GlobalExceptionHandler`, `NotFoundException`).
- `country` — `Country`, `CountryStatus`, `CountryRepository`, `CountryService`, `CountryController`.
- `operator` — `Operator`, `OperatorRepository`, `OperatorService`, `OperatorController`.
- `product` — `AirtimeProduct`, `AirtimeProductRepository`, `AirtimeProductService`, `AirtimeProductController`.

## Modelo ER (FASE 1)

```
countries (id PK, name, iso_code UNIQUE, phone_code, currency_code, currency_symbol,
           flag_emoji, active, status[ACTIVE|COMING_SOON|DISABLED], created_at, updated_at)
    │ 1───N
operators (id PK, country_id FK, name, code, logo_url, active, provider_code,
           min_amount, max_amount, created_at, updated_at)
    │ 1───N
airtime_products (id PK, operator_id FK, amount, currency, type, active, created_at, updated_at)
```

Migrations Flyway em `backend/src/main/resources/db/migration`. Schema nunca é criado via `ddl-auto`
(sempre `validate` em qualquer ambiente) — apenas via migrations versionadas.

## Dados seed (DEMO)

Os 9 países da CPLP são inseridos por migration (V4) e entram todos como `ACTIVE` (V9), cada um com
1-2 operadoras demo — nomes de marcas reais de cada mercado, mas com `provider_code` prefixado
`DEMO_` (V7) — e produtos demo em moeda local (V8). Isto permite que o wizard de recarga funcione
ponta-a-ponta para qualquer um dos 9 países. **Nenhum destes dados vem de um fornecedor real de
airtime ou pagamento** (ver secção 18/35 da especificação: nunca inventar preços/suporte real sem
integração — por isso este seed é claramente rotulado como simulação em toda a interface, e nenhuma
recarga ou pagamento reais chegam a ser processados). Quando fornecedores reais forem integrados por
país (FASE 12), este seed é substituído/complementado via administração.

## Endpoints (FASE 1)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/countries` | Lista os 9 países, com status |
| GET | `/api/countries/{isoCode}` | Detalhe de um país |
| GET | `/api/countries/{isoCode}/operators` | Operadoras ativas do país (vazio se `COMING_SOON`) |
| GET | `/api/operators/{id}/products` | Valores de recarga disponíveis para a operadora |

## Configuração de base de dados

- **Local/dev**: Postgres via `docker-compose.yml` na raiz do repo (`docker compose up -d`).
- **Produção**: Neon PostgreSQL, apontado via `DATABASE_URL`/`DATABASE_USERNAME`/`DATABASE_PASSWORD`
  (nunca hardcoded — ver `.env.example`). Trocar de local para Neon é só variável de ambiente, sem
  alterar código.

## Fora de escopo nesta fase

Autenticação (JWT/users/roles), dashboard de utilizador, admin, pagamento real, providers reais de
airtime/pagamento, webhooks, i18n, páginas SEO por país, testes automatizados, deploy. Essas são
fases posteriores da especificação (FASE 5 em diante).
