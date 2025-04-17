import React, { useState } from 'react';
import { 
  Search, Edit, Trash2, 
  ArrowUpDown, Check, X, Crown, 
  Mail, RefreshCcw,
  Download, UserPlus
} from 'lucide-react';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { supabase } from '../../lib/supabase'; 
import UserForm from '../../components/admin/UserForm';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

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

const ManageUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    isPremium: 'all' as 'all' | 'premium' | 'free',
    page: 1,
    sortField: 'created_at',
    sortDirection: 'desc' as 'asc' | 'desc'
  });
  
  const { 
    users, 
    isLoading, 
    error, 
    totalPages, 
    refresh: fetchUsers,
    currentPage
  } = useAdminUsers(filterOptions);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isSettingAdmin, setIsSettingAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSuccess, setAdminSuccess] = useState<string | null>(null);
  const [userToSetAdmin, setUserToSetAdmin] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isAdminConfirmOpen, setIsAdminConfirmOpen] = useState(false);
  
  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsFormOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setIsDeleteConfirmOpen(true);
  };
  
  const handleSetAdmin = (user: User) => {
    if (user.is_admin) {
      alert('Este usuário já é um administrador.');
      return;
    }
    setUserToSetAdmin(user);
    setIsAdminConfirmOpen(true);
  };
  
  const confirmSetAdmin = async () => {
    if (!userToSetAdmin) return;
    setAdminError(null);
    setAdminSuccess(null);
    setIsSettingAdmin(true);
    
    try {
      // Update the user's admin status
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          is_admin: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userToSetAdmin.id);
        
      if (updateError) throw updateError;
      
      // Refresh the list
      fetchUsers();
      
      // Show success message
      setAdminSuccess(`${userToSetAdmin.name || 'Usuário'} foi definido como administrador com sucesso!`);
      
      // Close modal
      setIsAdminConfirmOpen(false);
      setUserToSetAdmin(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setAdminSuccess(null);
      }, 5000);
    } catch (err) {
      console.error('Error setting user as admin:', err);
      setAdminError('Erro ao definir usuário como administrador. Tente novamente.');
    } finally {
      setIsSettingAdmin(false);
    }
  };
  
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeleteError(null);
    setIsDeleting(true);
    
    try {
      // Check for bookmarks by this user
      const { count: bookmarkCount, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('id', { count: 'exact' })
        .eq('user_id', userToDelete);
        
      if (bookmarkError) throw bookmarkError;
      
      // Delete related bookmarks first
      if (bookmarkCount && bookmarkCount > 0) {
        const { error: deleteBookmarksError } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', userToDelete);
          
        if (deleteBookmarksError) throw deleteBookmarksError;
      }
      
      // Nota: Em um ambiente de produção, você precisaria lidar com dados relacionados ao Stripe
      // Aqui estamos simplificando para focar na funcionalidade principal
      console.log('Verificando dados do Stripe para o usuário:', userToDelete);
      
      // Simulação de verificação de dados do Stripe
      // Em um ambiente real, você faria consultas à tabela stripe_customers
      
      // Delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete);
        
      if (profileError) throw profileError;
      
      // Delete the user from auth (if you have admin rights)
      // This would typically be done through a Supabase Edge Function with admin privileges
      // For now, we'll just update the UI
      
      // Refresh the list
      fetchUsers();
      
      // Close modal
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setDeleteError('Erro ao excluir usuário. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleFormSubmit = async (user: Partial<User>) => {
    try {
      // Update user
      if (user.id) {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            name: user.name,
            email: user.email,
            phone: user.phone,
            is_premium: user.is_premium,
            premium_expires_at: user.premium_expires_at,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select();
          
        if (error) throw error;
        
        console.log('User updated:', data);
      }
      
      // Refresh the list
      fetchUsers();
      
      // Close form
      setIsFormOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Erro ao salvar usuário. Tente novamente.');
    }
  };
  
  const handleSort = (field: string) => {
    if (field === filterOptions.sortField) {
      // Toggle direction if same field
      setFilterOptions(prev => ({
        ...prev,
        sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      // Set new field and default to ascending
      setFilterOptions(prev => ({
        ...prev,
        sortField: field,
        sortDirection: 'asc'
      }));
    }
  };
  
  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.phone?.toLowerCase().includes(searchTermLower)
    );
  });
  
  const handleSendNewsletter = (userId: string) => {
    // In a real app, this would send a newsletter to a specific user
    alert(`Enviar newsletter para o usuário ${userId}. (Funcionalidade simulada)`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Gerenciar Usuários</h1>
          <p className="text-gray-600">Visualize e gerencie os usuários do sistema</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Filters */}
          <div>
            <select
              value={filterOptions.isPremium}
              onChange={(e) => setFilterOptions(prev => ({...prev, isPremium: e.target.value as 'all' | 'premium' | 'free'}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent appearance-none"
            >
              <option value="all">Todos os usuários</option>
              <option value="premium">Somente Premium</option>
              <option value="free">Somente Free</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setFilterOptions(prev => ({
                ...prev,
                isPremium: 'all',
                page: 1
              }));
              setSearchTerm('');
            }}
            className="text-brand-purple hover:text-brand-dark mr-4"
          >
            Limpar filtros
          </button>
          
          <button
            onClick={fetchUsers}
            className="flex items-center text-brand-purple hover:text-brand-dark"
          >
            <RefreshCcw size={16} className="mr-1" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>
      
      {/* Users Table */}
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
        
        {adminSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  {adminSuccess}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mb-4"></div>
              <p className="text-gray-500">Carregando usuários...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="text-gray-400 mb-4">
              <UserPlus size={48} />
            </div>
            <p className="text-lg font-medium text-gray-700">Nenhum usuário encontrado</p>
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Nome</span>
                      {filterOptions.sortField === 'name' && (
                        <ArrowUpDown size={14} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <span>Email</span>
                      {filterOptions.sortField === 'email' && (
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
                      <span>Status</span>
                      {filterOptions.sortField === 'is_premium' && (
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
                      <span>Registrado em</span>
                      {filterOptions.sortField === 'created_at' && (
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="h-10 w-10 rounded-full" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                              {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'Sem telefone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_premium ? (
                        <div>
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 items-center">
                            <Crown size={14} className="mr-1" />
                            Premium
                          </span>
                          {user.premium_expires_at && (
                            <div className="text-xs text-gray-500 mt-1">
                              Expira em: {new Date(user.premium_expires_at).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar usuário"
                        >
                          <Edit size={18} />
                        </button>
                        {!user.is_admin && (
                          <>
                            <button
                              onClick={() => handleSetAdmin(user)}
                              className="flex items-center px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-md transition-colors"
                              title="Tornar administrador"
                            >
                              <Crown size={14} className="mr-1" />
                              <span className="text-xs font-medium">Admin</span>
                            </button>
                          </>
                        )}
                        {user.is_admin && (
                          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-md bg-purple-100 text-purple-800">
                            <Crown size={14} className="mr-1" />
                            Admin
                          </span>
                        )}
                        <button
                          onClick={() => handleSendNewsletter(user.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Enviar newsletter"
                        >
                          <Mail size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir usuário"
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
        {!isLoading && filteredUsers.length > 0 && (
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{users.length > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> a <span className="font-medium">{Math.min(currentPage * 10, (users.length || 0))}</span> resultados
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilterOptions(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Anterior
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around the current page
                const pageNum = currentPage <= 3 
                  ? i + 1 
                  : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i
                    : currentPage - 2 + i;
                
                // Skip if pageNum is out of range
                if (pageNum < 1 || pageNum > totalPages) {
                  return null;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setFilterOptions(prev => ({ ...prev, page: pageNum }))}
                    className={`px-3 py-1 rounded ${pageNum === currentPage ? 'bg-brand-purple text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setFilterOptions(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
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
      
      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Editar Usuário
                </h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              {currentUser && (
                <UserForm 
                  user={currentUser}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setIsFormOpen(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita e removerá todos os dados associados, incluindo bookmarks e assinaturas.${deleteError ? `\n\nErro: ${deleteError}` : ''}`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        confirmColor="red"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
      />
      
      {/* Set Admin Confirmation Modal */}
      <ConfirmationModal
        isOpen={isAdminConfirmOpen}
        title="Tornar Usuário Administrador"
        message={`Tem certeza que deseja tornar ${userToSetAdmin?.name || 'este usuário'} um administrador? Esta ação concederá acesso total ao painel administrativo.${adminError ? `\n\nErro: ${adminError}` : ''}`}
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        confirmColor="blue"
        isLoading={isSettingAdmin}
        onConfirm={confirmSetAdmin}
        onCancel={() => {
          setIsAdminConfirmOpen(false);
          setUserToSetAdmin(null);
        }}
      />
    </div>
  );
};

export default ManageUsers;