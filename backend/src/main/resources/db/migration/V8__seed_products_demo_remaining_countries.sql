-- Produtos DEMO (valores de recarga) para as operadoras dos restantes 8 paises.
-- Valores meramente ilustrativos para o modo DEMO, em numeros redondos por moeda local;
-- nao correspondem a tabela real de nenhum fornecedor.

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'EUR', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (5), (10), (20), (50)) AS v(amount)
WHERE o.code IN ('MEO_PT', 'VODAFONE_PT');

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'BRL', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (10), (20), (50), (100)) AS v(amount)
WHERE o.code IN ('VIVO_BR', 'CLARO_BR');

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'CVE', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (200), (500), (1000), (2000)) AS v(amount)
WHERE o.code = 'CVMOVEL_CV';

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'XOF', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (1000), (2500), (5000), (10000)) AS v(amount)
WHERE o.code IN ('ORANGE_GW', 'MTN_GW');

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'XAF', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (1000), (2500), (5000), (10000)) AS v(amount)
WHERE o.code = 'GETESA_GQ';

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'MZN', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (50), (100), (250), (500)) AS v(amount)
WHERE o.code IN ('VODACOM_MZ', 'MCEL_MZ');

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'STN', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (20), (50), (100), (250)) AS v(amount)
WHERE o.code = 'CST_ST';

INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'USD', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (2), (5), (10), (20)) AS v(amount)
WHERE o.code IN ('TELKOMCEL_TL', 'TELEMOR_TL');
