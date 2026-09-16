-- Para pedidos admin_free (payer_amount = 0), guarda o valor real que a recarga custaria a um
-- cliente normal -- sem isto perdia-se essa informacao para sempre no historico/relatorios.
ALTER TABLE orders ADD COLUMN real_payer_amount NUMERIC(12,2);
