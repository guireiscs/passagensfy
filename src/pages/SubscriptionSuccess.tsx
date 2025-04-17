import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { profile, isPremium } = useAuth();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Start countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/promotions';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Assinatura Confirmada!</h1>
        <p className="text-xl text-gray-600 mb-8">
          Parabéns, {profile?.name}! Sua assinatura Premium foi ativada com sucesso.
        </p>
        
        <div className="bg-purple-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold">Benefícios Premium Desbloqueados</h2>
          </div>
          
          <ul className="space-y-3 max-w-md mx-auto text-left">
            <li className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Acesso a todas as promoções exclusivas com até 60% de desconto</span>
            </li>
            <li className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Alertas em tempo real para promoções relâmpago</span>
            </li>
            <li className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Ofertas com milhas exclusivas para membros premium</span>
            </li>
            <li className="flex items-start">
              <div className="bg-green-100 p-1 rounded-full text-green-600 mt-1 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span>Suporte prioritário para remarcações e cancelamentos</span>
            </li>
          </ul>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600">
            Você será redirecionado para a página de promoções em <span className="font-bold">{countdown}</span> segundos...
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/promotions"
            className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center"
          >
            <span>Ver Promoções Exclusivas</span>
            <ArrowRight size={16} className="ml-2" />
          </Link>
          
          <Link
            to="/account"
            className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition"
          >
            Gerenciar Assinatura
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>
            Um recibo foi enviado para seu email. Você pode gerenciar sua assinatura a qualquer momento na página 
            <Link to="/account" className="text-brand-purple hover:underline ml-1">Minha Conta</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;