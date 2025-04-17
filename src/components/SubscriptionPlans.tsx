import React, { useState, useEffect } from 'react';
import { Crown, Check, CreditCard, Shield, Award, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../hooks/useStripe';
import { stripeProducts } from '../stripe-config';

interface SubscriptionPlansProps {
  onClose: () => void;
}

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { createCheckoutSession, isLoading, error } = useStripe();

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // Determine which product to use based on selected plan
      const productKey = selectedPlan === 'monthly' ? 'monthlySubscription' : 'yearlySubscription';
      
      // Get the current URL for success and cancel URLs
      const baseUrl = window.location.origin;
      const successUrl = `${baseUrl}/subscription-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/subscription-cancel`;
      
      // Create checkout session and redirect to Stripe
      await createCheckoutSession(
        productKey,
        successUrl,
        cancelUrl
      );
      
      // Note: The redirect happens in the createCheckoutSession function
    } catch (error) {
      console.error('Error processing subscription:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Crown className="text-yellow-500 mr-2" size={24} />
              Planos Premium
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h3 className="text-xl font-medium mb-2">Eleve sua experiência de viagem</h3>
            <p className="text-gray-600">Tenha acesso a ofertas exclusivas e economize ainda mais em suas viagens</p>
          </div>
          
          {/* Seletor de Planos */}
          <div className="max-w-sm mx-auto bg-gray-100 p-1 rounded-full flex mb-8">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                selectedPlan === 'monthly' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setSelectedPlan('annual')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition relative ${
                selectedPlan === 'annual' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                -20%
              </span>
            </button>
          </div>
          
          {/* Cards de Planos */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Plano Free */}
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">Plano Gratuito</h3>
              <p className="text-gray-600 mb-4">Acesso básico a promoções de passagens</p>
              
              <div className="text-3xl font-bold mb-6">
                R$ 0
                <span className="text-sm font-normal text-gray-500">/mês</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso a promoções do plano gratuito</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Alertas de promoções semanais</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Sem acesso a promoções premium</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Sem alertas em tempo real</span>
                </li>
              </ul>
              
              <button
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium"
                disabled
              >
                Plano Atual
              </button>
            </div>
            
            {/* Plano Premium */}
            <div className="border-2 border-brand-purple rounded-xl p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                Recomendado
              </div>
              
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Crown size={18} className="text-yellow-500 mr-2" />
                Plano Premium
              </h3>
              <p className="text-gray-600 mb-4">Acesso completo a todas as promoções exclusivas</p>
              
              <div className="text-3xl font-bold mb-2 text-brand-purple">
                {selectedPlan === 'monthly' ? 'R$ 29,90' : 'R$ 290,00'}
                <span className="text-sm font-normal text-gray-500">/{selectedPlan === 'monthly' ? 'mês' : 'ano'}</span>
              </div>
              
              {selectedPlan === 'annual' && (
                <div className="mb-4 text-green-600 text-sm">
                  Economia de R$ 68,80 por ano (20% de desconto)
                </div>
              )}
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso a <strong>todas</strong> as promoções, incluindo exclusivas</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Alertas instantâneos de promoções relâmpago</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Ofertas com milhas exclusivas para membros premium</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Suporte prioritário para remarcações e cancelamentos</span>
                </li>
              </ul>
              
              <button
                onClick={handleSubscribe}
                disabled={isProcessing || isLoading}
                className="w-full bg-brand-purple hover:bg-brand-dark text-white py-2 rounded-lg font-medium transition flex items-center justify-center"
              >
                {isProcessing || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} className="mr-2" />
                    Assinar Agora
                  </>
                )}
              </button>
              
              {error && (
                <div className="mt-3 text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="flex items-start">
              <Shield className="text-gray-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium">Pagamento Seguro</h4>
                <p className="text-sm text-gray-600">Todas as transações são protegidas com a mais alta segurança e criptografia.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Award className="text-gray-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium">Garantia de Satisfação</h4>
                <p className="text-sm text-gray-600">Se não estiver satisfeito, cancelamento sem compromisso nos primeiros 7 dias.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Zap className="text-gray-600 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium">Ativação Instantânea</h4>
                <p className="text-sm text-gray-600">Acesso imediato a todas as vantagens premium após a confirmação do pagamento.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;