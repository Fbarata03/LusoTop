-- Operadoras DEMO para Angola (unico pais ACTIVE nesta fase).
-- Marcadas claramente como demo: sem integracao real com nenhum fornecedor de airtime ainda.
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Unitel', 'UNITEL_AO', TRUE, 'DEMO_UNITEL', 100, 20000
FROM countries WHERE iso_code = 'AO';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Movicel', 'MOVICEL_AO', TRUE, 'DEMO_MOVICEL', 100, 20000
FROM countries WHERE iso_code = 'AO';
