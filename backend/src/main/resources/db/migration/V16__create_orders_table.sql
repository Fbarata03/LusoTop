-- Guarda cada pedido de recarga que chega ao pagamento. O valor efetivamente cobrado
-- (payer_amount/payer_currency) e sempre calculado no backend a partir da taxa de cambio
-- no momento da criacao do pedido -- nunca confiado a partir do cliente.
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    country_id BIGINT NOT NULL,
    operator_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    product_amount NUMERIC(12, 2) NOT NULL,
    product_currency VARCHAR(3) NOT NULL,
    payer_amount NUMERIC(12, 2) NOT NULL,
    payer_currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    stripe_checkout_session_id VARCHAR(200) UNIQUE,
    stripe_payment_intent_id VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_orders_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT fk_orders_operator FOREIGN KEY (operator_id) REFERENCES operators (id),
    CONSTRAINT fk_orders_product FOREIGN KEY (product_id) REFERENCES airtime_products (id)
);

CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_stripe_session ON orders (stripe_checkout_session_id);
