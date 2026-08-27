-- Aplica a mesma margem fixa de 3 EUR (V25) aos restantes 126 produtos (todos exceto os 18 de
-- Angola/AOA, ja tratados em V25). A base de custo depende do tipo de moeda:
--
--   EUR (produtos "range" e o fixo da Lycamobile): o valor em EUR e exatamente o SendValue
--     enviado a DingConnect -- usa-lo diretamente como custo nunca subestima (ignora qualquer
--     desconto de distribuidor que a DingConnect nos possa dar, o que so torna a margem real
--     maior, nunca menor).
--
--   XOF e STN: paridades fixas oficiais com o EUR (655.957 e 24.5 respetivamente, fixadas por
--     tratado, nao sao estimativa) -- custo_eur = valor_local / paridade.
--
--   BRL e MZN: sem paridade fixa nem preco a retalho real verificado (ao contrario de AOA em
--     V23/V25). Usa-se a taxa de cambio de mercado ao vivo (consultada em 2026-08-27) multiplicada
--     por 1.63 -- o mesmo fator de seguranca observado entre o preco a retalho real da DingConnect
--     e a taxa de mercado pura no unico corredor ja verificado (AOA). E uma extrapolacao razoavel,
--     nao uma medicao direta destes dois corredores -- fica sujeita a confirmacao se, no futuro,
--     houver acesso a precos reais da DingConnect para BRL/MZN tambem.
--
-- Formula: preco = (custo_eur + 3.00 + 0.25) / (1 - 0.015)

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
UPDATE airtime_products SET payer_amount_cents = 838 WHERE dingconnect_sku_code = 'VUCVCV1083' AND amount = 5 AND currency = 'EUR'; -- Alou 5 EUR
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'VUCVCV1083' AND amount = 10 AND currency = 'EUR'; -- Alou 10 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'VUCVCV1083' AND amount = 15 AND currency = 'EUR'; -- Alou 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'VUCVCV1083' AND amount = 20 AND currency = 'EUR'; -- Alou 20 EUR
UPDATE airtime_products SET payer_amount_cents = 838 WHERE dingconnect_sku_code = 'PT_LY_TopUp_5.00' AND amount = 5 AND currency = 'EUR'; -- Lycamobile 5 EUR
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'PT_LY_TopUp_10.00' AND amount = 10 AND currency = 'EUR'; -- Lycamobile 10 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'PT_LY_TopUp_15.00' AND amount = 15 AND currency = 'EUR'; -- Lycamobile 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'PT_LY_TopUp_20.00' AND amount = 20 AND currency = 'EUR'; -- Lycamobile 20 EUR
UPDATE airtime_products SET payer_amount_cents = 838 WHERE dingconnect_sku_code = 'MKMZMZ72945' AND amount = 5 AND currency = 'EUR'; -- mCel 5 EUR
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'MKMZMZ72945' AND amount = 10 AND currency = 'EUR'; -- mCel 10 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'MKMZMZ72945' AND amount = 15 AND currency = 'EUR'; -- mCel 15 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'PT_MU_TopUp' AND amount = 15 AND currency = 'EUR'; -- MEO 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'PT_MU_TopUp' AND amount = 20 AND currency = 'EUR'; -- MEO 20 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'PT_MW_TopUp' AND amount = 15 AND currency = 'EUR'; -- Moche 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'PT_MW_TopUp' AND amount = 20 AND currency = 'EUR'; -- Moche 20 EUR
UPDATE airtime_products SET payer_amount_cents = 838 WHERE dingconnect_sku_code = 'GW_MT_TopUp' AND amount = 5 AND currency = 'EUR'; -- MTN Guiné-Bissau 5 EUR
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'GW_MT_TopUp' AND amount = 10 AND currency = 'EUR'; -- MTN Guiné-Bissau 10 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'GW_MT_TopUp' AND amount = 15 AND currency = 'EUR'; -- MTN Guiné-Bissau 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'GW_MT_TopUp' AND amount = 20 AND currency = 'EUR'; -- MTN Guiné-Bissau 20 EUR
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'PT_NO_TopUp' AND amount = 10 AND currency = 'EUR'; -- NOS 10 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'PT_NO_TopUp' AND amount = 15 AND currency = 'EUR'; -- NOS 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'PT_NO_TopUp' AND amount = 20 AND currency = 'EUR'; -- NOS 20 EUR
UPDATE airtime_products SET payer_amount_cents = 838 WHERE dingconnect_sku_code = 'U2CVCV21755' AND amount = 5 AND currency = 'EUR'; -- Unitel T+ 5 EUR
UPDATE airtime_products SET payer_amount_cents = 1345 WHERE dingconnect_sku_code = 'U2CVCV21755' AND amount = 10 AND currency = 'EUR'; -- Unitel T+ 10 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'U2CVCV21755' AND amount = 15 AND currency = 'EUR'; -- Unitel T+ 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'U2CVCV21755' AND amount = 20 AND currency = 'EUR'; -- Unitel T+ 20 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'PT_UZ_TopUp' AND amount = 15 AND currency = 'EUR'; -- UZO 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'PT_UZ_TopUp' AND amount = 20 AND currency = 'EUR'; -- UZO 20 EUR
UPDATE airtime_products SET payer_amount_cents = 1853 WHERE dingconnect_sku_code = 'PT_VF_TopUp' AND amount = 15 AND currency = 'EUR'; -- Vodafone 15 EUR
UPDATE airtime_products SET payer_amount_cents = 2360 WHERE dingconnect_sku_code = 'PT_VF_TopUp' AND amount = 20 AND currency = 'EUR'; -- Vodafone 20 EUR
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
