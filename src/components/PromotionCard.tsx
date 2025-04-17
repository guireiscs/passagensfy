import React, { useState, useEffect } from 'react';
import { 
  PlaneTakeoff, Calendar, Heart, ExternalLink, Crown, DollarSign, Coins, 
  Users, MapPin, ArrowLeft, ArrowRight, Briefcase, Clock, Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Adicionar estilos globais para as imagens dos cards
const cardImageStyle = {
  height: '180px',
  objectFit: 'cover' as const,
  width: '100%'
} as const;

// Estilo para o efeito hover nas imagens
const cardImageHoverStyle = {
  ...cardImageStyle,
  transform: 'scale(1.05)',
  transition: 'transform 0.5s ease'
} as const;

interface PromotionCardProps {
  promotion: {
    id: number;
    from: string;
    to: string;
    price: number;
    miles?: number;
    airline: string;
    departure_date: string;
    return_date: string;
    image_url: string;
    discount: number;
    expires_in: string;
    is_premium: boolean;
    payment_type: string;
    departure_time?: string;
    return_time?: string;
    passengers?: number;
    baggage?: string;
    stopover?: string;
    flight_duration?: string;
    title?: string;
    trip_type: string;
    travel_class: string;
  };
  isPremiumUser: boolean;
  onUpgradeClick: () => void;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, isPremiumUser, onUpgradeClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingBookmark, setIsCheckingBookmark] = useState(true);
  const [bookmarkId, setBookmarkId] = useState<number | null>(null);

  useEffect(() => {
    // Check if promotion is bookmarked
    const checkIfBookmarked = async () => {
      if (!user) {
        setIsCheckingBookmark(false);
        return;
      }
      
      try {
        setIsCheckingBookmark(true);
        
        // Verify we have valid Supabase configuration before making the request
        if (!supabase || !supabase.from) {
          console.error('Supabase client not properly initialized');
          setIsCheckingBookmark(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('bookmarks')
          .select('id')
          .eq('user_id', user.id)
          .eq('promotion_id', promotion.id)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error checking bookmark:', error);
        }
        
        setIsSaved(!!data);
        if (data) {
          setBookmarkId(data.id);
        }
      } catch (err) {
        console.error('Error checking if bookmarked:', err);
        // Ensure we set state even if an error occurs
        setIsSaved(false);
        setBookmarkId(null);
      } finally {
        setIsCheckingBookmark(false);
      }
    };
    
    // Add a small delay to prevent immediate execution which might cause race conditions
    const timer = setTimeout(() => {
      checkIfBookmarked();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, promotion.id]);

  const handlePromotionClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (promotion.is_premium && !isPremiumUser) {
      onUpgradeClick();
      return;
    }
    
    navigate(`/promotion/${promotion.id}`);
  };
  
  const toggleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isCheckingBookmark) return;
    
    try {
      setIsSaving(true);
      
      // Verify we have valid Supabase configuration before making the request
      if (!supabase || !supabase.from) {
        console.error('Supabase client not properly initialized');
        setIsSaving(false);
        return;
      }
      
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
            promotion_id: promotion.id
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
    } finally {
      setIsSaving(false);
    }
  };

  // Função para renderizar o tipo de viagem
  const renderTripType = () => {
    switch (promotion.trip_type) {
      case 'one_way':
        return (
          <span className="text-xs bg-orange-100 text-orange-800 py-1 px-2 rounded-full flex items-center">
            <ArrowRight size={12} className="mr-1" />
            Só ida
          </span>
        );
      case 'return_only':
        return (
          <span className="text-xs bg-indigo-100 text-indigo-800 py-1 px-2 rounded-full flex items-center">
            <ArrowLeft size={12} className="mr-1" />
            Só volta
          </span>
        );
      default:
        return (
          <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full flex items-center">
            <PlaneTakeoff size={12} className="mr-1" />
            Ida e volta
          </span>
        );
    }
  };

  // Função para renderizar a classe de viagem
  const renderTravelClass = () => {
    switch (promotion.travel_class) {
      case 'business':
        return (
          <span className="text-xs bg-purple-100 text-purple-800 py-1 px-2 rounded-full flex items-center">
            <Briefcase size={12} className="mr-1" />
            Executiva
          </span>
        );
      case 'first_class':
        return (
          <span className="text-xs bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full flex items-center">
            <Crown size={12} className="mr-1" />
            Primeira Classe
          </span>
        );
      case 'premium_economy':
        return (
          <span className="text-xs bg-teal-100 text-teal-800 py-1 px-2 rounded-full flex items-center">
            <Users size={12} className="mr-1" />
            Premium Economy
          </span>
        );
      default:
        return (
          <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center">
            <Users size={12} className="mr-1" />
            Econômica
          </span>
        );
    }
  };
  
  // Verificar se a promoção é premium e o usuário não é premium
  const isPremiumLocked = promotion.is_premium && !isPremiumUser;
  
  // Determinar se devemos esconder o preço para usuários não-premium
  const shouldHidePrice = isPremiumLocked;
  
  return (
    <div 
      className={`bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col ${isPremiumLocked ? 'ring-1 ring-yellow-400' : ''}`}
      onClick={handlePromotionClick}
    >
      <div className="relative w-full overflow-hidden shadow-inner" style={{ height: '180px' }}>
        <img 
          src={promotion.image_url} 
          alt={`${promotion.from} para ${promotion.to}`}
          className={isPremiumLocked ? 'filter brightness-95' : ''}
          loading="lazy"
          style={cardImageStyle}
          onMouseOver={(e) => {
            if (!isPremiumLocked) {
              Object.assign(e.currentTarget.style, cardImageHoverStyle);
            }
          }}
          onMouseOut={(e) => {
            Object.assign(e.currentTarget.style, cardImageStyle);
          }}
          onError={(e) => {
            // Fallback para imagem padrão em caso de erro
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWlycGxhbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60';
          }}
        />
        <button 
          className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${isSaving ? 'opacity-50' : ''}`}
          onClick={toggleBookmark}
          disabled={isSaving}
        >
          <Heart 
            size={20} 
            className={`${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-brand-purple'}`} 
          />
        </button>
        <div className="absolute top-3 left-3 bg-brand-purple text-white py-1 px-3 rounded-full text-sm font-medium shadow-md transition-all duration-300">
          {promotion.discount}% OFF
        </div>
        {promotion.is_premium && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full text-sm font-medium flex items-center shadow-md backdrop-blur-sm">
            <Crown size={14} className="mr-1 text-yellow-500" />
            Premium
          </div>
        )}
        {/* Removido o overlay completo para permitir que usuários vejam o card, mas mantendo um indicador de conteúdo premium */}
        {isPremiumLocked && (
          <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-black/70 to-transparent p-3 flex justify-between items-start">
            <div className="bg-yellow-500 text-black py-1 px-3 rounded-full text-xs font-bold flex items-center shadow-md">
              <Crown size={12} className="mr-1" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-5 flex-grow flex flex-col">
        {promotion.title && (
          <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
            {promotion.title}
          </h2>
        )}
        
        <div className="flex items-start justify-between mb-2 flex-wrap">
          <div>
            <h3 className="text-sm sm:text-md font-semibold flex items-center flex-wrap">
              <MapPin size={14} className="text-gray-500 mr-1" />
              <span className="truncate max-w-[120px] sm:max-w-none">{promotion.from}</span>
              <span className="mx-1">→</span>
              <span className="truncate max-w-[120px] sm:max-w-none">{promotion.to}</span>
            </h3>
            <div className="flex items-center text-gray-600 text-sm flex-wrap">
              <PlaneTakeoff size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate max-w-[150px]">{promotion.airline}</span>
              {promotion.stopover && (
                <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded-full truncate max-w-[100px]">
                  {promotion.stopover}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            {shouldHidePrice ? (
              <div className="flex items-center justify-end">
                <div className="bg-gray-200 text-gray-400 px-3 py-1 rounded-lg text-sm font-medium flex items-center">
                  <Lock size={14} className="mr-1" />
                  <span>Exclusivo Premium</span>
                </div>
              </div>
            ) : (
              promotion.payment_type === 'cash' ? (
                <div className="text-xl sm:text-2xl font-bold text-brand-purple">
                  R$ {promotion.price}
                </div>
              ) : (
                <div className="flex items-center text-brand-purple">
                  <span className="text-xl sm:text-2xl font-bold">{promotion.miles?.toLocaleString()}</span>
                  <Coins size={14} className="ml-1" />
                </div>
              )
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
          {promotion.payment_type === 'cash' ? (
            <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full flex items-center">
              <DollarSign size={12} className="mr-1" />
              Dinheiro
            </span>
          ) : (
            <span className="text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full flex items-center">
              <Coins size={12} className="mr-1" />
              Milhas
            </span>
          )}
          
          {renderTripType()}
          {renderTravelClass()}
        </div>
        
        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <Calendar size={12} className="mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
            <div className="flex flex-wrap items-center">
              <span className="mr-1">Ida:</span>
              <span>{promotion.departure_date}</span>
              {promotion.departure_time && (
                <span className="ml-1 text-xs bg-gray-100 px-1 py-0.5 rounded">
                  {promotion.departure_time}
                </span>
              )}
            </div>
          </div>
          
          {promotion.trip_type !== 'one_way' && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <Calendar size={12} className="mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
              <div className="flex flex-wrap items-center">
                <span className="mr-1">Volta:</span>
                <span>{promotion.return_date}</span>
                {promotion.return_time && (
                  <span className="ml-1 text-xs bg-gray-100 px-1 py-0.5 rounded">
                    {promotion.return_time}
                  </span>
                )}
              </div>
            </div>
          )}
          
          {promotion.flight_duration && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <Clock size={12} className="mr-1.5 sm:mr-2 text-gray-400 flex-shrink-0" />
              <span>Duração: {promotion.flight_duration}</span>
            </div>
          )}
        </div>
        
        <button 
          onClick={handlePromotionClick}
          className={`w-full mt-auto ${isPremiumLocked ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-brand-purple hover:bg-brand-dark'} text-white py-2 px-3 sm:px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-md flex items-center justify-center space-x-2 text-sm sm:text-base`}
        >
          {isPremiumLocked ? (
            <>
              <Crown size={16} className="mr-1" />
              <span>Assine Premium para Ver</span>
            </>
          ) : (
            <>
              <span>Ver Oferta</span>
              <ExternalLink size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PromotionCard;