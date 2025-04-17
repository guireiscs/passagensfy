export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: Record<string, StripeProduct> = {
  monthlySubscription: {
    priceId: 'price_1QLqi8LwpTtdjQT7bk0vZbNO',
    name: 'Assinatura Mensal',
    description: 'Acesso a todas as promoções exclusivas por R$29,90 por mês',
    mode: 'subscription'
  },
  yearlySubscription: {
    priceId: 'price_1QLqiSLwpTtdjQT73snAdsJz',
    name: 'Assinatura Anual',
    description: 'Acesso a todas as promoções exclusivas por R$290,00 por ano (economia de 20%)',
    mode: 'subscription'
  }
};