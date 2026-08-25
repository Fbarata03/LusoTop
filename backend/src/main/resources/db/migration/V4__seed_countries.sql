-- Os 9 Estados-Membros da CPLP.
-- Apenas Angola entra como ACTIVE nesta fase (tem operadoras/produtos demo associados).
-- Os restantes entram como COMING_SOON: nao ha integracao real ainda, nao se deve
-- apresentar "Disponivel" sem uma integracao efetiva (ver secao 35 da especificacao).
INSERT INTO countries (name, iso_code, phone_code, currency_code, currency_symbol, flag_emoji, active, status) VALUES
    ('Angola', 'AO', '+244', 'AOA', 'Kz', '🇦🇴', TRUE, 'ACTIVE'),
    ('Portugal', 'PT', '+351', 'EUR', '€', '🇵🇹', FALSE, 'COMING_SOON'),
    ('Brasil', 'BR', '+55', 'BRL', 'R$', '🇧🇷', FALSE, 'COMING_SOON'),
    ('Cabo Verde', 'CV', '+238', 'CVE', '$', '🇨🇻', FALSE, 'COMING_SOON'),
    ('Guiné-Bissau', 'GW', '+245', 'XOF', 'XOF', '🇬🇼', FALSE, 'COMING_SOON'),
    ('Guiné Equatorial', 'GQ', '+240', 'XAF', 'XAF', '🇬🇶', FALSE, 'COMING_SOON'),
    ('Moçambique', 'MZ', '+258', 'MZN', 'MT', '🇲🇿', FALSE, 'COMING_SOON'),
    ('São Tomé e Príncipe', 'ST', '+239', 'STN', 'Db', '🇸🇹', FALSE, 'COMING_SOON'),
    ('Timor-Leste', 'TL', '+670', 'USD', '$', '🇹🇱', FALSE, 'COMING_SOON');
