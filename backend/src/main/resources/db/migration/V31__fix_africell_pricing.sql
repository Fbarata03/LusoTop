-- Corrige os precos dos produtos da Africell usando os dingconnect_send_value reais adicionados em V30.
-- Formula (igual a V25/V26/V29): preco = (custo_real_eur + 3.00 + 0.25) / (1 - 0.015)

UPDATE airtime_products SET payer_amount_cents = 345 WHERE dingconnect_sku_code = 'C07B28AO85910';  -- Africell 100 AOA
UPDATE airtime_products SET payer_amount_cents = 404 WHERE dingconnect_sku_code = 'C07B28AO97954';  -- Africell 500 AOA
UPDATE airtime_products SET payer_amount_cents = 479 WHERE dingconnect_sku_code = 'C07B28AO79071';  -- Africell 1000 AOA
UPDATE airtime_products SET payer_amount_cents = 628 WHERE dingconnect_sku_code = 'C07B28AO6725';   -- Africell 2000 AOA
UPDATE airtime_products SET payer_amount_cents = 777 WHERE dingconnect_sku_code = 'C07B28AO10926';  -- Africell 3000 AOA
UPDATE airtime_products SET payer_amount_cents = 1076 WHERE dingconnect_sku_code = 'C07B28AO26535'; -- Africell 5000 AOA
