import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  is_admin: boolean;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UseAdminUsersOptions {
  page?: number;
  pageSize?: number;
  isPremium?: 'all' | 'premium' | 'free';
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useAdminUsers(options: UseAdminUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const {
    page = 1,
    pageSize = 10,
    isPremium = 'all',
    sortField = 'created_at',
    sortDirection = 'desc'
  } = options;

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Count total users for pagination
      let countQuery = supabase.from('profiles').select('id', { count: 'exact', head: true });
      
      // Apply filters to count query
      if (isPremium !== 'all') {
        countQuery = countQuery.eq('is_premium', isPremium === 'premium');
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      const totalCount = count || 0;
      setTotalCount(totalCount);
      setTotalPages(Math.ceil(totalCount / pageSize));
      
      // Fetch users with pagination
      let query = supabase
        .from('profiles')
        .select('*')
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range((page - 1) * pageSize, page * pageSize - 1);
      
      // Apply filters
      if (isPremium !== 'all') {
        query = query.eq('is_premium', isPremium === 'premium');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log('Fetched users:', data?.length);
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, pageSize, isPremium, sortField, sortDirection]);

  return {
    users,
    isLoading,
    error,
    totalCount,
    totalPages,
    currentPage: page,
    refresh: fetchUsers
  };
}