-- Recalcula o preco de venda dos produtos AOA (Angola) para garantir sempre pelo menos 5 EUR
-- de lucro por recarga, independentemente do valor. O custo real usado como base e o preco a
-- retalho que a propria DingConnect cobra a consumidores finais (consultado diretamente no site
-- deles em 2026-08-27 para Unitel, Movicel e Africell Angola: ~682.83 AOA por EUR), que e um
-- limite superior seguro do custo real de distribuidor -- usar isto como "custo" garante que a
-- margem real nunca fica abaixo dos 5 EUR pretendidos.
--
-- Formula: preco = (custo_eur + margem_5eur + taxa_fixa_stripe_0.25) / (1 - taxa_percentual_stripe_0.015)
-- onde custo_eur = valor_local_AOA / 682.83
--
-- Os restantes produtos (BRL, EUR, MZN, STN, XOF) nao foram recalculados nesta migracao --
-- falta o mesmo tipo de dado de custo real (preco a retalho da DingConnect) para esses paises
-- antes de se poder garantir a mesma margem fixa com seguranca.

UPDATE airtime_products SET payer_amount_cents = 548  WHERE dingconnect_sku_code = 'C07B28AO85910'; -- Africell 100 AOA
UPDATE airtime_products SET payer_amount_cents = 607  WHERE dingconnect_sku_code = 'C07B28AO97954'; -- Africell 500 AOA
UPDATE airtime_products SET payer_amount_cents = 682  WHERE dingconnect_sku_code = 'C07B28AO79071'; -- Africell 1000 AOA
UPDATE airtime_products SET payer_amount_cents = 830  WHERE dingconnect_sku_code = 'C07B28AO6725';  -- Africell 2000 AOA
UPDATE airtime_products SET payer_amount_cents = 979  WHERE dingconnect_sku_code = 'C07B28AO10926'; -- Africell 3000 AOA
UPDATE airtime_products SET payer_amount_cents = 1276 WHERE dingconnect_sku_code = 'C07B28AO26535'; -- Africell 5000 AOA

UPDATE airtime_products SET payer_amount_cents = 548  WHERE dingconnect_sku_code = '93A865AO26407'; -- Movicel 100 AOA
UPDATE airtime_products SET payer_amount_cents = 607  WHERE dingconnect_sku_code = '93A865AO10715'; -- Movicel 500 AOA
UPDATE airtime_products SET payer_amount_cents = 700  WHERE dingconnect_sku_code = '93A865AO56354'; -- Movicel 1122.34 AOA
UPDATE airtime_products SET payer_amount_cents = 867  WHERE dingconnect_sku_code = '93A865AO21089'; -- Movicel 2244.68 AOA
UPDATE airtime_products SET payer_amount_cents = 1034 WHERE dingconnect_sku_code = '93A865AO11015'; -- Movicel 3371.67 AOA
UPDATE airtime_products SET payer_amount_cents = 1366 WHERE dingconnect_sku_code = '93A865AO26992'; -- Movicel 5602.89 AOA

UPDATE airtime_products SET payer_amount_cents = 593  WHERE dingconnect_sku_code = '9BDF1DAO60570'; -- Unitel 400.79 AOA
UPDATE airtime_products SET payer_amount_cents = 617  WHERE dingconnect_sku_code = '9BDF1DAO70847'; -- Unitel 566.50 AOA
UPDATE airtime_products SET payer_amount_cents = 701  WHERE dingconnect_sku_code = '9BDF1DAO60872'; -- Unitel 1128.86 AOA
UPDATE airtime_products SET payer_amount_cents = 868  WHERE dingconnect_sku_code = '9BDF1DAO87957'; -- Unitel 2253.17 AOA
UPDATE airtime_products SET payer_amount_cents = 1035 WHERE dingconnect_sku_code = '9BDF1DAO5582';  -- Unitel 3378.22 AOA
UPDATE airtime_products SET payer_amount_cents = 1370 WHERE dingconnect_sku_code = '9BDF1DAO5970';  -- Unitel 5627.58 AOA
