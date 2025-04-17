import React from 'react';
import { AlertCircle, Plane, Search, Filter, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  type: 'error' | 'empty' | 'no-results' | 'premium-locked';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onClearFilters?: () => void;
  onUpgrade?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  message,
  onRetry,
  onClearFilters,
  onUpgrade
}) => {
  const renderContent = () => {
    switch (type) {
      case 'error':
        return (
          <>
            <div className="text-gray-400 text-5xl mb-4">
              <AlertCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {title || 'Erro ao carregar promoções'}
            </h3>
            <p className="text-gray-500 mb-6">
              {message || 'Ocorreu um problema ao carregar as promoções. Por favor, tente novamente mais tarde.'}
            </p>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Tentar novamente
              </button>
            )}
          </>
        );
      
      case 'empty':
        return (
          <>
            <div className="text-gray-400 text-5xl mb-4">
              <Plane className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {title || 'Nenhuma promoção disponível'}
            </h3>
            <p className="text-gray-500 mb-6">
              {message || 'No momento não há promoções disponíveis. Volte mais tarde para novas ofertas.'}
            </p>
            <Link 
              to="/search"
              className="text-brand-purple hover:text-brand-dark font-medium"
            >
              Buscar passagens
            </Link>
          </>
        );
      
      case 'no-results':
        return (
          <>
            <div className="text-gray-400 text-5xl mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {title || 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {message || 'Não encontramos promoções correspondentes aos filtros selecionados.'}
            </p>
            {onClearFilters && (
              <button 
                onClick={onClearFilters}
                className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition flex items-center mx-auto"
              >
                <Filter size={16} className="mr-2" />
                Limpar filtros
              </button>
            )}
          </>
        );
      
      case 'premium-locked':
        return (
          <>
            <div className="text-yellow-500 text-5xl mb-4">
              <Crown className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              {title || 'Conteúdo exclusivo para assinantes Premium'}
            </h3>
            <p className="text-gray-500 mb-6">
              {message || 'Estas promoções estão disponíveis apenas para assinantes do plano Premium.'}
            </p>
            {onUpgrade && (
              <button 
                onClick={onUpgrade}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center mx-auto"
              >
                <Crown size={16} className="mr-2" />
                Assinar Premium
              </button>
            )}
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-card">
      {renderContent()}
    </div>
  );
};

export default EmptyState;