-- Os stripe_price_id gravados em V17 foram criados numa conta Stripe em modo de teste e nao
-- existem na conta live (checkout falha com "No such price"). Em vez de recriar 144 Price
-- objects na Stripe, limpa-se a coluna: OrderService ja tem um caminho alternativo que cria a
-- price_data inline em cada Checkout Session, usando payer_amount_cents (que fica intacto e
-- continua a ser o valor real e ja calculado, validado no backend).
UPDATE airtime_products SET stripe_price_id = NULL;
