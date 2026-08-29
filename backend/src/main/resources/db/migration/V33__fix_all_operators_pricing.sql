-- Migration V33: Corrige os precos de todos os produtos atualizado na V32
-- Usa a mesma formula: preco = (custo_real_eur + 3.00 + 0.25) / 0.985

-- Angola: Movicel valores fixos
UPDATE airtime_products SET payer_amount_cents = 408 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND amount = 2244.68;

UPDATE airtime_products SET payer_amount_cents = 1112 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND amount = 5602.89;

UPDATE airtime_products SET payer_amount_cents = 410 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND amount = 500;

UPDATE airtime_products SET payer_amount_cents = 346 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND amount = 100;

UPDATE airtime_products SET payer_amount_cents = 799 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND amount = 3371.67;

UPDATE airtime_products SET payer_amount_cents = 486 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '93A865AO' 
AND amount = 1122.34;

-- Angola: Unitel valores fixos
UPDATE airtime_products SET payer_amount_cents = 415 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND amount = 566.5;

UPDATE airtime_products SET payer_amount_cents = 665 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND amount = 2253.17;

UPDATE airtime_products SET payer_amount_cents = 390 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND amount = 400.79;

UPDATE airtime_products SET payer_amount_cents = 497 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND amount = 1128.86;

UPDATE airtime_products SET payer_amount_cents = 831 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND amount = 3378.22;

UPDATE airtime_products SET payer_amount_cents = 1164 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '9BDF1DAO' 
AND amount = 5627.58;

-- Angola: Africell
UPDATE airtime_products SET payer_amount_cents = 345 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND amount = 100;

UPDATE airtime_products SET payer_amount_cents = 404 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND amount = 500;

UPDATE airtime_products SET payer_amount_cents = 479 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND amount = 1000;

UPDATE airtime_products SET payer_amount_cents = 628 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND amount = 2000;

UPDATE airtime_products SET payer_amount_cents = 777 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND amount = 3000;

UPDATE airtime_products SET payer_amount_cents = 1076 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'C07B28AO' 
AND amount = 5000;

-- Brasil: valores pequenos (20-30 BRL)
UPDATE airtime_products SET payer_amount_cents = 385 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR', 'CLBR', 'IMBR', 'VOBR')
AND amount = 20;

UPDATE airtime_products SET payer_amount_cents = 481 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR', 'CLBR', 'IMBR', 'VOBR')
AND amount IN (25, 30);

-- Brasil: valores medio (40-60 BRL)
UPDATE airtime_products SET payer_amount_cents = 635 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR', 'CLBR', 'IMBR', 'VOBR')
AND amount IN (40, 50, 60);

-- Brasil: valores altos (90-180 BRL)
UPDATE airtime_products SET payer_amount_cents = 939 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR', 'CLBR', 'IMBR', 'VOBR')
AND amount IN (90, 100);

UPDATE airtime_products SET payer_amount_cents = 1701 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('215028BR', '7BF18CBR', '943DFABR', 'CLBR', 'IMBR', 'VOBR')
AND amount = 180;

-- Brasil: Vivo pequeno valor
UPDATE airtime_products SET payer_amount_cents = 385 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = 'VOBR'
AND amount = 15 OR amount = 17;

-- Cabo Verde
UPDATE airtime_products SET payer_amount_cents = 481 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('U2CV', 'VUCV')
AND amount IN (5, 10);

UPDATE airtime_products SET payer_amount_cents = 685 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('U2CV', 'VUCV')
AND amount = 15;

UPDATE airtime_products SET payer_amount_cents = 1041 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('U2CV', 'VUCV')
AND amount IN (20, 25);

-- Mocambique
UPDATE airtime_products SET payer_amount_cents = 447 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND amount IN (50, 100);

UPDATE airtime_products SET payer_amount_cents = 564 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND amount IN (200, 250);

UPDATE airtime_products SET payer_amount_cents = 797 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND amount IN (500, 600);

UPDATE airtime_products SET payer_amount_cents = 1264 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND amount IN (1000, 1200);

UPDATE airtime_products SET payer_amount_cents = 2665 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('VDMZ', '1GMZ', 'MKMZ')
AND amount IN (3000, 5000);

-- Portugal
UPDATE airtime_products SET payer_amount_cents = 437 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND amount = 5;

UPDATE airtime_products SET payer_amount_cents = 543 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND amount IN (10, 15);

UPDATE airtime_products SET payer_amount_cents = 863 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND amount IN (20, 25);

UPDATE airtime_products SET payer_amount_cents = 1396 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MUPT', 'VFPT', 'NOPT', 'MWPT', 'UZPT', 'LYPT')
AND amount IN (50, 75);

-- Guine-Bissau
UPDATE airtime_products SET payer_amount_cents = 533 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code IN ('MTGW', 'ORGW');

-- Sao Tome e Principe
UPDATE airtime_products SET payer_amount_cents = 584 
FROM operators o 
WHERE airtime_products.operator_id = o.id AND o.provider_code = '7FST';
