import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function usePromotions(isPremium = false) {
  const [promotions, setPromotions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPromotions = async () => {
      try {
        setIsLoading(true);
        
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
            user_id,
            link
          `);
        
        // Se o usuário for premium, buscar todas as promoções
        // Se não for premium, ainda precisamos buscar todas para mostrar os cards bloqueados
        // O controle de acesso será feito no componente PromotionCard
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (isMounted) {
          // Usar todas as promoções do banco de dados
          // O controle de acesso será feito no componente PromotionCard
          setPromotions(data || []);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching promotions:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          setIsLoading(false);
        }
      }
    };
    
    fetchPromotions();
    
    return () => {
      isMounted = false;
    };
  }, [isPremium]);
  
  return { promotions, isLoading, error };
}

export function usePromotion(id: string | number, isPremium = false) {
  const [promotion, setPromotion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPromotion = async () => {
      if (!id) return;
      
      // Don't re-fetch if we've already tried to load this promotion
      if (isInitialized) return;
      
      try {
        setIsLoading(true);
        
        // First check if this is a premium promotion that a non-premium user is trying to access
        if (!isPremium) {
          const { data: premiumCheck, error: premiumCheckError } = await supabase
            .from('promotions')
            .select('is_premium')
            .eq('id', id)
            .single();
            
          if (!premiumCheckError && premiumCheck && premiumCheck.is_premium) {
            throw new Error('This is a premium promotion. Upgrade to access it.');
          }
        }
        
        // Then proceed with the full query
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
            user_id,
            title,
            trip_type,
            travel_class,
            link
          `)
          .eq('id', id);
        
        // If not premium user, ensure we're not fetching premium promotions
        if (!isPremium) {
          query = query.eq('is_premium', false);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          // If the error is 'No rows found' and we haven't already checked for premium,
          // it might be a premium promotion or it doesn't exist
          throw error;
        }
        
        if (isMounted) {
          setPromotion(data);
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (err) {
        console.error('Error fetching promotion:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };
    
    fetchPromotion();
    
    return () => {
      isMounted = false;
    };
  }, [id, isPremium, isInitialized]);
  
  return { promotion, isLoading, error };
}

export function useBookmarks(userId: string | null) {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBookmarks = async () => {
      if (!userId) {
        if (isMounted) {
          setBookmarks([]);
          setIsLoading(false);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('bookmarks')
          .select(`
            id,
            promotions (
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
            )
          `)
          .eq('bookmarks.user_id', userId);
          
        if (error) throw error;
        
        // Transform the nested data to a more usable format
        const formattedBookmarks = data.map(item => ({
          id: item.id,
          ...item.promotions
        }));
        
        if (isMounted) {
          setBookmarks(formattedBookmarks);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
          setIsLoading(false);
        }
      }
    };
    
    fetchBookmarks();
    
    return () => {
      isMounted = false;
    };
  }, [userId]);
  
  const addBookmark = async (promotionId: number) => {
    if (!userId) return { success: false, error: new Error('User not authenticated') };
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          promotion_id: promotionId
        })
        .select();
        
      if (error) throw error;
      
      // Fetch the promotion data
      const { data: promotionData, error: promotionError } = await supabase
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
        .eq('id', promotionId)
        .single();
        
      if (promotionError) throw promotionError;
      
      // Add new bookmark to state
      setBookmarks(prev => [
        ...prev, 
        { 
          id: data[0].id, 
          ...promotionData 
        }
      ]);
      
      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error adding bookmark:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('Failed to add bookmark') 
      };
    }
  };
  
  const removeBookmark = async (bookmarkId: number) => {
    if (!userId) return { success: false, error: new Error('User not authenticated') };
    
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);
        
      if (error) throw error;
      
      // Update local state
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
      
      return { success: true };
    } catch (err) {
      console.error('Error removing bookmark:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err : new Error('Failed to remove bookmark') 
      };
    }
  };
  
  return { 
    bookmarks, 
    isLoading, 
    error,
    addBookmark,
    removeBookmark
  };
}