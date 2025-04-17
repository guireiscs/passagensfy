import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  PlaneTakeoff, Calendar, Heart, 
  ChevronLeft, Share2, CreditCard,
  Users, ArrowRight, AlertCircle, MapPin,
  ShieldCheck, Percent, Globe, ArrowLeft, Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePromotion } from '../hooks/usePromotions';
import { supabase } from '../lib/supabase';

const PromotionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isPremium, isAuthenticated } = useAuth();
  const { promotion, isLoading, error } = usePromotion(id!, isPremium);
  const [similarPromotions, setSimilarPromotions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'terms'>('details');
  const [isSaved, setIsSaved] = useState(false);
  const [isCheckingBookmark, setIsCheckingBookmark] = useState(true);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);
  
  useEffect(() => {
    // Check if this promotion is bookmarked by the user
    const checkIfBookmarked = async () => {
      if (!user || !id) return;
      
      try {
        setIsCheckingBookmark(true);
        const { data, error } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('promotion_id', id)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking bookmark:', error);
        }
        
        setIsSaved(!!data);
        if (data) {
          setBookmarkId(data.id);
        }
      } catch (err) {
        console.error('Error checking bookmark:', err);
      } finally {
        setIsCheckingBookmark(false);
      }
    };
    
    checkIfBookmarked();
  }, [id, user]);
  
  useEffect(() => {
    // Fetch similar promotions
    const fetchSimilarPromotions = async () => {
      if (!promotion) return;
      
      try {
        let query = supabase
          .from('promotions')
          .select(`
            id, 
            created_at, 
            from, 
            to, 
            price, 
            miles, 
            airline, 
            departure_date, 
            return_date, 
            image_url, 
            discount, 
            expires_in, 
            is_premium, 
            payment_type, 
            departure_time, 
            return_time, 
            passengers, 
            baggage, 
            stopover, 
            flight_duration, 
            description, 
            terms, 
            title,
            trip_type,
            travel_class,
            user_id
          `)
          .neq('id', id)
          .order('created_at', { ascending: false })
          .limit(3);
          
        // If not premium user, restrict to non-premium promotions
        if (!isPremium) {
          query = query.eq('is_premium', false);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setSimilarPromotions(data || []);
      } catch (err) {
        console.error('Error fetching similar promotions:', err);
      }
    };
    
    if (promotion) {
      fetchSimilarPromotions();
    }
  }, [promotion, id, isPremium]);
  
  const toggleBookmark = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    if (isCheckingBookmark) return;
    
    try {
      if (isSaved && bookmarkId) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', bookmarkId);
          
        if (error) throw error;
        
        setIsSaved(false);
        setBookmarkId(null);
      } else {
        // Add bookmark
        const { data, error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            promotion_id: id
          })
          .select();
          
        if (error) throw error;
        
        setIsSaved(true);
        if (data && data.length > 0) {
          setBookmarkId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Função para renderizar o tipo de viagem
  const renderTripType = () => {
    if (!promotion) return null;
    
    switch (promotion.trip_type) {
      case 'one_way':
        return (
          <span className="bg-orange-100 text-orange-800 py-1 px-3 rounded-full text-sm flex items-center">
            <ArrowRight size={14} className="mr-1" />
            Só ida
          </span>
        );
      case 'return_only':
        return (
          <span className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm flex items-center">
            <ArrowLeft size={14} className="mr-1" />
            Só volta
          </span>
        );
      default:
        return (
          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm flex items-center">
            <PlaneTakeoff size={14} className="mr-1" />
            Ida e volta
          </span>
        );
    }
  };

  // Função para renderizar a classe de viagem
  const renderTravelClass = () => {
    if (!promotion) return null;
    
    switch (promotion.travel_class) {
      case 'business':
        return (
          <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-sm flex items-center">
            <Briefcase size={14} className="mr-1" />
            Classe Executiva
          </span>
        );
      case 'first_class':
        return (
          <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-sm flex items-center">
            <Crown size={14} className="mr-1" />
            Primeira Classe
          </span>
        );
      case 'premium_economy':
        return (
          <span className="bg-teal-100 text-teal-800 py-1 px-3 rounded-full text-sm flex items-center">
            <Users size={14} className="mr-1" />
            Premium Economy
          </span>
        );
      default:
        return (
          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm flex items-center">
            <Users size={14} className="mr-1" />
            Classe Econômica
          </span>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
        </div>
      </div>
    );
  }
  
  if (error || !promotion) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <div className="text-gray-400 text-5xl mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            {error?.message === 'This is a premium promotion. Upgrade to access it.' 
              ? 'Promoção exclusiva para assinantes Premium'
              : 'Promoção não encontrada'}
          </h3>
          <p className="text-gray-500 mb-6">
            {error?.message === 'This is a premium promotion. Upgrade to access it.'
              ? 'Esta é uma oferta exclusiva para membros Premium. Faça upgrade para acessá-la.'
              : 'A promoção que você está procurando não existe ou expirou.'}
          </p>
          {error?.message === 'This is a premium promotion. Upgrade to access it.' ? (
            <Link 
              to="/promotions" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition inline-flex items-center"
            >
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.5 6.5H22l-5.5 4.5 2 7L12 16.5 5.5 20l2-7L2 8.5h7.5L12 2z" />
              </svg>
              Assinar Premium
            </Link>
          ) : (
            <Link 
              to="/promotions" 
              className="bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-lg font-medium transition inline-flex items-center"
            >
              <ChevronLeft size={18} className="mr-2" />
              Voltar para promoções
            </Link>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-purple">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/promotions" className="hover:text-brand-purple">Promoções</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{promotion.from} → {promotion.to}</span>
      </div>
      
      {/* Back button and share */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/promotions" 
          className="flex items-center text-gray-600 hover:text-brand-purple transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          <span>Voltar para promoções</span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleBookmark}
            className={`flex items-center ${isSaved ? 'bg-brand-purple text-white' : 'bg-white text-gray-500 border border-gray-300'} rounded-full py-1 px-3 hover:shadow-md transition-colors`}
            disabled={isCheckingBookmark}
          >
            <Heart size={18} className={`mr-1 ${isSaved ? 'fill-white' : ''}`} />
            <span className="text-sm">{isSaved ? 'Salvo' : 'Salvar'}</span>
          </button>
          <button className="flex items-center bg-white border border-gray-300 rounded-full py-1 px-3 hover:bg-gray-50 transition-colors">
            <Share2 size={18} className="mr-1 text-gray-500" />
            <span className="text-sm">Compartilhar</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images and details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
            <div className="relative">
              <img 
                src={promotion.image_url} 
                alt={`${promotion.from} para ${promotion.to}`}
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-brand-purple text-white py-1 px-3 rounded-full text-sm font-medium">
                {promotion.discount}% OFF
              </div>
              {promotion.is_premium && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full text-sm font-medium flex items-center">
                  <svg className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.5 6.5H22l-5.5 4.5 2 7L12 16.5 5.5 20l2-7L2 8.5h7.5L12 2z" />
                  </svg>
                  Premium
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{promotion.title || `${promotion.from} → ${promotion.to}`}</h1>
                  <div className="flex items-center text-gray-600">
                    <PlaneTakeoff size={16} className="mr-2" />
                    <span>{promotion.airline}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-purple">
                    {promotion.payment_type === 'cash' ? (
                      `R$ ${promotion.price}`
                    ) : (
                      `${promotion.miles?.toLocaleString()} milhas`
                    )}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Economize {promotion.discount}%
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {renderTripType()}
                {renderTravelClass()}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Calendar size={18} className="mr-3 text-gray-500" />
                    <div>
                      <div className="font-medium">Ida</div>
                      <div>{promotion.departure_date} • {promotion.departure_time}</div>
                    </div>
                  </div>
                  
                  {promotion.trip_type !== 'one_way' && (
                    <div className="flex items-center text-gray-700">
                      <Calendar size={18} className="mr-3 text-gray-500" />
                      <div>
                        <div className="font-medium">Volta</div>
                        <div>{promotion.return_date} • {promotion.return_time}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-700">
                    <Users size={18} className="mr-3 text-gray-500" />
                    <div>
                      <div className="font-medium">Passageiros</div>
                      <div>{promotion.passengers || 1} adulto</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <div>
                      <div className="font-medium">Classe {promotion.travel_class === 'economy' ? 'econômica' : 
                                                    promotion.travel_class === 'business' ? 'executiva' : 
                                                    promotion.travel_class === 'first_class' ? 'primeira classe' : 'premium economy'}</div>
                      <div>{promotion.baggage || 'Uma bagagem de mão (10kg)'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                    <div>
                      <div className="font-medium">Conexões</div>
                      <div>{promotion.stopover || 'Voo direto'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Duração</div>
                      <div>{promotion.flight_duration || '1h 20min'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex space-x-4 mb-6 border-b border-gray-200">
                  <button 
                    className={`pb-3 px-1 -mb-px font-medium ${activeTab === 'details' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Detalhes da viagem
                  </button>
                  <button 
                    className={`pb-3 px-1 -mb-px font-medium ${activeTab === 'terms' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('terms')}
                  >
                    Termos e condições
                  </button>
                </div>
                
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Sobre esta promoção</h3>
                    <p className="text-gray-700 mb-4">{promotion.description || 'Aproveite esta promoção exclusiva para viajar de São Paulo ao Rio de Janeiro com a LATAM. Preço especial para viagem em junho, período de baixa temporada com clima agradável no Rio. Ideal para um passeio de fim de semana prolongado.'}</p>
                    
                    {/* A seção de Origem e Destino foi removida conforme solicitado */}
                  </div>
                )}
                
                {activeTab === 'terms' && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Termos e condições da oferta</h3>
                    {promotion.terms && promotion.terms.length > 0 ? (
                      <ul className="space-y-3">
                        {promotion.terms.map((term, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-gray-100 text-brand-purple rounded-full p-1 mr-2 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-gray-700">{term}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="bg-gray-100 text-brand-purple rounded-full p-1 mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Promoção válida para compras realizadas até o prazo de expiração</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-gray-100 text-brand-purple rounded-full p-1 mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Sujeito a disponibilidade de assentos</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-gray-100 text-brand-purple rounded-full p-1 mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Alterações de data sujeitas a taxas</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-gray-100 text-brand-purple rounded-full p-1 mr-2 mt-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-gray-700">Cancelamento com reembolso de 80% até 30 dias antes da viagem</span>
                        </li>
                      </ul>
                    )}
                    
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start">
                        <AlertCircle size={20} className="text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-700">
                            Fique atento: os preços das passagens podem mudar a qualquer momento, sem aviso prévio. 
                            Recomendamos que realize a compra o mais rápido possível para garantir o preço anunciado.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Booking and similar promotions */}
        <div>
          {/* Booking card */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Reserve esta promoção</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Preço base</span>
                <span className="font-medium">{promotion.payment_type === 'cash' ? `R$ ${Math.round(promotion.price / (1 - promotion.discount / 100))}` : `${Math.round(promotion.miles / (1 - promotion.discount / 100)).toLocaleString()} milhas`}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Desconto</span>
                <span className="text-green-600">{promotion.payment_type === 'cash' ? `-R$ ${Math.round(promotion.price / (1 - promotion.discount / 100) - promotion.price)}` : `-${Math.round(promotion.miles / (1 - promotion.discount / 100) - promotion.miles).toLocaleString()} milhas`}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-brand-purple">{promotion.payment_type === 'cash' ? `R$ ${promotion.price}` : `${promotion.miles?.toLocaleString()} milhas`}</span>
              </div>
            </div>
            
            <a
              href={promotion.link || `https://example.com/book?id=${promotion.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-brand-purple hover:bg-brand-dark text-white py-3 rounded-xl font-medium transition flex items-center justify-center"
            >
              <CreditCard size={18} className="mr-2" />
              Reservar agora
            </a>
            
            <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
              <ShieldCheck size={16} className="mr-1" />
              <span>Compra segura e garantida</span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
            </div>
          </div>
          
          {/* Similar promotions */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="text-lg font-semibold mb-4">Promoções similares</h3>
            
            {similarPromotions.length > 0 ? (
              <div className="space-y-4">
                {similarPromotions.map((promo) => (
                  <Link 
                    key={promo.id} 
                    to={`/promotion/${promo.id}`}
                    className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{promo.from} → {promo.to}</h4>
                        <div className="text-sm text-gray-500">{promo.airline}</div>
                      </div>
                      <div className="text-brand-purple font-bold">
                        {promo.payment_type === 'cash' 
                          ? `R$ ${promo.price}` 
                          : `${promo.miles?.toLocaleString()} milhas`}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">{promo.departure_date}</div>
                      <div className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs">
                        -{promo.discount}%
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Nenhuma promoção similar encontrada</p>
              </div>
            )}
            
            <Link 
              to="/promotions" 
              className="flex items-center justify-center text-brand-purple font-medium mt-6 hover:underline"
            >
              <span>Ver todas as promoções</span>
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-gray-100 rounded-2xl p-8 mt-12">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-3">Receba ofertas exclusivas no seu email</h3>
          <p className="text-gray-600 mb-6">Seja o primeiro a saber sobre as melhores promoções de passagens para os seus destinos favoritos.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input 
              type="email" 
              placeholder="Seu melhor email"
              className="flex-grow w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            />
            <button className="w-full sm:w-auto whitespace-nowrap bg-brand-purple hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-medium transition">
              Quero receber ofertas
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            Ao se inscrever, você concorda com nossa <Link to="/privacy" className="underline">Política de Privacidade</Link>.
            Você pode cancelar a inscrição a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetails;