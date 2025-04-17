import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, Calendar, Users, PlaneTakeoff, X, 
  MapPin, Filter, ArrowDownUp, ChevronDown, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PromotionCard from '../components/PromotionCard';

interface Promotion {
  id: number;
  from: string;
  to: string;
  price: number;
  miles?: number;
  airline: string;
  departureDate: string;
  returnDate: string;
  imageUrl: string;
  discount: number;
  expiresIn: string;
  isPremium: boolean;
  paymentType: 'cash' | 'miles';
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    cabinClass: 'economy'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Promotion[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('all');
  const [popularDestinations, setPopularDestinations] = useState([
    {
      city: 'Rio de Janeiro',
      country: 'Brasil',
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      price: 299
    },
    {
      city: 'Fernando de Noronha',
      country: 'Brasil',
      image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      price: 1299
    },
    {
      city: 'Lisboa',
      country: 'Portugal',
      image: 'https://images.unsplash.com/photo-1558370781-d6196949e317?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      price: 2799
    },
    {
      city: 'Nova York',
      country: 'Estados Unidos',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      price: 3299
    }
  ]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulando uma busca na API
    setTimeout(() => {
      // Dados simulados de resultados
      const mockResults: Promotion[] = [
        {
          id: 1,
          from: searchParams.from || 'São Paulo',
          to: searchParams.to || 'Rio de Janeiro',
          price: 299,
          airline: 'LATAM',
          departureDate: searchParams.departureDate || '15/06/2025',
          returnDate: searchParams.returnDate || '20/06/2025',
          imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          discount: 40,
          expiresIn: '2 dias',
          isPremium: false,
          paymentType: 'cash'
        },
        {
          id: 2,
          from: searchParams.from || 'São Paulo',
          to: searchParams.to || 'Fortaleza',
          price: 799,
          airline: 'GOL',
          departureDate: searchParams.departureDate || '10/07/2025',
          returnDate: searchParams.returnDate || '17/07/2025',
          imageUrl: 'https://images.unsplash.com/photo-1590060766050-321465be782a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          discount: 30,
          expiresIn: '5 dias',
          isPremium: false,
          paymentType: 'cash'
        },
        {
          id: 3,
          from: searchParams.from || 'Rio de Janeiro',
          to: searchParams.to || 'Fernando de Noronha',
          price: 1299,
          airline: 'Azul',
          departureDate: searchParams.departureDate || '05/08/2025',
          returnDate: searchParams.returnDate || '12/08/2025',
          imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          discount: 25,
          expiresIn: '3 dias',
          isPremium: true,
          paymentType: 'cash'
        },
        {
          id: 4,
          from: searchParams.from || 'Brasília',
          to: searchParams.to || 'Salvador',
          price: 499,
          airline: 'GOL',
          departureDate: searchParams.departureDate || '20/06/2025',
          returnDate: searchParams.returnDate || '27/06/2025',
          imageUrl: 'https://images.unsplash.com/photo-1526475742373-fb7d3f1b4b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          discount: 35,
          expiresIn: '1 dia',
          isPremium: false,
          paymentType: 'cash'
        },
        {
          id: 5,
          from: searchParams.from || 'São Paulo',
          to: searchParams.to || 'Lisboa',
          price: 2799,
          airline: 'TAP',
          departureDate: searchParams.departureDate || '10/09/2025',
          returnDate: searchParams.returnDate || '25/09/2025',
          imageUrl: 'https://images.unsplash.com/photo-1558370781-d6196949e317?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          discount: 20,
          expiresIn: '7 dias',
          isPremium: true,
          paymentType: 'cash'
        },
        {
          id: 6,
          from: searchParams.from || 'Rio de Janeiro',
          to: searchParams.to || 'Nova York',
          price: 3299,
          airline: 'American Airlines',
          departureDate: searchParams.departureDate || '15/10/2025',
          returnDate: searchParams.returnDate || '30/10/2025',
          imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          discount: 15,
          expiresIn: '10 dias',
          isPremium: false,
          paymentType: 'cash'
        }
      ];
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleUpgradeToPremium = () => {
    // Implementação futura para upgrade
    alert('Upgrade para Premium!');
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const handleClearSearch = () => {
    setSearchParams({
      from: '',
      to: '',
      departureDate: '',
      returnDate: '',
      passengers: 1,
      cabinClass: 'economy'
    });
    setHasSearched(false);
    setSearchResults([]);
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Busca de Passagens Aéreas</h1>
      
      {/* Search form */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">
                Origem
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="from"
                  name="from"
                  value={searchParams.from}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="De onde você vai sair?"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={searchParams.to}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Para onde você vai?"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de ida
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="departureDate"
                  name="departureDate"
                  value={searchParams.departureDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                Data de volta
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={searchParams.returnDate}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
                Passageiros
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={16} className="text-gray-400" />
                </div>
                <select
                  id="passengers"
                  name="passengers"
                  value={searchParams.passengers}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'passageiro' : 'passageiros'}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="cabinClass" className="block text-sm font-medium text-gray-700 mb-1">
                Classe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PlaneTakeoff size={16} className="text-gray-400" />
                </div>
                <select
                  id="cabinClass"
                  name="cabinClass"
                  value={searchParams.cabinClass}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
                >
                  <option value="economy">Econômica</option>
                  <option value="premium_economy">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">Primeira Classe</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button 
              type="button"
              onClick={toggleFilters}
              className="hidden md:flex items-center text-gray-600 hover:text-brand-purple transition-colors"
            >
              <Filter size={16} className="mr-1" />
              <span>Filtros avançados</span>
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {hasSearched && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Limpar busca
                </button>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto bg-brand-purple hover:bg-brand-dark text-white px-8 py-3 rounded-xl font-medium transition flex items-center justify-center"
              >
                <SearchIcon size={18} className="mr-2" />
                Buscar Passagens
              </button>
            </div>
          </div>
        </form>
        
        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium mb-3">Companhias Aéreas</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="text-brand-purple mr-2" />
                    <span>LATAM</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-brand-purple mr-2" />
                    <span>GOL</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-brand-purple mr-2" />
                    <span>Azul</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-brand-purple mr-2" />
                    <span>TAP</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="text-brand-purple mr-2" />
                    <span>American Airlines</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Preço</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="price" className="text-brand-purple mr-2" />
                    <span>Qualquer preço</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="text-brand-purple mr-2" />
                    <span>Até R$ 500</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="text-brand-purple mr-2" />
                    <span>R$ 500 a R$ 1000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="text-brand-purple mr-2" />
                    <span>R$ 1000 a R$ 2000</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="price" className="text-brand-purple mr-2" />
                    <span>Acima de R$ 2000</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Duração do voo</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="text-brand-purple mr-2" />
                    <span>Qualquer duração</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="text-brand-purple mr-2" />
                    <span>Até 3 horas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="text-brand-purple mr-2" />
                    <span>3 a 6 horas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="text-brand-purple mr-2" />
                    <span>6 a 12 horas</span>
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="duration" className="text-brand-purple mr-2" />
                    <span>Mais de 12 horas</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Search results */}
      {hasSearched ? (
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-card">
              <div className="text-gray-400 text-5xl mb-4">
                <AlertCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma promoção encontrada</h3>
              <p className="text-gray-500 mb-6">Tente ajustar seus filtros ou datas de viagem para encontrar mais opções.</p>
              <button
                onClick={handleClearSearch}
                className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Limpar busca
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {searchResults.length} resultados encontrados
                </h2>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleFilters}
                    className="md:hidden flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300"
                  >
                    <Filter size={16} />
                    <span>Filtros</span>
                  </button>
                  
                  <div className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300">
                    <ArrowDownUp size={16} />
                    <select className="appearance-none bg-transparent focus:outline-none pr-6">
                      <option>Relevância</option>
                      <option>Menor preço</option>
                      <option>Maior desconto</option>
                      <option>Duração do voo</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex border-b border-gray-200 mb-4 overflow-x-auto pb-1 hide-scrollbar">
                  <button
                    onClick={() => setActiveFilterTab('all')}
                    className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${activeFilterTab === 'all' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Todos os Resultados
                  </button>
                  <button
                    onClick={() => setActiveFilterTab('best')}
                    className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilterTab === 'best' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Melhores Opções
                  </button>
                  <button
                    onClick={() => setActiveFilterTab('cheapest')}
                    className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilterTab === 'cheapest' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Mais Baratos
                  </button>
                  <button
                    onClick={() => setActiveFilterTab('fastest')}
                    className={`px-4 py-2 font-medium text-sm flex items-center whitespace-nowrap ${activeFilterTab === 'fastest' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Mais Rápidos
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map(promotion => (
                  <PromotionCard
                    key={promotion.id}
                    promotion={promotion}
                    isPremiumUser={false}
                    onUpgradeClick={handleUpgradeToPremium}
                  />
                ))}
              </div>
              
              {/* Load more button */}
              <div className="text-center mt-10">
                <button className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 border border-gray-300 rounded-xl transition">
                  Carregar mais resultados
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Popular destinations */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Destinos populares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularDestinations.map((destination, index) => (
                <div key={index} className="relative rounded-2xl overflow-hidden aspect-square cursor-pointer group">
                  <img 
                    src={destination.image} 
                    alt={destination.city} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-semibold">{destination.city}</h3>
                      <p className="text-sm opacity-80">{destination.country}</p>
                      <p className="text-sm mt-1">A partir de R$ {destination.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Search tips */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-xl font-semibold mb-4">Dicas para encontrar as melhores ofertas</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-purple-100 p-3 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-brand-purple" />
                </div>
                <h3 className="font-medium mb-2">Seja flexível com as datas</h3>
                <p className="text-gray-600 text-sm">
                  Viajando alguns dias antes ou depois, você pode economizar até 40% no preço da passagem.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-purple-100 p-3 rounded-full mb-4">
                  <PlaneTakeoff className="h-8 w-8 text-brand-purple" />
                </div>
                <h3 className="font-medium mb-2">Compare companhias aéreas</h3>
                <p className="text-gray-600 text-sm">
                  Diferentes companhias aéreas oferecem preços distintos para os mesmos destinos.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="bg-purple-100 p-3 rounded-full mb-4">
                  <svg className="h-8 w-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Acompanhe as promoções</h3>
                <p className="text-gray-600 text-sm">
                  Cadastre-se para receber alertas de promoções e ofertas especiais para seus destinos favoritos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;