-- Guine Equatorial e Timor-Leste nao tem nenhuma operadora de telecom real na DingConnect
-- (ver V13). Em vez de os manter como COMING_SOON, removem-se por completo: a LusoTop passa
-- a listar apenas os paises com cobertura de operadora 100% real.
DELETE FROM countries WHERE iso_code IN ('GQ', 'TL');
