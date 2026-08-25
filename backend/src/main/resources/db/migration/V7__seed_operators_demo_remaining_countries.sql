-- Operadoras DEMO para os restantes 8 paises da CPLP.
-- Nomes de operadoras reais de cada mercado sao usados apenas como rotulo realista;
-- o provider_code com prefixo DEMO_ deixa claro que nao ha integracao real com nenhum
-- fornecedor de airtime (mesmo padrao ja usado para Angola em V5).
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'MEO', 'MEO_PT', TRUE, 'DEMO_MEO', 5, 50 FROM countries WHERE iso_code = 'PT';
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Vodafone', 'VODAFONE_PT', TRUE, 'DEMO_VODAFONE', 5, 50 FROM countries WHERE iso_code = 'PT';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Vivo', 'VIVO_BR', TRUE, 'DEMO_VIVO', 10, 200 FROM countries WHERE iso_code = 'BR';
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Claro', 'CLARO_BR', TRUE, 'DEMO_CLARO', 10, 200 FROM countries WHERE iso_code = 'BR';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'CVMóvel', 'CVMOVEL_CV', TRUE, 'DEMO_CVMOVEL', 100, 5000 FROM countries WHERE iso_code = 'CV';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Orange Bissau', 'ORANGE_GW', TRUE, 'DEMO_ORANGE', 500, 20000 FROM countries WHERE iso_code = 'GW';
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'MTN Guiné-Bissau', 'MTN_GW', TRUE, 'DEMO_MTN', 500, 20000 FROM countries WHERE iso_code = 'GW';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'GETESA', 'GETESA_GQ', TRUE, 'DEMO_GETESA', 1000, 30000 FROM countries WHERE iso_code = 'GQ';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Vodacom', 'VODACOM_MZ', TRUE, 'DEMO_VODACOM', 50, 5000 FROM countries WHERE iso_code = 'MZ';
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'mCel', 'MCEL_MZ', TRUE, 'DEMO_MCEL', 50, 5000 FROM countries WHERE iso_code = 'MZ';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'CST', 'CST_ST', TRUE, 'DEMO_CST', 10, 1000 FROM countries WHERE iso_code = 'ST';

INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Telkomcel', 'TELKOMCEL_TL', TRUE, 'DEMO_TELKOMCEL', 1, 50 FROM countries WHERE iso_code = 'TL';
INSERT INTO operators (country_id, name, code, active, provider_code, min_amount, max_amount)
SELECT id, 'Telemor', 'TELEMOR_TL', TRUE, 'DEMO_TELEMOR', 1, 50 FROM countries WHERE iso_code = 'TL';
