-- Substitui as operadoras DEMO pelo catalogo real de operadoras de telecom disponiveis na
-- DingConnect (fornecedor de airtime) para os paises da CPLP com cobertura confirmada.
-- provider_code passa a ser o codigo real de operadora na DingConnect; logo_url aponta para
-- o CDN oficial da DingConnect (imagerepo.ding.com). Guine Equatorial e Timor-Leste nao tem
-- nenhuma operadora de telecom real na DingConnect (apenas um produto generico de recarga
-- internacional), por isso passam a COMING_SOON em vez de anunciar operadoras sem fornecedor.

DELETE FROM airtime_products WHERE operator_id IN (
    SELECT o.id FROM operators o
    JOIN countries c ON c.id = o.country_id
    WHERE c.iso_code IN ('AO', 'BR', 'CV', 'MZ', 'PT', 'GQ', 'TL')
);
DELETE FROM operators WHERE country_id IN (
    SELECT id FROM countries WHERE iso_code IN ('AO', 'BR', 'CV', 'MZ', 'PT', 'GQ', 'TL')
);

-- Angola
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Unitel', 'UNITEL_AO', 'https://imagerepo.ding.com/logo/9BDF1D/AO.png', TRUE, '9BDF1DAO', 100, 20000
FROM countries WHERE iso_code = 'AO';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Movicel', 'MOVICEL_AO', 'https://imagerepo.ding.com/logo/93A865/AO.png', TRUE, '93A865AO', 100, 20000
FROM countries WHERE iso_code = 'AO';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Africell', 'AFRICELL_AO', 'https://imagerepo.ding.com/logo/C07B28/AO.png', TRUE, 'C07B28AO', 100, 20000
FROM countries WHERE iso_code = 'AO';

-- Brasil
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Claro', 'CLARO_BR', 'https://imagerepo.ding.com/logo/CL/BR.png', TRUE, 'CLBR', 10, 200
FROM countries WHERE iso_code = 'BR';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Tim', 'TIM_BR', 'https://imagerepo.ding.com/logo/IM/BR.png', TRUE, 'IMBR', 10, 200
FROM countries WHERE iso_code = 'BR';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Vivo', 'VIVO_BR', 'https://imagerepo.ding.com/logo/VO/BR.png', TRUE, 'VOBR', 10, 200
FROM countries WHERE iso_code = 'BR';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Algar Telecom', 'ALGAR_BR', 'https://imagerepo.ding.com/logo/215028/BR.png', TRUE, '215028BR', 10, 200
FROM countries WHERE iso_code = 'BR';

-- Cabo Verde
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Unitel T+', 'UNITELT_CV', 'https://imagerepo.ding.com/logo/U2/CV.png', TRUE, 'U2CV', 100, 5000
FROM countries WHERE iso_code = 'CV';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Alou', 'ALOU_CV', 'https://imagerepo.ding.com/logo/VU/CV.png', TRUE, 'VUCV', 100, 5000
FROM countries WHERE iso_code = 'CV';

-- Mocambique
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Vodacom', 'VODACOM_MZ', 'https://imagerepo.ding.com/logo/VD/MZ.png', TRUE, 'VDMZ', 50, 5000
FROM countries WHERE iso_code = 'MZ';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Movitel', 'MOVITEL_MZ', 'https://imagerepo.ding.com/logo/1G/MZ.png', TRUE, '1GMZ', 50, 5000
FROM countries WHERE iso_code = 'MZ';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'mCel', 'MCEL_MZ', 'https://imagerepo.ding.com/logo/MK/MZ.png', TRUE, 'MKMZ', 50, 5000
FROM countries WHERE iso_code = 'MZ';

-- Portugal
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'MEO', 'MEO_PT', 'https://imagerepo.ding.com/logo/MU/PT.png', TRUE, 'MUPT', 5, 50
FROM countries WHERE iso_code = 'PT';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Vodafone', 'VODAFONE_PT', 'https://imagerepo.ding.com/logo/VF/PT.png', TRUE, 'VFPT', 5, 50
FROM countries WHERE iso_code = 'PT';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'NOS', 'NOS_PT', 'https://imagerepo.ding.com/logo/NO/PT.png', TRUE, 'NOPT', 5, 50
FROM countries WHERE iso_code = 'PT';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Moche', 'MOCHE_PT', 'https://imagerepo.ding.com/logo/MW/PT.png', TRUE, 'MWPT', 5, 50
FROM countries WHERE iso_code = 'PT';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'UZO', 'UZO_PT', 'https://imagerepo.ding.com/logo/UZ/PT.png', TRUE, 'UZPT', 5, 50
FROM countries WHERE iso_code = 'PT';
INSERT INTO operators (country_id, name, code, logo_url, active, provider_code, min_amount, max_amount)
SELECT id, 'Lycamobile', 'LYCAMOBILE_PT', 'https://imagerepo.ding.com/logo/LY/PT.png', TRUE, 'LYPT', 5, 50
FROM countries WHERE iso_code = 'PT';

-- Guine-Bissau e Sao Tome e Principe: ja tinham as operadoras corretas, so atualiza o
-- provider_code e o logo para os valores reais da DingConnect.
UPDATE operators SET provider_code = 'MTGW', logo_url = 'https://imagerepo.ding.com/logo/MT/GW.png' WHERE code = 'MTN_GW';
UPDATE operators SET provider_code = 'ORGW', logo_url = 'https://imagerepo.ding.com/logo/OR/GW.png' WHERE code = 'ORANGE_GW';
UPDATE operators SET provider_code = '7FST', logo_url = 'https://imagerepo.ding.com/logo/7F/ST.png' WHERE code = 'CST_ST';

-- Guine Equatorial e Timor-Leste: sem operadora real na DingConnect, passam a "Em breve".
UPDATE countries SET active = FALSE, status = 'COMING_SOON' WHERE iso_code IN ('GQ', 'TL');
