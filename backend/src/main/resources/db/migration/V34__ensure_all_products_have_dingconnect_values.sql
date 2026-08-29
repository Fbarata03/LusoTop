-- Migration V34: Garante que TODOS os produtos têm dingconnect_send_value e dingconnect_send_currency
-- Este fix é crítico: qualquer produto sem estes valores falha no SendTransfer da DingConnect.
-- Usa os SKU codes reais já ligados em V18, e aplica valores EUR derivados dos custos reais.

-- Estratégia: para produtos que ainda têm dingconnect_send_value = NULL,
-- usar o dingconnect_sku_code para identificar o produto real na DingConnect
-- e aplicar os seus valores EUR mínimos (Send.Minimum.SendValue do GetProducts).

-- ANGOLA

-- Movicel: valores fixos EUR por tier
UPDATE airtime_products 
SET dingconnect_send_value = 0.31, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '93A865AO%' AND dingconnect_send_value IS NULL AND amount < 200;

UPDATE airtime_products 
SET dingconnect_send_value = 0.77, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '93A865AO%' AND dingconnect_send_value IS NULL AND amount BETWEEN 400 AND 600;

UPDATE airtime_products 
SET dingconnect_send_value = 3.08, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '93A865AO%' AND dingconnect_send_value IS NULL AND amount BETWEEN 1000 AND 3500;

UPDATE airtime_products 
SET dingconnect_send_value = 7.70, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '93A865AO%' AND dingconnect_send_value IS NULL AND amount > 5000;

-- Unitel: valores fixos EUR (copiados de V32 que já foram testados)
UPDATE airtime_products 
SET dingconnect_send_value = 0.59, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '9BDF1DAO%' AND dingconnect_send_value IS NULL AND amount < 500;

UPDATE airtime_products 
SET dingconnect_send_value = 0.84, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '9BDF1DAO%' AND dingconnect_send_value IS NULL AND amount BETWEEN 500 AND 700;

UPDATE airtime_products 
SET dingconnect_send_value = 1.65, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '9BDF1DAO%' AND dingconnect_send_value IS NULL AND amount BETWEEN 1000 AND 1500;

UPDATE airtime_products 
SET dingconnect_send_value = 3.30, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '9BDF1DAO%' AND dingconnect_send_value IS NULL AND amount BETWEEN 2000 AND 2500;

UPDATE airtime_products 
SET dingconnect_send_value = 4.94, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '9BDF1DAO%' AND dingconnect_send_value IS NULL AND amount BETWEEN 3000 AND 3500;

UPDATE airtime_products 
SET dingconnect_send_value = 8.22, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE '9BDF1DAO%' AND dingconnect_send_value IS NULL AND amount > 5000;

-- Africell: valores fixos EUR (copiados de V30/V31 que já foram testados)
UPDATE airtime_products 
SET dingconnect_send_value = 0.15, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'C07B28AO%' AND dingconnect_send_value IS NULL AND amount = 100;

UPDATE airtime_products 
SET dingconnect_send_value = 0.73, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'C07B28AO%' AND dingconnect_send_value IS NULL AND amount = 500;

UPDATE airtime_products 
SET dingconnect_send_value = 1.47, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'C07B28AO%' AND dingconnect_send_value IS NULL AND amount = 1000;

UPDATE airtime_products 
SET dingconnect_send_value = 2.94, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'C07B28AO%' AND dingconnect_send_value IS NULL AND amount = 2000;

UPDATE airtime_products 
SET dingconnect_send_value = 4.41, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'C07B28AO%' AND dingconnect_send_value IS NULL AND amount = 3000;

UPDATE airtime_products 
SET dingconnect_send_value = 7.35, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'C07B28AO%' AND dingconnect_send_value IS NULL AND amount = 5000;

-- BRASIL

-- Claro Brasil: valores EUR por faixa (CLBR)
UPDATE airtime_products 
SET dingconnect_send_value = 0.54, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_CL_%' AND dingconnect_send_value IS NULL AND amount IN (15, 17, 20);

UPDATE airtime_products 
SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_CL_%' AND dingconnect_send_value IS NULL AND amount IN (25, 30, 35);

UPDATE airtime_products 
SET dingconnect_send_value = 3.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_CL_%' AND dingconnect_send_value IS NULL AND amount IN (40, 50, 60);

UPDATE airtime_products 
SET dingconnect_send_value = 6.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_CL_%' AND dingconnect_send_value IS NULL AND amount IN (90, 100);

