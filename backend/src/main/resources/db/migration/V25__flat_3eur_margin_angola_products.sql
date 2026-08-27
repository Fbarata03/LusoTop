-- Reduz a margem fixa dos produtos AOA (Angola) de 5 EUR (V23) para 3 EUR, mantendo a mesma
-- base de custo real (682.83 AOA por EUR, preco a retalho da propria DingConnect) e o mesmo
-- buffer de taxa da Stripe (0.25 EUR fixo + 1.5%).
--
-- Formula: preco = (custo_eur + 3.00 + 0.25) / (1 - 0.015), onde custo_eur = valor_local_AOA / 682.83

UPDATE airtime_products SET payer_amount_cents = 345  WHERE dingconnect_sku_code = 'C07B28AO85910'; -- Africell 100 AOA
UPDATE airtime_products SET payer_amount_cents = 404  WHERE dingconnect_sku_code = 'C07B28AO97954'; -- Africell 500 AOA
UPDATE airtime_products SET payer_amount_cents = 479  WHERE dingconnect_sku_code = 'C07B28AO79071'; -- Africell 1000 AOA
UPDATE airtime_products SET payer_amount_cents = 627  WHERE dingconnect_sku_code = 'C07B28AO6725';  -- Africell 2000 AOA
UPDATE airtime_products SET payer_amount_cents = 776  WHERE dingconnect_sku_code = 'C07B28AO10926'; -- Africell 3000 AOA
UPDATE airtime_products SET payer_amount_cents = 1073 WHERE dingconnect_sku_code = 'C07B28AO26535'; -- Africell 5000 AOA

UPDATE airtime_products SET payer_amount_cents = 345  WHERE dingconnect_sku_code = '93A865AO26407'; -- Movicel 100 AOA
UPDATE airtime_products SET payer_amount_cents = 404  WHERE dingconnect_sku_code = '93A865AO10715'; -- Movicel 500 AOA
UPDATE airtime_products SET payer_amount_cents = 497  WHERE dingconnect_sku_code = '93A865AO56354'; -- Movicel 1122.34 AOA
UPDATE airtime_products SET payer_amount_cents = 664  WHERE dingconnect_sku_code = '93A865AO21089'; -- Movicel 2244.68 AOA
UPDATE airtime_products SET payer_amount_cents = 831  WHERE dingconnect_sku_code = '93A865AO11015'; -- Movicel 3371.67 AOA
UPDATE airtime_products SET payer_amount_cents = 1163 WHERE dingconnect_sku_code = '93A865AO26992'; -- Movicel 5602.89 AOA

UPDATE airtime_products SET payer_amount_cents = 390  WHERE dingconnect_sku_code = '9BDF1DAO60570'; -- Unitel 400.79 AOA
UPDATE airtime_products SET payer_amount_cents = 414  WHERE dingconnect_sku_code = '9BDF1DAO70847'; -- Unitel 566.50 AOA
UPDATE airtime_products SET payer_amount_cents = 498  WHERE dingconnect_sku_code = '9BDF1DAO60872'; -- Unitel 1128.86 AOA
UPDATE airtime_products SET payer_amount_cents = 665  WHERE dingconnect_sku_code = '9BDF1DAO87957'; -- Unitel 2253.17 AOA
UPDATE airtime_products SET payer_amount_cents = 832  WHERE dingconnect_sku_code = '9BDF1DAO5582';  -- Unitel 3378.22 AOA
UPDATE airtime_products SET payer_amount_cents = 1167 WHERE dingconnect_sku_code = '9BDF1DAO5970';  -- Unitel 5627.58 AOA
