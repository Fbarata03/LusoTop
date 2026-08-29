-- Migration V32: Adiciona dingconnect_send_value para TODAS as operadoras que ainda nao tem
-- Esta correcao garante que qualquer operadora e qualquer pais funcione sem erros.

-- Angola: Movicel e Unitel ja foram configuradas na V28/V29, mas vamos garantir com provider_code
UPDATE airtime_products SET dingconnect_send_value = 3.08, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND dingconnect_send_value IS NULL;

UPDATE airtime_products SET dingconnect_send_value = 7.7, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND dingconnect_send_value IS NULL AND amount > 5000;

UPDATE airtime_products SET dingconnect_send_value = 0.77, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND dingconnect_send_value IS NULL AND amount BETWEEN 400 AND 600;

UPDATE airtime_products SET dingconnect_send_value = 0.16, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND dingconnect_send_value IS NULL AND amount < 200;

-- Unitel
UPDATE airtime_products SET dingconnect_send_value = 0.84, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND dingconnect_send_value IS NULL AND amount BETWEEN 300 AND 700;

UPDATE airtime_products SET dingconnect_send_value = 3.3, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND dingconnect_send_value IS NULL AND amount BETWEEN 2000 AND 2500;

UPDATE airtime_products SET dingconnect_send_value = 0.59, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND dingconnect_send_value IS NULL AND amount < 500;

UPDATE airtime_products SET dingconnect_send_value = 1.65, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND dingconnect_send_value IS NULL AND amount BETWEEN 1000 AND 1500;

UPDATE airtime_products SET dingconnect_send_value = 4.94, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND dingconnect_send_value IS NULL AND amount BETWEEN 3000 AND 3500;

UPDATE airtime_products SET dingconnect_send_value = 8.22, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND dingconnect_send_value IS NULL AND amount > 5000;

-- Africell (ja foi configurada em V30/V31, mas garantir)
UPDATE airtime_products SET dingconnect_send_value = 0.15, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND dingconnect_send_value IS NULL AND amount = 100;

UPDATE airtime_products SET dingconnect_send_value = 0.73, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND dingconnect_send_value IS NULL AND amount = 500;

UPDATE airtime_products SET dingconnect_send_value = 1.47, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND dingconnect_send_value IS NULL AND amount = 1000;

UPDATE airtime_products SET dingconnect_send_value = 2.94, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND dingconnect_send_value IS NULL AND amount = 2000;

UPDATE airtime_products SET dingconnect_send_value = 4.41, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND dingconnect_send_value IS NULL AND amount = 3000;

UPDATE airtime_products SET dingconnect_send_value = 7.35, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND dingconnect_send_value IS NULL AND amount = 5000;

-- Brasil: Algar (215028BR), Sercomtel (7BF18CBR), Algar MVNO (943DFABR)
UPDATE airtime_products SET dingconnect_send_value = 0.54, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR')
AND dingconnect_send_value IS NULL AND amount = 20;

UPDATE airtime_products SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR')
AND dingconnect_send_value IS NULL AND amount IN (25, 30);

UPDATE airtime_products SET dingconnect_send_value = 3.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR')
AND dingconnect_send_value IS NULL AND amount IN (40, 50);

UPDATE airtime_products SET dingconnect_send_value = 6.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR')
AND dingconnect_send_value IS NULL AND amount IN (100, 90);

UPDATE airtime_products SET dingconnect_send_value = 13.50, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR')
AND dingconnect_send_value IS NULL AND amount = 180;

-- Claro Brasil (CLBR), Oi/Tim (IMBR), Vivo (VOBR)
UPDATE airtime_products SET dingconnect_send_value = 0.54, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('CLBR', 'IMBR', 'VOBR')
AND dingconnect_send_value IS NULL AND amount IN (15, 17, 20);

UPDATE airtime_products SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('CLBR', 'IMBR', 'VOBR')
AND dingconnect_send_value IS NULL AND amount IN (25, 30, 35);

UPDATE airtime_products SET dingconnect_send_value = 3.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('CLBR', 'IMBR', 'VOBR')
AND dingconnect_send_value IS NULL AND amount IN (40, 50, 60);

UPDATE airtime_products SET dingconnect_send_value = 6.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('CLBR', 'IMBR', 'VOBR')
AND dingconnect_send_value IS NULL AND amount IN (90, 100);

UPDATE airtime_products SET dingconnect_send_value = 13.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('CLBR', 'IMBR', 'VOBR')
AND dingconnect_send_value IS NULL AND amount = 180;

-- Cabo Verde: Unitel T+ (U2CV), Alou (VUCV)
UPDATE airtime_products SET dingconnect_send_value = 1.49, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('U2CV', 'VUCV')
AND dingconnect_send_value IS NULL AND amount IN (5, 10);

UPDATE airtime_products SET dingconnect_send_value = 3.50, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('U2CV', 'VUCV')
AND dingconnect_send_value IS NULL AND amount = 15;

UPDATE airtime_products SET dingconnect_send_value = 7.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('U2CV', 'VUCV')
AND dingconnect_send_value IS NULL AND amount IN (20, 25);

-- Mocambique: Vodacom (VDMZ), Movitel (1GMZ), mCel (MKMZ)
UPDATE airtime_products SET dingconnect_send_value = 1.15, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND dingconnect_send_value IS NULL AND amount IN (50, 100);

UPDATE airtime_products SET dingconnect_send_value = 2.30, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND dingconnect_send_value IS NULL AND amount IN (200, 250);

UPDATE airtime_products SET dingconnect_send_value = 4.60, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND dingconnect_send_value IS NULL AND amount IN (500, 600);

UPDATE airtime_products SET dingconnect_send_value = 9.20, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND dingconnect_send_value IS NULL AND amount IN (1000, 1200);

UPDATE airtime_products SET dingconnect_send_value = 23.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND dingconnect_send_value IS NULL AND amount IN (3000, 5000);

-- Portugal: MEO (MUPT), Vodafone (VFPT), NOS (NOPT), Moche (MWPT), UZO (UZPT), Lycamobile (LYPT)
UPDATE airtime_products SET dingconnect_send_value = 1.05, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND dingconnect_send_value IS NULL AND amount = 5;

UPDATE airtime_products SET dingconnect_send_value = 2.10, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND dingconnect_send_value IS NULL AND amount IN (10, 15);

UPDATE airtime_products SET dingconnect_send_value = 5.25, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND dingconnect_send_value IS NULL AND amount IN (20, 25);

UPDATE airtime_products SET dingconnect_send_value = 10.50, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND dingconnect_send_value IS NULL AND amount IN (50, 75);

-- Guine-Bissau: MTN (MTGW), Orange (ORGW)
UPDATE airtime_products SET dingconnect_send_value = 2.00, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MTGW', 'ORGW')
AND dingconnect_send_value IS NULL;

-- Sao Tome e Principe: CST (7FST)
UPDATE airtime_products SET dingconnect_send_value = 2.50, dingconnect_send_currency = 'EUR' 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '7FST'
AND dingconnect_send_value IS NULL;
