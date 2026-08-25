-- Rotulo legivel para produtos de dados/voz (ex. "1 GB", "150 min").
-- Nulo para AIRTIME, onde o valor (amount+currency) ja e autoexplicativo.
ALTER TABLE airtime_products ADD COLUMN label VARCHAR(50);
