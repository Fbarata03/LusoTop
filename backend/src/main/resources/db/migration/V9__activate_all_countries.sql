-- Todos os 9 paises da CPLP passam a ACTIVE: a partir de agora o fluxo de recarga
-- (wizard completo) funciona em modo simulacao para qualquer um deles, com operadoras
-- e valores demo (ver V7/V8). Continua sem qualquer fornecedor real de pagamento ou
-- airtime ligado -- nenhuma recarga real e enviada em nenhum pais.
UPDATE countries SET active = TRUE, status = 'ACTIVE' WHERE status = 'COMING_SOON';
