-- V36: Repõe os preços dos produtos NÃO-EUR (Angola, Brasil, Moçambique, Guiné-Bissau, São
-- Tomé) aos valores da V25/V26, que eram os últimos revistos como corretos antes de a V33 os
-- ter corrompido com custos inventados e inconsistentes.
--
-- Base de custo (igual à V25/V26):
--   AOA: valor_local / 682.83  (taxa de retalho real da DingConnect, verificada)
--   XOF/STN: valor_local / paridade oficial fixa com o EUR (655.957 / 24.5)
--   BRL/MZN: taxa de mercado ao vivo (à data da V26) x 1.63 (fator observado no corredor AOA)
-- Fórmula: preço = (custo_eur + 3.00 + 0.25) / 0.985
--
-- Precisão fina fica para o resync do catálogo real (GET/POST /api/admin/catalog/*), que
-- substitui estes valores pelos SendValue reais do GetProducts da DingConnect.

-- ===== Angola (AOA) -- da V25 =====
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

-- ===== Brasil / Moçambique / Guiné-Bissau / São Tomé (não-EUR) -- da V26 =====
UPDATE airtime_products SET payer_amount_cents = 883 WHERE dingconnect_sku_code = '943DFABR39629' AND amount = 20 AND currency = 'BRL'; -- Algar MVNO 20 BRL
UPDATE airtime_products SET payer_amount_cents = 1159 WHERE dingconnect_sku_code = '943DFABR96653' AND amount = 30 AND currency = 'BRL'; -- Algar MVNO 30 BRL
UPDATE airtime_products SET payer_amount_cents = 1435 WHERE dingconnect_sku_code = '943DFABR35205' AND amount = 40 AND currency = 'BRL'; -- Algar MVNO 40 BRL
UPDATE airtime_products SET payer_amount_cents = 1988 WHERE dingconnect_sku_code = '943DFABR40145' AND amount = 60 AND currency = 'BRL'; -- Algar MVNO 60 BRL
UPDATE airtime_products SET payer_amount_cents = 2817 WHERE dingconnect_sku_code = '943DFABR64967' AND amount = 90 AND currency = 'BRL'; -- Algar MVNO 90 BRL
UPDATE airtime_products SET payer_amount_cents = 5304 WHERE dingconnect_sku_code = '943DFABR23946' AND amount = 180 AND currency = 'BRL'; -- Algar MVNO 180 BRL
UPDATE airtime_products SET payer_amount_cents = 1021 WHERE dingconnect_sku_code = '215028BR21644' AND amount = 25 AND currency = 'BRL'; -- Algar Telecom 25 BRL
UPDATE airtime_products SET payer_amount_cents = 1159 WHERE dingconnect_sku_code = '215028BR91701' AND amount = 30 AND currency = 'BRL'; -- Algar Telecom 30 BRL
UPDATE airtime_products SET payer_amount_cents = 1712 WHERE dingconnect_sku_code = '215028BR68560' AND amount = 50 AND currency = 'BRL'; -- Algar Telecom 50 BRL
UPDATE airtime_products SET payer_amount_cents = 3094 WHERE dingconnect_sku_code = '215028BR84384' AND amount = 100 AND currency = 'BRL'; -- Algar Telecom 100 BRL
UPDATE airtime_products SET payer_amount_cents = 883 WHERE dingconnect_sku_code = 'BR_CL_TopUp_20.00' AND amount = 20 AND currency = 'BRL'; -- Claro 20 BRL
UPDATE airtime_products SET payer_amount_cents = 1159 WHERE dingconnect_sku_code = 'BR_CL_TopUp_30.00' AND amount = 30 AND currency = 'BRL'; -- Claro 30 BRL
UPDATE airtime_products SET payer_amount_cents = 1435 WHERE dingconnect_sku_code = 'CLBRBR56359' AND amount = 40 AND currency = 'BRL'; -- Claro 40 BRL
UPDATE airtime_products SET payer_amount_cents = 1712 WHERE dingconnect_sku_code = 'BR_CL_TopUp_50.00' AND amount = 50 AND currency = 'BRL'; -- Claro 50 BRL
UPDATE airtime_products SET payer_amount_cents = 3094 WHERE dingconnect_sku_code = 'BR_CL_TopUp_100.00' AND amount = 100 AND currency = 'BRL'; -- Claro 100 BRL
UPDATE airtime_products SET payer_amount_cents = 744 WHERE dingconnect_sku_code = '7BF18CBR76815' AND amount = 15 AND currency = 'BRL'; -- Sercomtel 15 BRL
UPDATE airtime_products SET payer_amount_cents = 1021 WHERE dingconnect_sku_code = '7BF18CBR19076' AND amount = 25 AND currency = 'BRL'; -- Sercomtel 25 BRL
UPDATE airtime_products SET payer_amount_cents = 1297 WHERE dingconnect_sku_code = '7BF18CBR48780' AND amount = 35 AND currency = 'BRL'; -- Sercomtel 35 BRL
UPDATE airtime_products SET payer_amount_cents = 1712 WHERE dingconnect_sku_code = '7BF18CBR73843' AND amount = 50 AND currency = 'BRL'; -- Sercomtel 50 BRL
UPDATE airtime_products SET payer_amount_cents = 3094 WHERE dingconnect_sku_code = '7BF18CBR98879' AND amount = 100 AND currency = 'BRL'; -- Sercomtel 100 BRL
UPDATE airtime_products SET payer_amount_cents = 883 WHERE dingconnect_sku_code = 'BR_IM_TopUp_20.00' AND amount = 20 AND currency = 'BRL'; -- Tim 20 BRL
UPDATE airtime_products SET payer_amount_cents = 1021 WHERE dingconnect_sku_code = 'IMBR65764' AND amount = 25 AND currency = 'BRL'; -- Tim 25 BRL
UPDATE airtime_products SET payer_amount_cents = 1159 WHERE dingconnect_sku_code = 'BR_IM_TopUp_30.00' AND amount = 30 AND currency = 'BRL'; -- Tim 30 BRL
UPDATE airtime_products SET payer_amount_cents = 1435 WHERE dingconnect_sku_code = 'BR_IM_TopUp_40.00' AND amount = 40 AND currency = 'BRL'; -- Tim 40 BRL
UPDATE airtime_products SET payer_amount_cents = 1712 WHERE dingconnect_sku_code = 'BR_IM_TopUp_50.00' AND amount = 50 AND currency = 'BRL'; -- Tim 50 BRL
UPDATE airtime_products SET payer_amount_cents = 1988 WHERE dingconnect_sku_code = 'IMBR32311' AND amount = 60 AND currency = 'BRL'; -- Tim 60 BRL
UPDATE airtime_products SET payer_amount_cents = 3094 WHERE dingconnect_sku_code = 'BR_IM_TopUp_100.00' AND amount = 100 AND currency = 'BRL'; -- Tim 100 BRL
UPDATE airtime_products SET payer_amount_cents = 744 WHERE dingconnect_sku_code = 'BR_VO_TopUp_15.00' AND amount = 15 AND currency = 'BRL'; -- Vivo 15 BRL
UPDATE airtime_products SET payer_amount_cents = 800 WHERE dingconnect_sku_code = 'VOBR98982' AND amount = 17 AND currency = 'BRL'; -- Vivo 17 BRL
UPDATE airtime_products SET payer_amount_cents = 883 WHERE dingconnect_sku_code = 'BR_VO_TopUp_20.00' AND amount = 20 AND currency = 'BRL'; -- Vivo 20 BRL
UPDATE airtime_products SET payer_amount_cents = 1021 WHERE dingconnect_sku_code = 'BR_VO_TopUp_25.00' AND amount = 25 AND currency = 'BRL'; -- Vivo 25 BRL
UPDATE airtime_products SET payer_amount_cents = 1159 WHERE dingconnect_sku_code = 'VOBR71581' AND amount = 30 AND currency = 'BRL'; -- Vivo 30 BRL
UPDATE airtime_products SET payer_amount_cents = 1297 WHERE dingconnect_sku_code = 'BR_VO_TopUp_35.00' AND amount = 35 AND currency = 'BRL'; -- Vivo 35 BRL
UPDATE airtime_products SET payer_amount_cents = 1435 WHERE dingconnect_sku_code = 'BR_VO_TopUp_40.00' AND amount = 40 AND currency = 'BRL'; -- Vivo 40 BRL
UPDATE airtime_products SET payer_amount_cents = 1712 WHERE dingconnect_sku_code = 'BR_VO_TopUp_50.00' AND amount = 50 AND currency = 'BRL'; -- Vivo 50 BRL
UPDATE airtime_products SET payer_amount_cents = 3094 WHERE dingconnect_sku_code = 'BR_VO_TopUp_100.00' AND amount = 100 AND currency = 'BRL'; -- Vivo 100 BRL
UPDATE airtime_products SET payer_amount_cents = 352 WHERE dingconnect_sku_code = '1GMZ42278' AND amount = 9.8 AND currency = 'MZN'; -- Movitel 9.8 MZN
UPDATE airtime_products SET payer_amount_cents = 441 WHERE dingconnect_sku_code = '1GMZ92937' AND amount = 49.7 AND currency = 'MZN'; -- Movitel 49.7 MZN
UPDATE airtime_products SET payer_amount_cents = 553 WHERE dingconnect_sku_code = '1GMZ69515' AND amount = 100.1 AND currency = 'MZN'; -- Movitel 100.1 MZN
UPDATE airtime_products SET payer_amount_cents = 663 WHERE dingconnect_sku_code = '1GMZ63582' AND amount = 149.8 AND currency = 'MZN'; -- Movitel 149.8 MZN
UPDATE airtime_products SET payer_amount_cents = 775 WHERE dingconnect_sku_code = '1GMZ8209' AND amount = 200.2 AND currency = 'MZN'; -- Movitel 200.2 MZN
UPDATE airtime_products SET payer_amount_cents = 886 WHERE dingconnect_sku_code = '1GMZ71168' AND amount = 249.9 AND currency = 'MZN'; -- Movitel 249.9 MZN
UPDATE airtime_products SET payer_amount_cents = 998 WHERE dingconnect_sku_code = '1GMZ72285' AND amount = 300.3 AND currency = 'MZN'; -- Movitel 300.3 MZN
UPDATE airtime_products SET payer_amount_cents = 1109 WHERE dingconnect_sku_code = '1GMZ71702' AND amount = 350 AND currency = 'MZN'; -- Movitel 350 MZN
UPDATE airtime_products SET payer_amount_cents = 1219 WHERE dingconnect_sku_code = '1GMZ7733' AND amount = 399.7 AND currency = 'MZN'; -- Movitel 399.7 MZN
UPDATE airtime_products SET payer_amount_cents = 1331 WHERE dingconnect_sku_code = '1GMZ37768' AND amount = 450.1 AND currency = 'MZN'; -- Movitel 450.1 MZN
UPDATE airtime_products SET payer_amount_cents = 1442 WHERE dingconnect_sku_code = '1GMZ84928' AND amount = 499.8 AND currency = 'MZN'; -- Movitel 499.8 MZN
UPDATE airtime_products SET payer_amount_cents = 1665 WHERE dingconnect_sku_code = '1GMZ80294' AND amount = 599.9 AND currency = 'MZN'; -- Movitel 599.9 MZN
UPDATE airtime_products SET payer_amount_cents = 1887 WHERE dingconnect_sku_code = '1GMZ45943' AND amount = 700 AND currency = 'MZN'; -- Movitel 700 MZN
UPDATE airtime_products SET payer_amount_cents = 2110 WHERE dingconnect_sku_code = '1GMZ66321' AND amount = 800.1 AND currency = 'MZN'; -- Movitel 800.1 MZN
UPDATE airtime_products SET payer_amount_cents = 2333 WHERE dingconnect_sku_code = '1GMZ94901' AND amount = 900.2 AND currency = 'MZN'; -- Movitel 900.2 MZN
UPDATE airtime_products SET payer_amount_cents = 2555 WHERE dingconnect_sku_code = '1GMZ20738' AND amount = 1000.3 AND currency = 'MZN'; -- Movitel 1000.3 MZN
UPDATE airtime_products SET payer_amount_cents = 2776 WHERE dingconnect_sku_code = '1GMZ99901' AND amount = 1099.7 AND currency = 'MZN'; -- Movitel 1099.7 MZN
UPDATE airtime_products SET payer_amount_cents = 2999 WHERE dingconnect_sku_code = '1GMZ72593' AND amount = 1199.8 AND currency = 'MZN'; -- Movitel 1199.8 MZN
UPDATE airtime_products SET payer_amount_cents = 3222 WHERE dingconnect_sku_code = '1GMZ10315' AND amount = 1299.9 AND currency = 'MZN'; -- Movitel 1299.9 MZN
UPDATE airtime_products SET payer_amount_cents = 3445 WHERE dingconnect_sku_code = '1GMZ76240' AND amount = 1400 AND currency = 'MZN'; -- Movitel 1400 MZN
UPDATE airtime_products SET payer_amount_cents = 3667 WHERE dingconnect_sku_code = '1GMZ43132' AND amount = 1500.1 AND currency = 'MZN'; -- Movitel 1500.1 MZN
UPDATE airtime_products SET payer_amount_cents = 3890 WHERE dingconnect_sku_code = '1GMZ40821' AND amount = 1600.2 AND currency = 'MZN'; -- Movitel 1600.2 MZN
UPDATE airtime_products SET payer_amount_cents = 4113 WHERE dingconnect_sku_code = '1GMZ32521' AND amount = 1700.3 AND currency = 'MZN'; -- Movitel 1700.3 MZN
UPDATE airtime_products SET payer_amount_cents = 4334 WHERE dingconnect_sku_code = '1GMZ81647' AND amount = 1799.7 AND currency = 'MZN'; -- Movitel 1799.7 MZN
UPDATE airtime_products SET payer_amount_cents = 4556 WHERE dingconnect_sku_code = '1GMZ47241' AND amount = 1899.8 AND currency = 'MZN'; -- Movitel 1899.8 MZN
UPDATE airtime_products SET payer_amount_cents = 4779 WHERE dingconnect_sku_code = '1GMZ18490' AND amount = 1999.9 AND currency = 'MZN'; -- Movitel 1999.9 MZN
UPDATE airtime_products SET payer_amount_cents = 441 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_1.80' AND amount = 49.7 AND currency = 'MZN'; -- Vodacom 49.7 MZN
UPDATE airtime_products SET payer_amount_cents = 553 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_3.50' AND amount = 100.1 AND currency = 'MZN'; -- Vodacom 100.1 MZN
UPDATE airtime_products SET payer_amount_cents = 663 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_5.30' AND amount = 149.8 AND currency = 'MZN'; -- Vodacom 149.8 MZN
UPDATE airtime_products SET payer_amount_cents = 775 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_7.00' AND amount = 200.2 AND currency = 'MZN'; -- Vodacom 200.2 MZN
UPDATE airtime_products SET payer_amount_cents = 886 WHERE dingconnect_sku_code = 'VDMZ49911' AND amount = 249.9 AND currency = 'MZN'; -- Vodacom 249.9 MZN
UPDATE airtime_products SET payer_amount_cents = 998 WHERE dingconnect_sku_code = 'VDMZ92816' AND amount = 300.3 AND currency = 'MZN'; -- Vodacom 300.3 MZN
UPDATE airtime_products SET payer_amount_cents = 1109 WHERE dingconnect_sku_code = 'VDMZ55957' AND amount = 350 AND currency = 'MZN'; -- Vodacom 350 MZN
UPDATE airtime_products SET payer_amount_cents = 1219 WHERE dingconnect_sku_code = 'VDMZ92482' AND amount = 399.7 AND currency = 'MZN'; -- Vodacom 399.7 MZN
UPDATE airtime_products SET payer_amount_cents = 1331 WHERE dingconnect_sku_code = 'VDMZ47518' AND amount = 450.1 AND currency = 'MZN'; -- Vodacom 450.1 MZN
UPDATE airtime_products SET payer_amount_cents = 1442 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_17.50' AND amount = 499.8 AND currency = 'MZN'; -- Vodacom 499.8 MZN
UPDATE airtime_products SET payer_amount_cents = 1665 WHERE dingconnect_sku_code = 'VDMZ59053' AND amount = 599.9 AND currency = 'MZN'; -- Vodacom 599.9 MZN
UPDATE airtime_products SET payer_amount_cents = 1887 WHERE dingconnect_sku_code = 'VDMZ45708' AND amount = 700 AND currency = 'MZN'; -- Vodacom 700 MZN
UPDATE airtime_products SET payer_amount_cents = 2110 WHERE dingconnect_sku_code = 'VDMZ40783' AND amount = 800.1 AND currency = 'MZN'; -- Vodacom 800.1 MZN
UPDATE airtime_products SET payer_amount_cents = 2333 WHERE dingconnect_sku_code = 'VDMZ9494' AND amount = 900.2 AND currency = 'MZN'; -- Vodacom 900.2 MZN
UPDATE airtime_products SET payer_amount_cents = 2555 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_35.00' AND amount = 1000.3 AND currency = 'MZN'; -- Vodacom 1000.3 MZN
UPDATE airtime_products SET payer_amount_cents = 2999 WHERE dingconnect_sku_code = 'VDMZ34339' AND amount = 1199.8 AND currency = 'MZN'; -- Vodacom 1199.8 MZN
UPDATE airtime_products SET payer_amount_cents = 3667 WHERE dingconnect_sku_code = 'VDMZ28158' AND amount = 1500.1 AND currency = 'MZN'; -- Vodacom 1500.1 MZN
UPDATE airtime_products SET payer_amount_cents = 4113 WHERE dingconnect_sku_code = 'VDMZ16612' AND amount = 1700.3 AND currency = 'MZN'; -- Vodacom 1700.3 MZN
UPDATE airtime_products SET payer_amount_cents = 4334 WHERE dingconnect_sku_code = 'VDMZ39260' AND amount = 1799.7 AND currency = 'MZN'; -- Vodacom 1799.7 MZN
UPDATE airtime_products SET payer_amount_cents = 4779 WHERE dingconnect_sku_code = 'MZ_VD_TopUp_70.00' AND amount = 1999.9 AND currency = 'MZN'; -- Vodacom 1999.9 MZN
UPDATE airtime_products SET payer_amount_cents = 1091 WHERE dingconnect_sku_code = '7FST35497' AND amount = 183.75 AND currency = 'STN'; -- CST 183.75 STN
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = '7FST56894' AND amount = 245 AND currency = 'STN'; -- CST 245 STN
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = '7FST57449' AND amount = 367.5 AND currency = 'STN'; -- CST 367.5 STN
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = '7FST31175' AND amount = 490 AND currency = 'STN'; -- CST 490 STN
UPDATE airtime_products SET payer_amount_cents = 639 WHERE dingconnect_sku_code = 'GW_OR_TopUp_3.00' AND amount = 2000 AND currency = 'XOF'; -- Orange Bissau 2000 XOF
UPDATE airtime_products SET payer_amount_cents = 736 WHERE dingconnect_sku_code = 'ORGWGW17997' AND amount = 2624 AND currency = 'XOF'; -- Orange Bissau 2624 XOF
UPDATE airtime_products SET payer_amount_cents = 838 WHERE dingconnect_sku_code = 'ORGWGW19201' AND amount = 3280 AND currency = 'XOF'; -- Orange Bissau 3280 XOF
UPDATE airtime_products SET payer_amount_cents = 1091 WHERE dingconnect_sku_code = 'GW_OR_TopUp_7.50' AND amount = 4920 AND currency = 'XOF'; -- Orange Bissau 4920 XOF
UPDATE airtime_products SET payer_amount_cents = 1244 WHERE dingconnect_sku_code = 'ORGWGW14652' AND amount = 5904 AND currency = 'XOF'; -- Orange Bissau 5904 XOF
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'ORGWGW21169' AND amount = 6560 AND currency = 'XOF'; -- Orange Bissau 6560 XOF
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'GW_OR_TopUp_15.00' AND amount = 9840 AND currency = 'XOF'; -- Orange Bissau 9840 XOF
UPDATE airtime_products SET payer_amount_cents = 2259 WHERE dingconnect_sku_code = 'ORGWGW97137' AND amount = 12464 AND currency = 'XOF'; -- Orange Bissau 12464 XOF
UPDATE airtime_products SET payer_amount_cents = 2361 WHERE dingconnect_sku_code = 'ORGWGW46795' AND amount = 13120 AND currency = 'XOF'; -- Orange Bissau 13120 XOF
UPDATE airtime_products SET payer_amount_cents = 3376 WHERE dingconnect_sku_code = 'GW_OR_TopUp_30.00' AND amount = 19680 AND currency = 'XOF'; -- Orange Bissau 19680 XOF
