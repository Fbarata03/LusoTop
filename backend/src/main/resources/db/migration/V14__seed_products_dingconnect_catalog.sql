-- Produtos (saldo, dados moveis, voz) para as operadoras reais da DingConnect inseridas em
-- V13. Valores continuam ilustrativos (a integracao real de precos/entrega via DingConnect
-- API fica para quando o pagamento real entrar em producao), mas agora ligados a operadoras
-- que realmente existem no catalogo do fornecedor escolhido.

-- Angola (AOA)
INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'AOA', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (500), (1000), (2000), (5000)) AS v(amount)
WHERE o.code IN ('UNITEL_AO', 'MOVICEL_AO', 'AFRICELL_AO');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'AOA', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (500,'500 MB'), (1000,'1 GB'), (2000,'3 GB'), (4000,'6 GB')) AS v(amount, label)
WHERE o.code IN ('UNITEL_AO', 'MOVICEL_AO', 'AFRICELL_AO');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'AOA', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (500,'60 min'), (1000,'150 min'), (2000,'400 min'), (4000,'1000 min')) AS v(amount, label)
WHERE o.code IN ('UNITEL_AO', 'MOVICEL_AO', 'AFRICELL_AO');

-- Brasil (BRL)
INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'BRL', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (10), (20), (50), (100)) AS v(amount)
WHERE o.code IN ('CLARO_BR', 'TIM_BR', 'VIVO_BR', 'ALGAR_BR');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'BRL', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (10,'1 GB'), (20,'3 GB'), (50,'10 GB'), (100,'20 GB')) AS v(amount, label)
WHERE o.code IN ('CLARO_BR', 'TIM_BR', 'VIVO_BR', 'ALGAR_BR');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'BRL', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (10,'100 min'), (20,'300 min'), (50,'800 min'), (100,'Ilimitado')) AS v(amount, label)
WHERE o.code IN ('CLARO_BR', 'TIM_BR', 'VIVO_BR', 'ALGAR_BR');

-- Cabo Verde (CVE)
INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'CVE', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (200), (500), (1000), (2000)) AS v(amount)
WHERE o.code IN ('UNITELT_CV', 'ALOU_CV');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'CVE', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (200,'300 MB'), (500,'1 GB'), (1000,'2 GB'), (2000,'5 GB')) AS v(amount, label)
WHERE o.code IN ('UNITELT_CV', 'ALOU_CV');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'CVE', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (200,'50 min'), (500,'120 min'), (1000,'300 min'), (2000,'700 min')) AS v(amount, label)
WHERE o.code IN ('UNITELT_CV', 'ALOU_CV');

-- Mocambique (MZN)
INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'MZN', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (50), (100), (250), (500)) AS v(amount)
WHERE o.code IN ('VODACOM_MZ', 'MOVITEL_MZ', 'MCEL_MZ');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'MZN', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (50,'300 MB'), (100,'1 GB'), (250,'3 GB'), (500,'8 GB')) AS v(amount, label)
WHERE o.code IN ('VODACOM_MZ', 'MOVITEL_MZ', 'MCEL_MZ');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'MZN', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (50,'50 min'), (100,'120 min'), (250,'300 min'), (500,'800 min')) AS v(amount, label)
WHERE o.code IN ('VODACOM_MZ', 'MOVITEL_MZ', 'MCEL_MZ');

-- Portugal (EUR)
INSERT INTO airtime_products (operator_id, amount, currency, type, active)
SELECT o.id, v.amount, 'EUR', 'AIRTIME', TRUE
FROM operators o CROSS JOIN (VALUES (5), (10), (20), (50)) AS v(amount)
WHERE o.code IN ('MEO_PT', 'VODAFONE_PT', 'NOS_PT', 'MOCHE_PT', 'UZO_PT', 'LYCAMOBILE_PT');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'EUR', 'DATA', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (5,'1 GB'), (10,'3 GB'), (20,'10 GB'), (50,'30 GB')) AS v(amount, label)
WHERE o.code IN ('MEO_PT', 'VODAFONE_PT', 'NOS_PT', 'MOCHE_PT', 'UZO_PT', 'LYCAMOBILE_PT');
INSERT INTO airtime_products (operator_id, amount, currency, type, label, active)
SELECT o.id, v.amount, 'EUR', 'VOICE', v.label, TRUE
FROM operators o CROSS JOIN (VALUES (5,'60 min'), (10,'150 min'), (20,'400 min'), (50,'Ilimitado')) AS v(amount, label)
WHERE o.code IN ('MEO_PT', 'VODAFONE_PT', 'NOS_PT', 'MOCHE_PT', 'UZO_PT', 'LYCAMOBILE_PT');