-- Tim Brasil (IMBR)
UPDATE airtime_products 
SET dingconnect_send_value = 0.54, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_IM_%' AND dingconnect_send_value IS NULL AND amount IN (15, 17, 20);

UPDATE airtime_products 
SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_IM_%' AND dingconnect_send_value IS NULL AND amount IN (25, 30, 35);

UPDATE airtime_products 
SET dingconnect_send_value = 3.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_IM_%' AND dingconnect_send_value IS NULL AND amount IN (40, 50, 60);

UPDATE airtime_products 
SET dingconnect_send_value = 6.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_IM_%' AND dingconnect_send_value IS NULL AND amount IN (90, 100);

-- Vivo Brasil (VOBR)
UPDATE airtime_products 
SET dingconnect_send_value = 0.54, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_VO_%' AND dingconnect_send_value IS NULL AND amount IN (15, 17, 20);

UPDATE airtime_products 
SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_VO_%' AND dingconnect_send_value IS NULL AND amount IN (25, 30, 35);

UPDATE airtime_products 
SET dingconnect_send_value = 3.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_VO_%' AND dingconnect_send_value IS NULL AND amount IN (40, 50, 60);

UPDATE airtime_products 
SET dingconnect_send_value = 6.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code LIKE 'BR_VO_%' AND dingconnect_send_value IS NULL AND amount IN (90, 100);

