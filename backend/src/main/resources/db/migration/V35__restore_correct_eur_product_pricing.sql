-- V35: Repõe os preços corretos de TODOS os produtos em EUR.
--
-- Bug: a V33 (e parcialmente V32/V34) reescreveu por cima dos preços corretos que já existiam
-- na V26. Para produtos com currency='EUR' (Portugal inteiro, mais parte de Cabo Verde, Guiné e
-- Moçambique), a V33 tratou o `amount` -- que para estes produtos É o valor a entregar, em EUR --
-- como se fosse moeda estrangeira a converter, e aplicou um "custo" inventado (ex: 5,25 € para
-- uma recarga de 20 €). Resultado real observado: Vodafone PT 20 € a ser vendida por 8,63 €.
--
-- Correção (idêntica à fórmula da V26, que estava certa):
--   preço = ROUND( (amount + 3.00 margem + 0.25 buffer) / (1 - 0.015 taxa Stripe) )
--
-- Para produtos em EUR, o `amount` é exatamente o SendValue enviado à DingConnect, por isso
-- usá-lo como base de custo nunca subestima a margem.

UPDATE airtime_products
SET payer_amount_cents = ROUND((amount + 3.00 + 0.25) / 0.985 * 100)::int
WHERE currency = 'EUR';

-- Garante que os produtos de valor fixo em EUR (ex: Lycamobile) enviam o SendValue certo à
-- DingConnect. Para os produtos "range" este campo é ignorado pela entrega (passa a usar o
-- `amount`), mas mantém-se coerente.
UPDATE airtime_products
SET dingconnect_send_value = amount,
    dingconnect_send_currency = 'EUR'
WHERE currency = 'EUR';
