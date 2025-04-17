import React, { useState, useEffect } from 'react';
import { 
  PlaneTakeoff, Calendar, Filter, Tag, MapPin, Search as SearchIcon, 
  CreditCard, DollarSign, Crown, Coins, AlertCircle, X, SlidersHorizontal,
  Loader, CheckCircle2, ChevronRight
} from 'lucide-react';
import PromotionCard from './PromotionCard';
import SubscriptionPlans from './SubscriptionPlans';
import { usePromotions } from '../hooks/usePromotions';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface PromotionsListProps {
  isPremium: boolean;
  onUpgradeToPremium: () => void;
}

const PromotionsList: React.FC<PromotionsListProps> = ({ 
  isPremium, 
  onUpgradeToPremium 
}) => {
  // Sempre buscar todas as promoções, incluindo as premium, independente do status do usuário
  // O controle de acesso será feito no componente PromotionCard
  const { promotions, isLoading, error } = usePromotions(true);
  const { user } = useAuth();
  const [filter, setFilter] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    priceRange: 'all',
    airlines: [] as string[],
    dateRange: 'all',
    paymentType: 'all',
    planType: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [filteredCount, setFilteredCount] = useState(0);
  
  // New states for empty states and skeleton loader
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handlePaymentTypeChange = (type: 'all' | 'cash' | 'miles') => {
    setActiveFilters({
      ...activeFilters,
      paymentType: type
    });
    setIsFilterApplied(true);
  };

  const handlePlanTypeChange = (type: 'all' | 'free' | 'premium') => {
    setActiveFilters({
      ...activeFilters,
      planType: type
    });
    setIsFilterApplied(true);
  };

  const handleUpgradeClick = () => {
    setShowSubscriptionModal(true);
  };
  
  const handleClearFilters = () => {
    setFilter('');
    setActiveFilters({
      priceRange: 'all',
      airlines: [],
      dateRange: 'all',
      paymentType: 'all',
      planType: 'all'
    });
    setIsFilterApplied(false);
  };
  
  const handleAirlineChange = (airline: string) => {
    const newAirlines = [...activeFilters.airlines];
    
    if (newAirlines.includes(airline)) {
      const index = newAirlines.indexOf(airline);
      newAirlines.splice(index, 1);
    } else {
      newAirlines.push(airline);
    }
    
    setActiveFilters({
      ...activeFilters,
      airlines: newAirlines
    });
    setIsFilterApplied(true);
  };
  
  const handlePriceRangeChange = (range: string) => {
    setActiveFilters({
      ...activeFilters,
      priceRange: range
    });
    setIsFilterApplied(true);
  };
  
  const handleDateRangeChange = (range: string) => {
    setActiveFilters({
      ...activeFilters,
      dateRange: range
    });
    setIsFilterApplied(true);
  };

  const filteredPromotions = promotions.filter(promo => {
    // Text filter
    const textMatch = promo.from.toLowerCase().includes(filter.toLowerCase()) || 
                      promo.to.toLowerCase().includes(filter.toLowerCase()) ||
                      promo.airline.toLowerCase().includes(filter.toLowerCase());
    
    // Payment type filter
    const paymentTypeMatch = activeFilters.paymentType === 'all' || 
                             promo.payment_type === activeFilters.paymentType;
    
    // Plan type filter - MODIFICADO para mostrar promoções premium mesmo para usuários free
    let planTypeMatch = true;
    if (activeFilters.planType === 'free') {
      planTypeMatch = !promo.is_premium;
    } else if (activeFilters.planType === 'premium') {
      planTypeMatch = promo.is_premium;
    }
    // Se planType for 'all', mostrar todas as promoções
    
    // Airline filter
    const airlineMatch = activeFilters.airlines.length === 0 ||
                         activeFilters.airlines.includes(promo.airline);
    
    // Price range filter
    let priceRangeMatch = true;
    if (activeFilters.priceRange === 'under500') {
      priceRangeMatch = promo.price <= 500;
    } else if (activeFilters.priceRange === '500to1000') {
      priceRangeMatch = promo.price > 500 && promo.price <= 1000;
    } else if (activeFilters.priceRange === '1000to2000') {
      priceRangeMatch = promo.price > 1000 && promo.price <= 2000;
    } else if (activeFilters.priceRange === 'over2000') {
      priceRangeMatch = promo.price > 2000;
    }
    
    return textMatch && paymentTypeMatch && planTypeMatch && airlineMatch && priceRangeMatch;
  });
  
  useEffect(() => {
    setFilteredCount(filteredPromotions.length);
  }, [filteredPromotions]);
  
  useEffect(() => {
    if (!isLoading && promotions.length > 0) {
      setHasInitialLoaded(true);
    }
  }, [isLoading, promotions]);
  
  // Simulate loading more promotions
  const handleLoadMore = () => {
    setLoadingMore(true);
    // Simulate API delay
    setTimeout(() => {
      setLoadingMore(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">Suas Promoções Exclusivas</h2>
          <p className="text-sm sm:text-base text-gray-600">Ofertas selecionadas especialmente para você</p>
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <button 
            onClick={toggleFilter}
            className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${showFilters ? 'bg-gray-100 border-gray-300' : 'border-gray-300'} text-sm sm:text-base`}
          >
            <Filter size={16} />
            <span>Filtros</span>
          </button>
          
          <div className="relative flex-grow md:flex-grow-0">
            <select className="appearance-none bg-white border border-gray-300 rounded-full px-3 py-2 pr-8 cursor-pointer text-sm sm:text-base w-full">
              <option>Ordenar por: Relevância</option>
              <option>Preço: Menor para maior</option>
              <option>Preço: Maior para menor</option>
              <option>Desconto: Maior para menor</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs para alternar entre tipos de pagamento */}
      <div className="mb-5">
        <div className="flex border-b border-gray-200 mb-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
          <button
            onClick={() => handlePaymentTypeChange('all')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full whitespace-nowrap text-sm ${activeFilters.paymentType === 'all' ? 'bg-brand-purple text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Todas Promoções
          </button>
          <button
            onClick={() => handlePaymentTypeChange('cash')}
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilters.paymentType === 'cash' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <DollarSign size={16} className="mr-1" />
            Dinheiro
          </button>
          <button
            onClick={() => handlePaymentTypeChange('miles')}
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilters.paymentType === 'miles' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Coins size={16} className="mr-1" />
            Milhas
          </button>
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2 hide-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          <button
            onClick={() => handlePlanTypeChange('all')}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeFilters.planType === 'all' ? 'bg-gray-100 text-gray-800 rounded-full' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos Planos
          </button>
          <button
            onClick={() => handlePlanTypeChange('free')}
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilters.planType === 'free' ? 'bg-gray-100 text-gray-800 rounded-full' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Plano Free
          </button>
          <button
            onClick={() => handlePlanTypeChange('premium')}
            className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilters.planType === 'premium' ? 'bg-gray-100 text-gray-800 rounded-full' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Crown size={14} className="mr-1 text-yellow-500" />
            Premium
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-card p-4 sm:p-6 mb-5">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-medium flex items-center">
              <SlidersHorizontal size={16} className="mr-2" />
              Filtros avançados
            </h3>
            
            {isFilterApplied && (
              <button 
                onClick={handleClearFilters}
                className="text-sm text-brand-purple hover:underline flex items-center"
              >
                <X size={14} className="mr-1" />
                Limpar filtros
              </button>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Tag size={16} className="mr-2" />
                Faixa de Preço
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.priceRange === 'all'} 
                    onChange={() => handlePriceRangeChange('all')} 
                  />
                  <span>Todos os preços</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.priceRange === 'under500'} 
                    onChange={() => handlePriceRangeChange('under500')} 
                  />
                  <span>Até R$ 500</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.priceRange === '500to1000'} 
                    onChange={() => handlePriceRangeChange('500to1000')} 
                  />
                  <span>R$ 500 a R$ 1000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.priceRange === '1000to2000'} 
                    onChange={() => handlePriceRangeChange('1000to2000')} 
                  />
                  <span>R$ 1000 a R$ 2000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="price" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.priceRange === 'over2000'} 
                    onChange={() => handlePriceRangeChange('over2000')} 
                  />
                  <span>Acima de R$ 2000</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <PlaneTakeoff size={16} className="mr-2" />
                Companhias Aéreas
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.airlines.includes('LATAM')} 
                    onChange={() => handleAirlineChange('LATAM')} 
                  />
                  <span>LATAM</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.airlines.includes('GOL')} 
                    onChange={() => handleAirlineChange('GOL')} 
                  />
                  <span>GOL</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.airlines.includes('Azul')} 
                    onChange={() => handleAirlineChange('Azul')} 
                  />
                  <span>Azul</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.airlines.includes('TAP')} 
                    onChange={() => handleAirlineChange('TAP')} 
                  />
                  <span>TAP</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.airlines.includes('American Airlines')} 
                    onChange={() => handleAirlineChange('American Airlines')} 
                  />
                  <span>American Airlines</span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 flex items-center">
                <Calendar size={16} className="mr-2" />
                Período da Viagem
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dates" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.dateRange === 'all'} 
                    onChange={() => handleDateRangeChange('all')} 
                  />
                  <span>Qualquer data</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dates" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.dateRange === 'nextMonth'} 
                    onChange={() => handleDateRangeChange('nextMonth')} 
                  />
                  <span>Próximo mês</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dates" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.dateRange === '3months'} 
                    onChange={() => handleDateRangeChange('3months')} 
                  />
                  <span>Em até 3 meses</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="dates" 
                    className="text-brand-purple mr-2" 
                    checked={activeFilters.dateRange === '6months'} 
                    onChange={() => handleDateRangeChange('6months')} 
                  />
                  <span>Em até 6 meses</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
            <button 
              onClick={handleClearFilters}
              className="text-brand-purple hover:underline mr-4"
            >
              Limpar filtros
            </button>
            <button 
              onClick={() => setShowFilters(false)}
              className="bg-brand-purple hover:bg-brand-dark text-white px-4 py-2 rounded-lg transition"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por destino, origem ou companhia aérea..."
          value={filter}
          onChange={handleFilterChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
        />
        {filter && (
          <button 
            onClick={() => setFilter('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {/* Results feedback */}
      {isFilterApplied && (
        <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">
            Mostrando {filteredPromotions.length} {filteredPromotions.length === 1 ? 'resultado' : 'resultados'}
          </div>
          <button 
            onClick={handleClearFilters}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded-md flex items-center"
          >
            <X size={12} className="mr-1" />
            Limpar filtros
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 sm:py-16 bg-white rounded-2xl shadow-card mx-2 sm:mx-0">
          <div className="text-gray-400 text-5xl mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Erro ao carregar promoções</h3>
          <p className="text-gray-500 mb-6">Ocorreu um problema ao carregar as promoções. Por favor, tente novamente mais tarde.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Tentar novamente
          </button>
        </div>
      ) : filteredPromotions.length === 0 ? (
        <div className="text-center py-10 sm:py-16 bg-white rounded-2xl shadow-card mx-2 sm:mx-0">
          <div className="text-gray-400 text-5xl mb-4">
            <PlaneTakeoff className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma promoção encontrada</h3>
          <p className="text-gray-500 mb-6">
            {isFilterApplied 
              ? "Não encontramos promoções correspondentes aos filtros selecionados." 
              : "No momento não há promoções disponíveis. Volte mais tarde."
            }
          </p>
          {isFilterApplied && (
            <button 
              onClick={handleClearFilters}
              className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 skeleton-container">
            {filteredPromotions.map(promotion => (
              <PromotionCard
                key={promotion.id}
                promotion={promotion}
                isPremiumUser={isPremium}
                onUpgradeClick={handleUpgradeClick}
              />
            ))}
          </div>
          
          {filteredPromotions.length > 0 && filteredPromotions.length % 3 === 0 && (
            <div className="text-center mt-10">
              <button 
                onClick={handleLoadMore}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 border border-gray-300 rounded-xl transition flex items-center mx-auto"
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Carregando...
                  </>
                ) : (
                  "Carregar mais resultados"
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Success message if no errors and data loaded */}
      {!isLoading && !error && hasInitialLoaded && filteredPromotions.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-lg p-3 sm:p-4 mt-6 sm:mt-8 mb-6 sm:mb-8 flex items-start mx-2 sm:mx-0">
          <CheckCircle2 className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={20} />
          <div>
            <p className="text-green-800 font-medium">Promoções carregadas com sucesso!</p>
            <p className="text-green-700 text-sm">
              {isPremium 
                ? "Você tem acesso a todas as promoções, incluindo as exclusivas para membros Premium." 
                : "Você está vendo todas as promoções gratuitas. Faça upgrade para ver ofertas exclusivas."}
            </p>
          </div>
        </div>
      )}

      {/* Premium Banner para usuários free */}
      {!isPremium && (
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-gray-900 to-purple-900 rounded-2xl overflow-hidden mx-2 sm:mx-0">
          <div className="md:flex items-center">
            <div className="md:w-2/3 p-5 sm:p-8 text-white">
              <div className="flex items-center mb-3 sm:mb-4">
                <Crown size={20} className="text-yellow-400 mr-2" />
                <h2 className="text-lg sm:text-2xl font-semibold">Desbloqueie todas as promoções com o Premium</h2>
              </div>
              <p className="mb-4 sm:mb-6 opacity-90 text-sm sm:text-base">Tenha acesso a promoções exclusivas com descontos de até 60% em passagens aéreas nacionais e internacionais.</p>
              
              <ul className="space-y-2 mb-5 sm:mb-8 text-sm sm:text-base">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                  <span>Promoções exclusivas com até 60% de desconto</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                  <span>Alertas em tempo real de ofertas relâmpago</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                  <span>Suporte prioritário e dicas exclusivas</span>
                </li>
              </ul>
              
              <button
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
              >
                <span>Assinar Premium por R$ 29,90/mês</span>
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>
            <div className="md:w-1/3 hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Benefícios Premium"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {showSubscriptionModal && (
        <SubscriptionPlans 
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}
    </div>
  );
};

export default PromotionsList;