-- Algar, Sercomtel, Algar MVNO (provider codes: 215028BR, 7BF18CBR, 943DFABR)
UPDATE airtime_products 
SET dingconnect_send_value = 0.54, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN 
  (SELECT dingconnect_sku_code FROM airtime_products p 
   JOIN operators o ON p.operator_id = o.id 
   WHERE o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR') AND p.amount IN (15, 17, 20))
AND dingconnect_send_value IS NULL AND amount IN (15, 17, 20);

UPDATE airtime_products 
SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN 
  (SELECT dingconnect_sku_code FROM airtime_products p 
   JOIN operators o ON p.operator_id = o.id 
   WHERE o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR') AND p.amount IN (25, 30, 35))
AND dingconnect_send_value IS NULL AND amount IN (25, 30, 35);

UPDATE airtime_products 
SET dingconnect_send_value = 3.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN 
  (SELECT dingconnect_sku_code FROM airtime_products p 
   JOIN operators o ON p.operator_id = o.id 
   WHERE o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR') AND p.amount IN (40, 50, 60))
AND dingconnect_send_value IS NULL AND amount IN (40, 50, 60);

UPDATE airtime_products 
SET dingconnect_send_value = 6.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN 
  (SELECT dingconnect_sku_code FROM airtime_products p 
   JOIN operators o ON p.operator_id = o.id 
   WHERE o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR') AND p.amount IN (90, 100, 180))
AND dingconnect_send_value IS NULL AND amount IN (90, 100);

UPDATE airtime_products 
SET dingconnect_send_value = 13.50, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN 
  (SELECT dingconnect_sku_code FROM airtime_products p 
   JOIN operators o ON p.operator_id = o.id 
   WHERE o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR') AND p.amount = 180)
AND dingconnect_send_value IS NULL AND amount = 180;

-- CABO VERDE

-- Unitel T+ (U2CV), Alou (VUCV)
UPDATE airtime_products 
SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN ('U2CV5', 'U2CV10', 'VUCV5', 'VUCV10') AND dingconnect_send_value IS NULL;

UPDATE airtime_products 
SET dingconnect_send_value = 3.50, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN ('U2CV15', 'VUCV15') AND dingconnect_send_value IS NULL;

UPDATE airtime_products 
SET dingconnect_send_value = 7.00, dingconnect_send_currency = 'EUR'
WHERE dingconnect_sku_code IN ('U2CV20', 'U2CV25', 'VUCV20', 'VUCV25') AND dingconnect_send_value IS NULL;

-- Fallback genérico para Cabo Verde (qualquer SKU ainda sem valor)
UPDATE airtime_products 
SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE country_id IN 
    (SELECT id FROM countries WHERE iso_code = 'CV'))
AND dingconnect_send_value IS NULL AND amount < 15;

UPDATE airtime_products 
SET dingconnect_send_value = 3.50, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE country_id IN 
    (SELECT id FROM countries WHERE iso_code = 'CV'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 15 AND 20;

UPDATE airtime_products 
SET dingconnect_send_value = 7.00, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE country_id IN 
    (SELECT id FROM countries WHERE iso_code = 'CV'))
AND dingconnect_send_value IS NULL AND amount > 20;

-- MOÇAMBIQUE

-- Vodacom (VDMZ), Movitel (1GMZ), mCel (MKMZ)
UPDATE airtime_products 
SET dingconnect_send_value = 0.18, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount < 80;

UPDATE airtime_products 
SET dingconnect_send_value = 0.36, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 80 AND 150;

UPDATE airtime_products 
SET dingconnect_send_value = 0.73, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 200 AND 300;

UPDATE airtime_products 
SET dingconnect_send_value = 1.47, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 500 AND 700;

UPDATE airtime_products 
SET dingconnect_send_value = 2.94, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 1000 AND 1500;

UPDATE airtime_products 
SET dingconnect_send_value = 4.41, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 2000 AND 3000;

UPDATE airtime_products 
SET dingconnect_send_value = 7.35, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('VDMZ', '1GMZ', 'MKMZ'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 5000 AND 6000;

-- PORTUGAL

-- MEO, Vodafone, NOS, Moche, UZO, Lycamobile (provider codes: MUPT, VFPT, NOPT, MWPT, UZPT, LYPT)
UPDATE airtime_products 
SET dingconnect_send_value = 0.77, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT'))
AND dingconnect_send_value IS NULL AND amount IN (5, 10);

UPDATE airtime_products 
SET dingconnect_send_value = 1.54, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT'))
AND dingconnect_send_value IS NULL AND amount IN (15, 20);

UPDATE airtime_products 
SET dingconnect_send_value = 3.08, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT'))
AND dingconnect_send_value IS NULL AND amount IN (25, 30);

UPDATE airtime_products 
SET dingconnect_send_value = 6.16, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT'))
AND dingconnect_send_value IS NULL AND amount IN (50, 75);

-- GUINÉ-BISSAU

-- Orange (ORGW), Mtel (MTGW)
UPDATE airtime_products 
SET dingconnect_send_value = 0.64, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('ORGW', 'MTGW'))
AND dingconnect_send_value IS NULL;

-- SÃO TOMÉ E PRÍNCIPE

-- Providence (7FST), CST (se aplicável)
UPDATE airtime_products 
SET dingconnect_send_value = 0.77, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('7FST', 'CST_ST'))
AND dingconnect_send_value IS NULL AND amount < 500;

UPDATE airtime_products 
SET dingconnect_send_value = 1.54, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('7FST', 'CST_ST'))
AND dingconnect_send_value IS NULL AND amount BETWEEN 500 AND 1000;

UPDATE airtime_products 
SET dingconnect_send_value = 3.08, dingconnect_send_currency = 'EUR'
WHERE operator_id IN 
  (SELECT id FROM operators WHERE provider_code IN ('7FST', 'CST_ST'))
AND dingconnect_send_value IS NULL AND amount > 1000;

-- Fallback final: para qualquer produto que ainda esteja sem valores (by amount tier)
UPDATE airtime_products 
SET dingconnect_send_value = 0.15, dingconnect_send_currency = 'EUR'
WHERE dingconnect_send_value IS NULL AND amount < 20;

UPDATE airtime_products 
SET dingconnect_send_value = 0.31, dingconnect_send_currency = 'EUR'
WHERE dingconnect_send_value IS NULL AND amount BETWEEN 20 AND 50;

UPDATE airtime_products 
SET dingconnect_send_value = 0.77, dingconnect_send_currency = 'EUR'
WHERE dingconnect_send_value IS NULL AND amount BETWEEN 50 AND 200;

UPDATE airtime_products 
SET dingconnect_send_value = 1.54, dingconnect_send_currency = 'EUR'
WHERE dingconnect_send_value IS NULL AND amount BETWEEN 200 AND 500;

UPDATE airtime_products 
SET dingconnect_send_value = 3.08, dingconnect_send_currency = 'EUR'
WHERE dingconnect_send_value IS NULL AND amount BETWEEN 500 AND 1000;

UPDATE airtime_products 
SET dingconnect_send_value = 6.16, dingconnect_send_currency = 'EUR'
WHERE dingconnect_send_value IS NULL AND amount > 1000;

-- Verifikação final: log de aviso se houver ainda produtos sem valores
-- (isto seria via um trigger ou check, mas em SQL puro deixamos este comentário)
-- SELECT COUNT(*) FROM airtime_products WHERE dingconnect_send_value IS NULL AND active = TRUE;
