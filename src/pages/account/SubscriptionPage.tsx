import React, { useEffect, useState } from 'react';
import { Crown, Check, CreditCard, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStripe } from '../../hooks/useStripe';

const SubscriptionPage: React.FC = () => {
  const { profile } = useAuth();
  const { getUserSubscription, isLoading } = useStripe();
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      const { data } = await getUserSubscription();
      setSubscription(data);
    };

    fetchSubscription();
  }, []);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('pt-BR');
  };

  const isPremium = profile?.is_premium || 
    (subscription && (subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing'));

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Assinatura</h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
        </div>
      ) : isPremium ? (
        <div>
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center">
                  <Crown size={20} className="text-yellow-400 mr-2" />
                  <h3 className="text-lg font-semibold">Plano Premium</h3>
                </div>
                <p className="text-gray-300 mt-1">Acesso a todas as promoções exclusivas</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {subscription?.price_id === 'price_1QLqi8LwpTtdjQT7bk0vZbNO' ? 'R$ 29,90/mês' : 'R$ 290,00/ano'}
                </div>
                <div className="text-gray-300 text-sm">
                  Próxima cobrança: {subscription?.current_period_end ? formatDate(subscription.current_period_end) : 'N/A'}
                </div>
              </div>
            </div>
            
            {subscription?.payment_method_last4 && (
              <div className="border-t border-gray-700 pt-4 mt-4">
                <div className="flex items-center">
                  <CreditCard size={18} className="mr-2 text-gray-300" />
                  <span>•••• •••• •••• {subscription.payment_method_last4}</span>
                  {subscription.payment_method_brand && (
                    <span className="ml-2 capitalize">{subscription.payment_method_brand}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Benefícios do seu plano</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Acesso a todas as promoções, incluindo exclusivas</span>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <a 
                  href="https://billing.stripe.com/p/login/test_28o5nA9Rl9Ck9yw144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center"
                >
                  <CreditCard size={18} className="mr-2" />
                  Gerenciar assinatura
                </a>
              </div>
              <div>
                <a
                  href="https://billing.stripe.com/p/login/test_28o5nA9Rl9Ck9yw144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white border border-red-300 hover:bg-red-50 text-red-600 py-2 px-4 rounded-lg font-medium transition flex items-center justify-center"
                >
                  <X size={18} className="mr-2" />
                  Cancelar assinatura
                </a>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <p>
                <strong>Nota:</strong> Ao cancelar sua assinatura, você continuará tendo acesso ao plano Premium até o final do período pago.
                Após essa data, sua conta será convertida para o plano gratuito.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Você está no Plano Gratuito</h3>
              <p className="text-gray-600 mb-6">Faça upgrade para o plano Premium e tenha acesso a promoções exclusivas.</p>
              
              <Link 
                to="/"
                className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center mx-auto"
              >
                <Crown size={18} className="mr-2" />
                Fazer upgrade para Premium
              </Link>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-3">Compare os planos</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-3 pr-6"></th>
                      <th className="text-left py-3 pr-6">Plano Gratuito</th>
                      <th className="text-left py-3 pr-6">Plano Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 pr-6">Promoções básicas</td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 pr-6">Alertas de promoções semanais</td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 pr-6">Promoções exclusivas</td>
                      <td className="py-3 pr-6">
                        <X size={18} className="text-red-500" />
                      </td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 pr-6">Alertas em tempo real</td>
                      <td className="py-3 pr-6">
                        <X size={18} className="text-red-500" />
                      </td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 pr-6">Ofertas com milhas exclusivas</td>
                      <td className="py-3 pr-6">
                        <X size={18} className="text-red-500" />
                      </td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="py-3 pr-6">Suporte prioritário</td>
                      <td className="py-3 pr-6">
                        <X size={18} className="text-red-500" />
                      </td>
                      <td className="py-3 pr-6">
                        <Check size={18} className="text-green-500" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;