-- Produtos DEMO (valores de recarga) para as operadoras de Angola.
-- Valores meramente ilustrativos para o modo DEMO; nao correspondem a tabela real de um fornecedor.
INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'AOA', 'AIRTIME', TRUE
FROM operators o
CROSS JOIN (VALUES (500), (1000), (2000), (5000)) AS v(amount)
WHERE o.code IN ('UNITEL_AO', 'MOVICEL_AO');
