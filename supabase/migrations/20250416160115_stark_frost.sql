/*
  # Atualização de políticas de acesso para promoções

  1. Alterações
    - Atualiza políticas de acesso para promoções
    - Restringe visualização apenas para usuários autenticados
    - Implementa controle de acesso para promoções premium
    
  2. Segurança
    - Mantém RLS habilitado em todas as tabelas
    - Atualiza políticas para garantir acesso apropriado
*/

-- Remover políticas existentes de promoções de forma segura
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'promotions' 
        AND policyname = 'Anyone can view non-premium promotions'
    ) THEN
        DROP POLICY "Anyone can view non-premium promotions" ON promotions;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'promotions' 
        AND policyname = 'Premium users can view all promotions'
    ) THEN
        DROP POLICY "Premium users can view all promotions" ON promotions;
    END IF;
END
$$;

-- Criar novas políticas de promoções
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'promotions' 
        AND policyname = 'Authenticated users can view non-premium promotions'
    ) THEN
        CREATE POLICY "Authenticated users can view non-premium promotions"
            ON promotions
            FOR SELECT
            TO authenticated
            USING (NOT is_premium);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'promotions' 
        AND policyname = 'Premium users can view all promotions'
    ) THEN
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
    END IF;
END
$$;