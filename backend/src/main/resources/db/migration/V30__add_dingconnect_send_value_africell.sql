-- Adiciona os valores dingconnect_send_value e dingconnect_send_currency aos produtos da Africell
-- que foram deixados de fora da migration V28. Esses valores sao obtidos da API GetProducts da DingConnect.

UPDATE airtime_products SET dingconnect_send_value = 0.15, dingconnect_send_currency = 'EUR' WHERE dingconnect_sku_code = 'C07B28AO85910';  -- Africell 100 AOA
UPDATE airtime_products SET dingconnect_send_value = 0.73, dingconnect_send_currency = 'EUR' WHERE dingconnect_sku_code = 'C07B28AO97954';  -- Africell 500 AOA
UPDATE airtime_products SET dingconnect_send_value = 1.47, dingconnect_send_currency = 'EUR' WHERE dingconnect_sku_code = 'C07B28AO79071';  -- Africell 1000 AOA
UPDATE airtime_products SET dingconnect_send_value = 2.94, dingconnect_send_currency = 'EUR' WHERE dingconnect_sku_code = 'C07B28AO6725';   -- Africell 2000 AOA
UPDATE airtime_products SET dingconnect_send_value = 4.41, dingconnect_send_currency = 'EUR' WHERE dingconnect_sku_code = 'C07B28AO10926';  -- Africell 3000 AOA
UPDATE airtime_products SET dingconnect_send_value = 7.35, dingconnect_send_currency = 'EUR' WHERE dingconnect_sku_code = 'C07B28AO26535';  -- Africell 5000 AOA
