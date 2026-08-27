-- Os produtos DATA e VOICE inseridos em V14 sao "ilustrativos" (ver comentario dessa
-- migration) e nunca foram ligados a um SKU real da DingConnect em V18 -- so os 144 AIRTIME
-- o foram. Continuavam active=TRUE, por isso apareciam como selecionaveis no wizard (separadores
-- "Dados"/"Voz") apesar de a entrega falhar sempre (sem dingconnect_sku_code) e o pagamento ser
-- reembolsado automaticamente a seguir. Desativa-se qualquer produto sem SKU real associado.
UPDATE airtime_products SET active = FALSE WHERE dingconnect_sku_code IS NULL;
