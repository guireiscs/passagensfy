/*
  # Initial database schema for passagensfy

  1. New Tables
    - `profiles`
      - Stores user profile data linked to auth.users
      - Contains premium subscription status
    - `promotions`
      - Stores flight promotions data
      - Has premium/regular promotion flag
    - `bookmarks`
      - Stores user's saved promotions

  2. Security
    - Enable RLS on all tables
    - Create policies for secure data access
*/

-- Create profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  premium_expires_at TIMESTAMPTZ,
  phone TEXT
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  "from" TEXT NOT NULL,
  "to" TEXT NOT NULL,
  price INT NOT NULL,
  miles INT,
  airline TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  return_date TEXT NOT NULL,
  image_url TEXT NOT NULL,
  discount INT NOT NULL,
  expires_in TEXT NOT NULL,
  is_premium BOOLEAN DEFAULT false NOT NULL,
  payment_type TEXT NOT NULL,
  departure_time TEXT,
  return_time TEXT,
  passengers INT DEFAULT 1,
  baggage TEXT,
  stopover TEXT,
  flight_duration TEXT,
  description TEXT,
  terms TEXT[],
  user_id UUID REFERENCES auth.users(id)
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  promotion_id BIGINT NOT NULL REFERENCES promotions(id),
  UNIQUE(user_id, promotion_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Promotions policies
CREATE POLICY "Anyone can view non-premium promotions"
  ON promotions
  FOR SELECT
  USING (NOT is_premium OR auth.role() = 'authenticated');

CREATE POLICY "Premium users can view all promotions"
  ON promotions
  FOR SELECT
  TO authenticated
  USING (
    NOT is_premium OR (
      is_premium AND EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid() AND is_premium = true
      )
    )
  );

-- Bookmarks policies
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample data for promotions
INSERT INTO promotions (
  "from", "to", price, airline, departure_date, return_date, 
  image_url, discount, expires_in, is_premium, payment_type,
  departure_time, return_time, stopover, flight_duration, baggage, description
)
VALUES
(
  'São Paulo', 'Rio de Janeiro', 299, 'LATAM', '15/06/2025', '20/06/2025',
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  40, '2 dias', false, 'cash', '08:30', '19:45', 'Voo direto', '1h 20min',
  'Uma bagagem de mão (10kg)', 'Aproveite esta promoção exclusiva para viajar de São Paulo ao Rio de Janeiro com a LATAM.'
),
(
  'São Paulo', 'Fortaleza', 799, 'GOL', '10/07/2025', '17/07/2025',
  'https://images.unsplash.com/photo-1590060766050-321465be782a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  30, '5 dias', false, 'cash', '10:15', '13:25', 'Voo direto', '3h 10min',
  'Uma bagagem de mão (10kg)', 'Fortaleza com desconto especial, voo direto saindo de Guarulhos.'
),
(
  'Rio de Janeiro', 'Fernando de Noronha', 1299, 'Azul', '05/08/2025', '12/08/2025',
  'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  25, '3 dias', true, 'cash', '07:45', '10:30', '1 conexão em Recife', '4h 45min',
  'Uma bagagem de mão (10kg)', 'Promoção especial para o Paraíso, aproveite esta chance única para Noronha!'
),
(
  'São Paulo', 'Lisboa', 2799, 'TAP', '10/09/2025', '25/09/2025',
  'https://images.unsplash.com/photo-1558370781-d6196949e317?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  20, '7 dias', true, 'cash', '22:30', '14:15', 'Voo direto', '9h 45min',
  'Uma bagagem de mão (10kg) e uma bagagem despachada (23kg)', 'A melhor oferta para Lisboa! Voo direto durante a melhor época do ano.'
),
(
  'Rio de Janeiro', 'Nova York', 3299, 'American Airlines', '15/10/2025', '30/10/2025',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  15, '10 dias', false, 'cash', '21:15', '05:30', 'Voo direto', '9h 15min',
  'Uma bagagem de mão (10kg) e uma bagagem despachada (23kg)', 'Nova York com preço incrível, voo direto e temporada excelente!'
),
(
  'São Paulo', 'Miami', 0, 'LATAM', '12/07/2025', '19/07/2025',
  'https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  30, '4 dias', false, 'miles', '09:30', '17:45', 'Voo direto', '8h 15min',
  'Uma bagagem de mão (10kg) e uma bagagem despachada (23kg)', 'Use suas milhas de forma inteligente nesta promoção para Miami!'
),
(
  'São Paulo', 'Paris', 0, 'Air France', '05/09/2025', '20/09/2025',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  25, '8 dias', true, 'miles', '23:45', '16:20', 'Voo direto', '11h 35min',
  'Uma bagagem de mão (12kg) e duas bagagens despachadas (23kg cada)', 'Paris em setembro é incrível! Aproveite esta oferta exclusiva com milhas.'
);

-- Update miles for the miles-based promotions
UPDATE promotions SET miles = 75000 WHERE payment_type = 'miles' AND "to" = 'Miami';
UPDATE promotions SET miles = 120000 WHERE payment_type = 'miles' AND "to" = 'Paris';