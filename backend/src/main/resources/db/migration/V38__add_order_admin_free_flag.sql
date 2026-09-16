-- Marca pedidos enviados gratuitamente pela conta admin (sem checkout Stripe), para
-- distinguir de recargas pagas no historico "Minhas recargas" e em relatorios.
ALTER TABLE orders ADD COLUMN admin_free BOOLEAN NOT NULL DEFAULT FALSE;
