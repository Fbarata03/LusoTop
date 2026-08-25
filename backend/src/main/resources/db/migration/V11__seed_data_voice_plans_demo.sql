-- Planos DEMO de Dados moveis e Voz para todas as operadoras dos 9 paises.
-- Tal como os valores de saldo (V6/V8), sao valores ilustrativos para o modo
-- DEMO -- nao correspondem a tabela real de nenhum fornecedor.

-- Angola (AOA)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'AOA', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (500,'500 MB'), (1000,'1 GB'), (2000,'3 GB'), (4000,'6 GB')) AS v(amount, label)
WHERE o.code IN ('UNITEL_AO', 'MOVICEL_AO');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'AOA', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (500,'60 min'), (1000,'150 min'), (2000,'400 min'), (4000,'1000 min')) AS v(amount, label)
WHERE o.code IN ('UNITEL_AO', 'MOVICEL_AO');

-- Portugal (EUR)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'EUR', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (5,'1 GB'), (10,'3 GB'), (20,'10 GB'), (50,'30 GB')) AS v(amount, label)
WHERE o.code IN ('MEO_PT', 'VODAFONE_PT');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'EUR', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (5,'60 min'), (10,'150 min'), (20,'400 min'), (50,'Ilimitado')) AS v(amount, label)
WHERE o.code IN ('MEO_PT', 'VODAFONE_PT');

-- Brasil (BRL)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'BRL', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (10,'1 GB'), (20,'3 GB'), (50,'10 GB'), (100,'20 GB')) AS v(amount, label)
WHERE o.code IN ('VIVO_BR', 'CLARO_BR');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'BRL', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (10,'100 min'), (20,'300 min'), (50,'800 min'), (100,'Ilimitado')) AS v(amount, label)
WHERE o.code IN ('VIVO_BR', 'CLARO_BR');

-- Cabo Verde (CVE)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'CVE', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (200,'300 MB'), (500,'1 GB'), (1000,'2 GB'), (2000,'5 GB')) AS v(amount, label)
WHERE o.code = 'CVMOVEL_CV';
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'CVE', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (200,'50 min'), (500,'120 min'), (1000,'300 min'), (2000,'700 min')) AS v(amount, label)
WHERE o.code = 'CVMOVEL_CV';

-- Guine-Bissau (XOF)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'XOF', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (1000,'500 MB'), (2500,'1.5 GB'), (5000,'4 GB'), (10000,'10 GB')) AS v(amount, label)
WHERE o.code IN ('ORANGE_GW', 'MTN_GW');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'XOF', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (1000,'60 min'), (2500,'180 min'), (5000,'450 min'), (10000,'1200 min')) AS v(amount, label)
WHERE o.code IN ('ORANGE_GW', 'MTN_GW');

-- Guine Equatorial (XAF)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'XAF', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (1000,'500 MB'), (2500,'1.5 GB'), (5000,'4 GB'), (10000,'10 GB')) AS v(amount, label)
WHERE o.code = 'GETESA_GQ';
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'XAF', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (1000,'60 min'), (2500,'180 min'), (5000,'450 min'), (10000,'1200 min')) AS v(amount, label)
WHERE o.code = 'GETESA_GQ';

-- Mocambique (MZN)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'MZN', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (50,'300 MB'), (100,'1 GB'), (250,'3 GB'), (500,'8 GB')) AS v(amount, label)
WHERE o.code IN ('VODACOM_MZ', 'MCEL_MZ');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'MZN', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (50,'50 min'), (100,'120 min'), (250,'300 min'), (500,'800 min')) AS v(amount, label)
WHERE o.code IN ('VODACOM_MZ', 'MCEL_MZ');

-- Sao Tome e Principe (STN)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'STN', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (20,'200 MB'), (50,'500 MB'), (100,'1.5 GB'), (250,'4 GB')) AS v(amount, label)
WHERE o.code = 'CST_ST';
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'STN', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (20,'40 min'), (50,'100 min'), (100,'250 min'), (250,'600 min')) AS v(amount, label)
WHERE o.code = 'CST_ST';

-- Timor-Leste (USD)
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'USD', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (2,'500 MB'), (5,'1 GB'), (10,'3 GB'), (20,'8 GB')) AS v(amount, label)
WHERE o.code IN ('TELKOMCEL_TL', 'TELEMOR_TL');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'USD', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (2,'60 min'), (5,'150 min'), (10,'400 min'), (20,'1000 min')) AS v(amount, label)
WHERE o.code IN ('TELKOMCEL_TL', 'TELEMOR_TL');
