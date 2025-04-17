import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { stripeProducts } from '../stripe-config';

export function useStripe() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (
    productKey: keyof typeof stripeProducts,
    successUrl: string,
    cancelUrl: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const product = stripeProducts[productKey];
      if (!product) {
        throw new Error('Produto não encontrado');
      }

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Você precisa estar logado para fazer uma assinatura');
      }

      if (!sessionData.session) {
        throw new Error('Sessão não encontrada');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
          body: JSON.stringify({
            price_id: product.priceId,
            success_url: successUrl,
            cancel_url: cancelUrl,
            mode: product.mode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar sessão de checkout');
      }

      const { url } = await response.json();
      
      if (!url) {
        throw new Error('URL de checkout não encontrada');
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar sessão de checkout:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao processar pagamento');
      return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserSubscription = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        return { data: null, error: 'Usuário não autenticado' };
      }

      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar assinatura:', error);
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      console.error('Erro ao buscar assinatura:', err);
      return { data: null, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  return {
    createCheckoutSession,
    getUserSubscription,
    isLoading,
    error
  };
}