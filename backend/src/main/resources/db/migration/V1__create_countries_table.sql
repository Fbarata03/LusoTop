CREATE TABLE countries (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    iso_code VARCHAR(2) NOT NULL,
    phone_code VARCHAR(5) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    currency_symbol VARCHAR(5) NOT NULL,
    flag_emoji VARCHAR(8) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'COMING_SOON',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_countries_iso_code UNIQUE (iso_code),
    CONSTRAINT chk_countries_status CHECK (status IN ('ACTIVE', 'COMING_SOON', 'DISABLED'))
);

CREATE INDEX idx_countries_status ON countries (status);
