import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, RefreshCcw, Download, 
  CheckCircle, XCircle, AlertCircle, Eye,
  ArrowUpDown, Clock, Calendar
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

interface Order {
  id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  customer_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  status: 'pending' | 'completed' | 'canceled';
  created_at: string;
  updated_at: string;
  customer_email?: string;
  customer_name?: string;
}

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    timeFrame: 'all'
  });
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  useEffect(() => {
    fetchOrders();
  }, [page, filter, sortField, sortDirection]);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Build SQL query to fetch orders with customer info
      const from = `stripe_orders`;
      
      // Count total orders for pagination
      let countQuery = supabase.from('stripe_orders').select('id', { count: 'exact', head: true });
      
      // Apply filters to count query
      if (filter.status !== 'all') {
        countQuery = countQuery.eq('status', filter.status);
      }
      
      if (filter.timeFrame !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch(filter.timeFrame) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = new Date(0); // beginning of time
        }
        
        countQuery = countQuery.gte('created_at', startDate.toISOString());
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) throw countError;
      
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      
      // Fetch orders with pagination
      let query = supabase
        .from('stripe_orders')
        .select(`
          id,
          checkout_session_id,
          payment_intent_id,
          customer_id,
          amount_subtotal,
          amount_total,
          currency,
          payment_status,
          status,
          created_at,
          updated_at
        `)
        .order(sortField, { ascending: sortDirection === 'asc' })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);
      
      // Apply filters
      if (filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }
      
      if (filter.timeFrame !== 'all') {
        const now = new Date();
        let startDate: Date;
        
        switch(filter.timeFrame) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          default:
            startDate = new Date(0); // beginning of time
        }
        
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Fetch customer details for each order
      const ordersWithCustomers = await Promise.all((data || []).map(async (order) => {
        try {
          const { data: customerData, error: customerError } = await supabase
            .from('stripe_customers')
            .select('user_id')
            .eq('customer_id', order.customer_id)
            .single();
            
          if (customerError) return order;
          
          if (customerData?.user_id) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', customerData.user_id)
              .single();
              
            if (profileError) return order;
            
            return {
              ...order,
              customer_name: profileData?.name,
              customer_email: profileData?.email
            };
          }
          
          return order;
        } catch (err) {
          console.error(`Error fetching customer details for order ${order.id}:`, err);
          return order;
        }
      }));
      
      setOrders(ordersWithCustomers);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Erro ao carregar pedidos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
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
  
  const formatCurrency = (amount: number, currency = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Stripe amounts are in cents
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle size={14} className="mr-1" />
            Concluído
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" />
            Pendente
          </span>
        );
      case 'canceled':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <XCircle size={14} className="mr-1" />
            Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };
  
  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      order.checkout_session_id.toLowerCase().includes(searchTermLower) ||
      order.payment_intent_id.toLowerCase().includes(searchTermLower) ||
      order.customer_id.toLowerCase().includes(searchTermLower) ||
      order.customer_name?.toLowerCase().includes(searchTermLower) ||
      order.customer_email?.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Pedidos</h1>
          <p className="text-gray-600">Visualize e gerencie os pedidos e assinaturas</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por ID, cliente ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div>
            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
            >
              <option value="all">Todos os status</option>
              <option value="completed">Concluídos</option>
              <option value="pending">Pendentes</option>
              <option value="canceled">Cancelados</option>
            </select>
          </div>
          
          <div>
            <select
              value={filter.timeFrame}
              onChange={(e) => setFilter({...filter, timeFrame: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
            >
              <option value="all">Todo o período</option>
              <option value="today">Hoje</option>
              <option value="week">Últimos 7 dias</option>
              <option value="month">Últimos 30 dias</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setFilter({
                status: 'all',
                timeFrame: 'all'
              });
              setSearchTerm('');
            }}
            className="text-brand-purple hover:text-brand-dark mr-4"
          >
            Limpar filtros
          </button>
          
          <button
            onClick={fetchOrders}
            className="flex items-center text-brand-purple hover:text-brand-dark"
          >
            <RefreshCcw size={16} className="mr-1" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
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
              <p className="text-gray-500">Carregando pedidos...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 mb-4">
              <Calendar size={48} />
            </div>
            <p className="text-lg font-medium text-gray-700">Nenhum pedido encontrado</p>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      <span>ID do Pedido</span>
                      {sortField === 'id' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      <span>Cliente</span>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount_total')}
                  >
                    <div className="flex items-center">
                      <span>Valor</span>
                      {sortField === 'amount_total' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortField === 'status' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    <div className="flex items-center">
                      <span>Data</span>
                      {sortField === 'created_at' && (
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customer_name || 'Nome não disponível'}</div>
                      <div className="text-sm text-gray-500">{order.customer_email || order.customer_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(order.amount_total, order.currency)}</div>
                      <div className="text-xs text-gray-500">
                        {order.payment_status === 'paid' ? 'Pago' : order.payment_status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Visualizar"
                        >
                          <Eye size={18} />
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
        {!isLoading && filteredOrders.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> a <span className="font-medium">{Math.min(page * itemsPerPage, (orders.length || 0))}</span> de <span className="font-medium">{orders.length}</span> resultados
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
      
      {/* Export Button */}
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
        <button 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center transition-colors"
          onClick={() => {/* Add export functionality */}}
        >
          <Download size={18} className="mr-2" />
          <span>Exportar CSV</span>
        </button>
      </div>
      
      {/* View Order Modal */}
      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Detalhes do Pedido #{selectedOrder.id}
                </h2>
                <button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Informações do Pedido</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ID da Sessão</p>
                        <p className="font-medium">{selectedOrder.checkout_session_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ID do Pagamento</p>
                        <p className="font-medium">{selectedOrder.payment_intent_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <div>{getStatusBadge(selectedOrder.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Cliente</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium">{selectedOrder.customer_name || 'Nome não disponível'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{selectedOrder.customer_email || 'Email não disponível'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">ID do Cliente no Stripe</p>
                        <p className="font-medium">{selectedOrder.customer_id}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Detalhes do Pagamento</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="font-medium">{formatCurrency(selectedOrder.amount_subtotal, selectedOrder.currency)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-medium">{formatCurrency(selectedOrder.amount_total, selectedOrder.currency)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Moeda</p>
                        <p className="font-medium">{selectedOrder.currency.toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status do Pagamento</p>
                        <p className="font-medium capitalize">{selectedOrder.payment_status}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;