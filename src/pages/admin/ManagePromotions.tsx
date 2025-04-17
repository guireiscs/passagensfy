import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Eye, 
  ArrowUpDown, Check, X, RefreshCcw, Download,
  Loader, Crown, DollarSign, Coins
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import PromotionForm from '../../components/admin/PromotionForm';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

interface Promotion {
  id: number;
  title: string;
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
  payment_type: 'cash' | 'miles';
  departure_time?: string;
  return_time?: string;
  baggage?: string;
  stopover?: string;
  flight_duration?: string;
  trip_type: string;
  travel_class: string;
  description?: string;
  terms?: string[];
}

const ManagePromotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    isPremium: 'all',
    paymentType: 'all',
    airline: 'all'
  });
  
  const [currentPromotion, setCurrentPromotion] = useState<Promotion | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    fetchPromotions();
  }, [page, filter, sortField, sortDirection]);
  
  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Count total promotions for pagination
      let countQuery = supabase.from('promotions').select('id', { count: 'exact' });
      
      // Apply filters to count query
      if (filter.isPremium !== 'all') {
        countQuery = countQuery.eq('is_premium', filter.isPremium === 'premium');
      }
      if (filter.paymentType !== 'all') {
        countQuery = countQuery.eq('payment_type', filter.paymentType);
      }
      if (filter.airline !== 'all') {
        countQuery = countQuery.eq('airline', filter.airline);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      
      // Fetch promotions with pagination
      let query = supabase
        .from('promotions')
        .select(`
          id, 
          title,
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
          baggage, 
          stopover, 
          flight_duration,
          trip_type,
          travel_class,
          description,
          terms
        `)
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      
      // Apply filters
      if (filter.isPremium !== 'all') {
        query = query.eq('is_premium', filter.isPremium === 'premium');
      }
      if (filter.paymentType !== 'all') {
        query = query.eq('payment_type', filter.paymentType);
      }
      if (filter.airline !== 'all') {
        query = query.eq('airline', filter.airline);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setPromotions(data || []);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Erro ao carregar promoções. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreate = () => {
    setCurrentPromotion(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (promotion: Promotion) => {
    setCurrentPromotion(promotion);
    setIsFormOpen(true);
  };
  
  const handleView = (promotionId: number) => {
    window.open(`/promotion/${promotionId}`, '_blank');
  };
  
  const handleDelete = (id: number) => {
    setPromotionToDelete(id);
    setIsDeleteConfirmOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!promotionToDelete) return;
    
    setIsDeleting(true);
    try {
      // Check for bookmarks referencing this promotion
      const { count: bookmarkCount, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('id', { count: 'exact' })
        .eq('promotion_id', promotionToDelete);
        
      if (bookmarkError) throw bookmarkError;
      
      // Delete related bookmarks first
      if (bookmarkCount && bookmarkCount > 0) {
        const { error: deleteBookmarksError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('promotion_id', promotionToDelete);
          
        if (deleteBookmarksError) throw deleteBookmarksError;
      }
      
      // Now delete the promotion
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionToDelete);
      
      if (error) throw error;
      
      // Refresh the list
      await fetchPromotions();
      
      // Close modal
      setIsDeleteConfirmOpen(false);
      setPromotionToDelete(null);
    } catch (err) {
      console.error('Error deleting promotion:', err);
      setError('Erro ao excluir promoção. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleFormSubmit = async (promotion: Partial<Promotion>, isNewPromotion: boolean) => {
    try {
      if (isNewPromotion) {
        // Create new promotion
        const { data, error } = await supabase
          .from('promotions')
          .insert([promotion])
          .select();
          
        if (error) throw error;
        
        console.log('New promotion created:', data);
      } else if (promotion.id) {
        // Update existing promotion
        const { data, error } = await supabase
          .from('promotions')
          .update(promotion)
          .eq('id', promotion.id)
          .select();
          
        if (error) throw error;
        
        console.log('Promotion updated:', data);
      }
      
      // Refresh the list
      await fetchPromotions();
      
      // Close form
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error saving promotion:', err);
      setError('Erro ao salvar promoção. Tente novamente.');
    }
  };
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredPromotions = promotions.filter(promotion => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      promotion.title?.toLowerCase().includes(searchTermLower) ||
      promotion.from.toLowerCase().includes(searchTermLower) ||
      promotion.to.toLowerCase().includes(searchTermLower) ||
      promotion.airline.toLowerCase().includes(searchTermLower)
    );
  });
  
  // Get unique airlines for filter
  const airlines = Array.from(new Set(promotions.map(p => p.airline)));

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Promoções</h1>
          <p className="text-gray-600">Adicione, edite ou remova promoções de passagens aéreas</p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <button
            onClick={handleCreate}
            className="bg-brand-purple hover:bg-brand-dark text-white px-4 py-2 rounded-lg flex items-center transition-colors"
          >
            <Plus size={18} className="mr-2" />
            <span>Nova Promoção</span>
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar promoções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div>
            <select
              value={filter.isPremium}
              onChange={(e) => setFilter({...filter, isPremium: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
            >
              <option value="all">Todos os planos</option>
              <option value="premium">Somente Premium</option>
              <option value="free">Somente Free</option>
            </select>
          </div>
          
          <div>
            <select
              value={filter.paymentType}
              onChange={(e) => setFilter({...filter, paymentType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
            >
              <option value="all">Todos os tipos</option>
              <option value="cash">Dinheiro</option>
              <option value="miles">Milhas</option>
            </select>
          </div>
          
          <div>
            <select
              value={filter.airline}
              onChange={(e) => setFilter({...filter, airline: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
            >
              <option value="all">Todas companhias</option>
              {airlines.map(airline => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setFilter({
                isPremium: 'all',
                paymentType: 'all',
                airline: 'all'
              });
              setSearchTerm('');
            }}
            className="text-brand-purple hover:text-brand-dark mr-4"
          >
            Limpar filtros
          </button>
          
          <button
            onClick={fetchPromotions}
            className="flex items-center text-brand-purple hover:text-brand-dark"
          >
            <RefreshCcw size={16} className="mr-1" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>
      
      {/* Promotions Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mb-4"></div>
              <p className="text-gray-500">Carregando promoções...</p>
            </div>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 mb-4">
              <Filter size={48} />
            </div>
            <p className="text-lg font-medium text-gray-700">Nenhuma promoção encontrada</p>
            <p className="text-gray-500 mb-4">Tente ajustar os filtros ou criar uma nova promoção</p>
            <button
              onClick={handleCreate}
              className="flex items-center text-brand-purple hover:text-brand-dark"
            >
              <Plus size={16} className="mr-1" />
              <span>Adicionar Promoção</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      <span>Título</span>
                      {sortField === 'title' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('from')}
                  >
                    <div className="flex items-center">
                      <span>Rota</span>
                      {sortField === 'from' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('airline')}
                  >
                    <div className="flex items-center">
                      <span>Companhia</span>
                      {sortField === 'airline' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      <span>Preço</span>
                      {sortField === 'price' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('is_premium')}
                  >
                    <div className="flex items-center">
                      <span>Tipo</span>
                      {sortField === 'is_premium' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('departure_date')}
                  >
                    <div className="flex items-center">
                      <span>Data de Ida</span>
                      {sortField === 'departure_date' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img src={promotion.image_url} alt={promotion.title} className="h-10 w-10 rounded-md object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{promotion.title || `${promotion.from} → ${promotion.to}`}</div>
                          <div className="text-sm text-gray-500">ID: {promotion.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{promotion.from} → {promotion.to}</div>
                      <div className="text-sm text-gray-500">{promotion.trip_type === 'one_way' ? 'Somente ida' : promotion.trip_type === 'return_only' ? 'Somente volta' : 'Ida e volta'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{promotion.airline}</div>
                      <div className="text-sm text-gray-500">{promotion.travel_class === 'economy' ? 'Econômica' : promotion.travel_class === 'business' ? 'Executiva' : promotion.travel_class === 'first_class' ? 'Primeira Classe' : 'Premium Economy'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promotion.payment_type === 'cash' ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign size={16} className="mr-1 text-green-600" />
                          R$ {promotion.price}
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-gray-900">
                          <Coins size={16} className="mr-1 text-blue-600" />
                          {promotion.miles?.toLocaleString()} milhas
                        </div>
                      )}
                      <div className="text-sm text-gray-500">Desconto: {promotion.discount}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promotion.is_premium ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Crown size={14} className="mr-1" />
                          Premium
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promotion.departure_date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleView(promotion.id)}
                          className="text-gray-600 hover:text-indigo-900"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(promotion)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!isLoading && filteredPromotions.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(page * itemsPerPage, (promotions.length || 0))}</span> de <span className="font-medium">{promotions.length}</span> resultados
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around the current page
                const pageNum = page <= 3 
                  ? i + 1 
                  : page >= totalPages - 2 
                    ? totalPages - 4 + i
                    : page - 2 + i;
                
                // Skip if pageNum is out of range
                if (pageNum < 1 || pageNum > totalPages) {
                  return null;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 rounded ${pageNum === page ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Export/Import Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
        <button 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center transition-colors"
          onClick={() => {/* Add export functionality */}}
        >
          <Download size={18} className="mr-2" />
          <span>Exportar CSV</span>
        </button>
      </div>
      
      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {currentPromotion ? 'Editar Promoção' : 'Adicionar Nova Promoção'}
                </h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <PromotionForm 
                promotion={currentPromotion}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Excluir Promoção"
        message="Tem certeza que deseja excluir esta promoção? Esta ação não pode ser desfeita e removerá também todos os bookmarks associados a esta promoção."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        confirmColor="red"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setPromotionToDelete(null);
        }}
      />
    </div>
  );
};

export default ManagePromotions;