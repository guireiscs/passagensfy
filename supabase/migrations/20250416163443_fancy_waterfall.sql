/*
  # Atualização do esquema de promoções

  1. Alterações
    - Adiciona coluna `title` para título da promoção
    - Adiciona coluna `trip_type` para indicar se é ida e volta, só ida ou só volta
    - Adiciona coluna `travel_class` para indicar a classe da viagem (econômica, executiva, etc.)
    - Marca algumas colunas como não utilizadas mas mantidas por compatibilidade
    
  2. Segurança
    - Mantém RLS habilitado em todas as tabelas
*/

-- Adicionar novas colunas à tabela de promoções
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS trip_type TEXT DEFAULT 'round_trip' NOT NULL; -- 'round_trip', 'one_way' ou 'return_only'
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS travel_class TEXT DEFAULT 'economy' NOT NULL; -- 'economy', 'business', 'first_class', etc.

-- Preencher títulos para promoções existentes
UPDATE promotions SET 
  title = 'Promoção: ' || "from" || ' para ' || "to", 
  trip_type = 'round_trip',
  travel_class = 'economy'
WHERE title IS NULL;

-- Atualizar valores das promoções existentes
UPDATE promotions SET
  title = 'Passagens para o Rio de Janeiro com desconto',
  travel_class = 'economy'
WHERE "to" = 'Rio de Janeiro';

UPDATE promotions SET
  title = 'Fortaleza com preços imperdíveis',
  travel_class = 'economy'
WHERE "to" = 'Fortaleza';

UPDATE promotions SET
  title = 'Conheça o paraíso de Fernando de Noronha',
  travel_class = 'premium_economy'
WHERE "to" = 'Fernando de Noronha';

UPDATE promotions SET
  title = 'Lisboa com a melhor tarifa do ano',
  travel_class = 'business'
WHERE "to" = 'Lisboa';

UPDATE promotions SET
  title = 'Nova York em oferta exclusiva',
  travel_class = 'economy'
WHERE "to" = 'Nova York';

UPDATE promotions SET
  title = 'Miami com suas melhores milhas',
  travel_class = 'premium_economy'
WHERE "to" = 'Miami';

UPDATE promotions SET
  title = 'Paris no melhor período do ano',
  travel_class = 'business'
WHERE "to" = 'Paris';