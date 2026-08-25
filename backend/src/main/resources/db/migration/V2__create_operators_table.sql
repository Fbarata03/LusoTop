CREATE TABLE operators (
    id BIGSERIAL PRIMARY KEY,
    country_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    logo_url VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    provider_code VARCHAR(50),
    min_amount NUMERIC(12, 2),
    max_amount NUMERIC(12, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT fk_operators_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT uq_operators_country_code UNIQUE (country_id, code)
);

CREATE INDEX idx_operators_country_id ON operators (country_id);
CREATE INDEX idx_operators_active ON operators (active);
