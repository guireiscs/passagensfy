import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      setIsLoading(false);
      return;
    }
    
    const fetchBookmarks = async () => {
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
              user_id
            )
          `)
          .eq('bookmarks.user_id', user.id);
          
        if (error) throw error;
        
        // Transform the nested data to a more usable format
        const formattedBookmarks = data.map(item => ({
          id: item.id,
          ...item.promotions
        }));
        
        setBookmarks(formattedBookmarks);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [user]);
  
  const addBookmark = async (promotionId: number) => {
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
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
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }
    
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
  
  const isBookmarked = (promotionId: number) => {
    return bookmarks.some(bookmark => bookmark.id === promotionId);
  };
  
  return { 
    bookmarks, 
    isLoading, 
    error,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
}