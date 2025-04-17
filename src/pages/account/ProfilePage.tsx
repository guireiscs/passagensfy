import React, { useState, useEffect } from 'react';
import { Edit, Check, X, BookOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true);

  useEffect(() => {
    if (profile) {
      setEditedUser({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!profile?.id) return;
      
      try {
        setIsLoadingBookmarks(true);
        const { data, error } = await supabase
          .from('bookmarks')
          .select(`
            id,
            promotions (
              id, from, to, price, airline, departure_date
            )
          `)
          .eq('user_id', profile.id);

        if (error) throw error;
        
        // Transform data
        const formattedBookmarks = data?.map(item => ({
          id: item.id,
          ...item.promotions
        })) || [];
        
        setBookmarks(formattedBookmarks);

      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      } finally {
        setIsLoadingBookmarks(false);
      }
    };

    fetchBookmarks();
  }, [profile?.id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser({...editedUser, [name]: value});
  };
  
  const handleSaveProfile = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await updateProfile(editedUser);
      
      if (error) {
        console.error('Error updating profile:', error);
        return;
      }
      
      setEditMode(false);
    } catch (err) {
      console.error('Exception updating profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelEdit = () => {
    if (profile) {
      setEditedUser({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
    setEditMode(false);
  };
  
  const removeBookmark = async (bookmarkId: number) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);
      
      if (error) throw error;
      
      // Update UI
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Informações Pessoais</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center text-brand-purple hover:text-brand-dark transition"
          >
            <Edit size={16} className="mr-1" />
            <span>Editar</span>
          </button>
        )}
      </div>
      
      {editMode ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                disabled={true}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent bg-gray-50"
              />
              <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado</p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editedUser.phone || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 justify-end">
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
              disabled={loading}
            >
              <X size={16} className="mr-1" />
              Cancelar
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 bg-brand-purple hover:bg-brand-dark text-white rounded-lg transition flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-t-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-1" />
                  Salvar
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500 mb-1">Nome Completo</p>
              <p className="font-medium">{profile?.name}</p>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium">{profile?.email}</p>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500 mb-1">Telefone</p>
              <p className="font-medium">{profile?.phone || 'Não informado'}</p>
            </div>
            
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500 mb-1">Membro desde</p>
              <p className="font-medium">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}</p>
            </div>
          </div>
          
          {/* Bookmarks and Travel History */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4">Promoções Salvas</h3>
            
            {isLoadingBookmarks ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-brand-purple rounded-full"></div>
              </div>
            ) : bookmarks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-3 pr-4">Rota</th>
                      <th className="pb-3 pr-4">Data</th>
                      <th className="pb-3 pr-4">Companhia</th>
                      <th className="pb-3 pr-4">Preço</th>
                      <th className="pb-3 pr-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookmarks.map(bookmark => (
                      <tr key={bookmark.id} className="hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center">
                            <BookOpen size={16} className="text-gray-400 mr-2" />
                            <span>{bookmark.from} → {bookmark.to}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">{bookmark.departure_date}</td>
                        <td className="py-3 pr-4">{bookmark.airline}</td>
                        <td className="py-3 pr-4 font-medium">R$ {bookmark.price}</td>
                        <td className="py-3 pr-4 text-right">
                          <button 
                            onClick={() => removeBookmark(bookmark.id)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <div className="text-gray-400 text-3xl mb-2">
                  <BookOpen className="h-12 w-12 mx-auto" />
                </div>
                <h4 className="text-lg font-medium text-gray-700 mb-2">Nenhuma promoção salva</h4>
                <p className="text-gray-500 mb-4">Você ainda não salvou nenhuma promoção de passagem aérea.</p>
                <Link 
                  to="/promotions" 
                  className="text-brand-purple hover:underline font-medium"
                >
                  Ver promoções disponíveis
                </Link>
              </div>
            )}
          </div>
          
          {/* Seção de Histórico de Viagens desativada */}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;