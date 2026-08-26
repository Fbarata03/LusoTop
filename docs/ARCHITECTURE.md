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

## Dados seed

Os 9 países da CPLP são inseridos por migration (V4). As operadoras (V13) e os produtos de
saldo/dados/voz (V14) usam nomes, `provider_code` e `logo_url` reais do catálogo da DingConnect
(fornecedor de airtime) para os 7 países com cobertura confirmada — Angola, Brasil, Cabo Verde,
Guiné-Bissau, Moçambique, Portugal e São Tomé e Príncipe. Guiné Equatorial e Timor-Leste não têm
nenhuma operadora de telecom na DingConnect (apenas um produto genérico de recarga internacional),
por isso ficam `COMING_SOON` (V13) em vez de anunciar operadoras sem fornecedor. Os valores dos
produtos continuam ilustrativos — **nenhum pagamento ou recarga reais são processados ainda**
(ver secção 18/35 da especificação: nunca inventar preços/suporte real sem integração; a interface
comunica isto como "pré-lançamento"). Quando o pagamento real entrar em produção (FASE 12), passa a
usar a API da DingConnect para preços e entrega em vez destes valores fixos.

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
