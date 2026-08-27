-- Quando a entrega DingConnect falha depois do pagamento Stripe ja confirmado, o pedido e
-- reembolsado automaticamente -- guarda-se aqui o resultado desse reembolso para auditoria.
ALTER TABLE orders ADD COLUMN refunded BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN stripe_refund_id VARCHAR(200);
