-- Estado de entrega da recarga, separado do estado de pagamento: um pagamento pode ficar
-- PAID no Stripe mas a entrega (SendTransfer da DingConnect) falhar -- nesse caso o pedido
-- e reembolsado automaticamente e delivery_status fica FAILED.
ALTER TABLE orders ADD COLUMN delivery_status VARCHAR(20) NOT NULL DEFAULT 'PENDING';
ALTER TABLE orders ADD COLUMN dingconnect_transfer_ref VARCHAR(100);
ALTER TABLE orders ADD COLUMN delivery_error VARCHAR(500);
