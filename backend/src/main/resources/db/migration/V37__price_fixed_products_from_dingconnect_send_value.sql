-- V37: Preço dos produtos de valor FIXO a partir do dingconnect_send_value -- o valor exato em
-- EUR que a DingConnect debita da nossa conta ao entregar a recarga (Minimum.SendValue do
-- GetProducts, igual para todos os produtos do mesmo país).
--
-- A V36 tinha precificado estes produtos a partir do valor de face convertido à taxa de mercado
-- (ou à paridade fixa, no caso de XOF/STN). Isso subestimava o custo real: as taxas efetivas da
-- DingConnect são bastante piores do que o mercado --
--   Brasil    ~4,4 BRL/EUR   (mercado ~6,0)
--   Moçambique ~61,6 MZN/EUR (mercado ~74)
--   Guiné      +31% sobre a paridade XOF
--   São Tomé   +34% sobre a paridade STN
-- -- e gerava prejuízo (Guiné 19680 XOF: preço 33,76 €, custo real 39,30 € → -6,05 €).
--
-- Para um SKU de valor fixo, o SendValue enviado TEM de ser exatamente o da DingConnect, e é
-- esse valor que é debitado. Logo, usá-lo como base de custo garante a margem:
--   preço = ROUND( (dingconnect_send_value + 3.00 margem + 0.25 buffer) / (1 - 0.015 taxa Stripe) )
--
-- Os produtos "range" (todos em EUR) não são tocados -- mantêm o preço da V35, calculado a
-- partir do `amount` (que, para esses, é o valor entregue e debitado).

UPDATE airtime_products
SET payer_amount_cents = ROUND((dingconnect_send_value + 3.00 + 0.25) / 0.985 * 100)::int
WHERE NOT dingconnect_send_value_range
  AND dingconnect_send_value IS NOT NULL
  AND lower(dingconnect_send_currency) = 'eur';
