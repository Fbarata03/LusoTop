CREATE TABLE airtime_products (
    id BIGSERIAL PRIMARY KEY,
    operator_id BIGINT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'AIRTIME',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_products_operator FOREIGN KEY (operator_id) REFERENCES operators (id)
);

CREATE INDEX idx_products_operator_id ON airtime_products (operator_id);
CREATE INDEX idx_products_active ON airtime_products (active);
