import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

const SubscriptionCancel: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <XCircle className="h-16 w-16 text-gray-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Assinatura Cancelada</h1>
        <p className="text-xl text-gray-600 mb-8">
          O processo de assinatura foi cancelado. Nenhum valor foi cobrado.
        </p>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-8 w-8 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold">Precisa de ajuda?</h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Se você encontrou algum problema durante o processo de assinatura ou tem dúvidas sobre os planos, 
            nossa equipe de suporte está pronta para ajudar.
          </p>
          
          <Link
            to="/contact"
            className="text-brand-purple hover:underline font-medium"
          >
            Falar com o suporte
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium transition flex items-center justify-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span>Voltar para o início</span>
          </Link>
          
          <Link
            to="/promotions"
            className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Ver promoções disponíveis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancel;