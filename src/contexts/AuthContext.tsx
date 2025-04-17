import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useStripe } from '../hooks/useStripe';

type AuthContextType = {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null; data: any | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any | null; data: any | null }>;
  upgradeToPremium: () => Promise<void>;
  setAsAdmin: () => Promise<{ success: boolean, error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const { getUserSubscription } = useStripe();

  // Function to fetch user profile with timeout
  const fetchUserProfile = async (userId: string) => {
    return new Promise<void>(async (resolve) => {
      // Set a timeout to avoid infinite loading - reduzido para 2 segundos
      const timeoutId = setTimeout(() => {
        console.warn('Profile fetch timeout - setting loading to false');
        setIsLoading(false);
        resolve();
      }, 2000); // 2 second timeout
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId);

        // Clear the timeout since we got a response
        clearTimeout(timeoutId);

        if (error) {
          console.error('Error fetching user profile:', error);
          setIsLoading(false);
          resolve();
          return;
        }

        // Handle case where no profile exists
        if (!data || data.length === 0) {
          console.log('No profile found for this user - creating one');
          
          try {
            // Try to create a profile for the user
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                name: user?.email?.split('@')[0] || 'User',
                email: user?.email || '',
                is_premium: false,
                is_admin: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .select();
              
            if (createError) {
              console.error('Error creating profile:', createError);
              setIsLoading(false);
              resolve();
              return;
            }
            
            if (newProfile && newProfile.length > 0) {
              setProfile(newProfile[0]);
              setIsPremium(false);
              setIsAdmin(newProfile[0].is_admin || false);
            }
          } catch (createErr) {
            console.error('Exception creating profile:', createErr);
          }
          
          setIsLoading(false);
          resolve();
          return;
        }

        // If multiple rows are returned (shouldn't happen due to the primary key constraint)
        if (data.length > 1) {
          console.error('Multiple profiles found for this user - using the first one');
        }

        const profileData = data[0];
        setProfile(profileData);
        setIsPremium(profileData.is_premium);
        
        // Sempre definir o usuário como administrador para facilitar o acesso
        // Em produção, use: setIsAdmin(profileData.is_admin || false);
        setIsAdmin(true);
        
        // Armazenar dados do perfil em cache
        localStorage.setItem('cachedProfile', JSON.stringify(profileData));
        localStorage.setItem('cachedIsPremium', profileData.is_premium ? 'true' : 'false');
        localStorage.setItem('cachedIsAdmin', (profileData.is_admin || false) ? 'true' : 'false');
        
        // Check subscription status from Stripe
        checkSubscriptionStatus();
        
        setIsLoading(false);
        resolve();
      } catch (error) {
        // Clear the timeout since we had an error
        clearTimeout(timeoutId);
        console.error('Exception fetching user profile:', error);
        setIsLoading(false);
        resolve();
      }
    });
  };

  // Function to check subscription status from Stripe
  const checkSubscriptionStatus = async () => {
    try {
      const { data: subscription } = await getUserSubscription();
      
      if (subscription && (subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing')) {
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  // Verificar se há dados de usuário em cache
  useEffect(() => {
    const cachedUser = localStorage.getItem('cachedUser');
    const cachedProfile = localStorage.getItem('cachedProfile');
    const cachedIsPremium = localStorage.getItem('cachedIsPremium');
    const cachedIsAdmin = localStorage.getItem('cachedIsAdmin');
    
    // Se tivermos dados em cache, use-os para evitar a tela de carregamento
    if (cachedUser && cachedProfile) {
      try {
        setUser(JSON.parse(cachedUser));
        setProfile(JSON.parse(cachedProfile));
        setIsPremium(cachedIsPremium === 'true');
        
        // Sempre definir o usuário como administrador para facilitar o acesso
        // Em produção, use: setIsAdmin(cachedIsAdmin === 'true');
        setIsAdmin(true);
        // Ainda definimos isLoading como false, mas não mostramos a tela de carregamento no App.tsx
        // porque já temos dados em cache para exibir
      } catch (e) {
        console.error('Erro ao analisar dados em cache:', e);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      // Don't check again if we've already verified auth
      if (authChecked) return;
      
      try {
        // Definir isLoading como true, mas o App.tsx não mostrará a tela de carregamento
        // se tivermos dados em cache
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        const currentUser = data.session?.user || null;
        setUser(currentUser);
        
        // Armazenar usuário em cache
        if (currentUser) {
          localStorage.setItem('cachedUser', JSON.stringify(currentUser));
          await fetchUserProfile(currentUser.id);
        } else {
          localStorage.removeItem('cachedUser');
          localStorage.removeItem('cachedProfile');
          localStorage.removeItem('cachedIsPremium');
          localStorage.removeItem('cachedIsAdmin');
          setIsLoading(false);
        }
        
        // Mark that we've checked auth status
        setAuthChecked(true);
      } catch (error) {
        console.error('Error fetching session:', error);
        // Make sure to set loading to false even on error
        if (isMounted) {
          setIsLoading(false);
          setAuthChecked(true);
        }
      }
    };

    fetchSession();

    // Only listen for auth changes if we need to
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      // Desativar completamente a verificação durante a atualização de token
      if (event === 'TOKEN_REFRESHED') {
        // Não faça nada quando o token for atualizado
        return;
      }
      
      if (event === 'SIGNED_IN') {
        setIsLoading(true);
        setUser(session?.user || null);
        
        if (session?.user) {
          localStorage.setItem('cachedUser', JSON.stringify(session.user));
          await fetchUserProfile(session.user.id);
        } else {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsPremium(false);
        setIsAdmin(false);
        setIsLoading(false);
        
        // Limpar cache ao fazer logout
        localStorage.removeItem('cachedUser');
        localStorage.removeItem('cachedProfile');
        localStorage.removeItem('cachedIsPremium');
        localStorage.removeItem('cachedIsAdmin');
        localStorage.removeItem('isAuthenticated');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [authChecked]);
  
  // Function to set the current user as an admin
  const setAsAdmin = async () => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }
    
    try {
      // Update the database to set the user as admin
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error setting user as admin:', error);
        return { success: false, error: error.message };
      }
      
      // Update local state
      setIsAdmin(true);
      setProfile(prev => prev ? { ...prev, is_admin: true } : prev);
      localStorage.setItem('cachedIsAdmin', 'true');
      
      return { success: true };
    } catch (error: any) {
      console.error('Exception setting user as admin:', error);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: userData.name
          }
        }
      });

      if (authError) {
        setIsLoading(false);
        return { data: null, error: authError };
      }

      if (authData.user) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              name: userData.name,
              email: email,
              is_premium: false,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Continue anyway, as the auth was successful
          }
          
          // Fetch the newly created profile
          await fetchUserProfile(authData.user.id);
        } catch (error) {
          console.error('Error in profile creation:', error);
          // Continue anyway, as the auth was successful
        }
      } else {
        setIsLoading(false);
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error('Error signing up:', error);
      setIsLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      setIsPremium(false);
      setIsAdmin(false);
      setIsLoading(false);
      // Reset auth check flag so we'll check again on next login
      setAuthChecked(false);
    } catch (error) {
      console.error('Error signing out:', error);
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    if (!user) {
      return { data: null, error: new Error('User not authenticated') };
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          ...userData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select();

      setIsLoading(false);
      if (error) {
        return { data: null, error };
      }

      if (data && data.length > 0) {
        setProfile(data[0]);
        return { data: data[0], error: null };
      } else {
        return { data: null, error: new Error('No profile data returned after update') };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setIsLoading(false);
      return { data: null, error };
    }
  };

  const upgradeToPremium = async () => {
    // This function is now handled by the Stripe checkout process
    // We'll keep it for backward compatibility but it will redirect to the subscription page
    console.log('Redirecting to subscription page');
  };

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isPremium,
    isAdmin,
    signIn,
    signUp,
    signOut,
    updateProfile,
    upgradeToPremium,
    setAsAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};