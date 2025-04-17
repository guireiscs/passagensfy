import React, { useState } from 'react';
import { Save, Crown, X, Calendar, User } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UserFormProps {
  user: UserData;
  onSubmit: (user: Partial<UserData>) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<UserData>>({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    is_premium: user.is_premium,
    premium_expires_at: user.premium_expires_at
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // For checkbox inputs
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: isChecked }));
      
      // If premium checkbox is unchecked, clear the expiration date
      if (name === 'is_premium' && !isChecked) {
        setFormData(prev => ({ ...prev, premium_expires_at: null }));
      }
    } 
    // For everything else
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'O nome é obrigatório';
    if (!formData.email) newErrors.email = 'O email é obrigatório';
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  // Format date to ISO string for input value
  const formatDateForInput = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    } catch (error) {
      return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Information */}
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: João Silva"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent`}
            placeholder="Ex: joao@exemplo.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
            placeholder="Ex: (11) 98765-4321"
          />
        </div>
      </div>
      
      {/* Premium Status */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium mb-4">Status da Assinatura</h3>
        
        <div className="flex items-start mb-4">
          <div className="flex h-5 items-center">
            <input
              id="is_premium"
              name="is_premium"
              type="checkbox"
              checked={formData.is_premium || false}
              onChange={handleChange}
              className="h-4 w-4 text-brand-purple focus:ring-brand-purple border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="is_premium" className="font-medium text-gray-700">Usuário Premium</label>
            <p className="text-gray-500">Concede acesso a promoções exclusivas e recursos premium</p>
          </div>
        </div>
        
        {formData.is_premium && (
          <div>
            <label htmlFor="premium_expires_at" className="block text-sm font-medium text-gray-700 mb-1">
              Data de Expiração do Premium
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="premium_expires_at"
                name="premium_expires_at"
                value={formatDateForInput(formData.premium_expires_at)}
                onChange={handleChange}
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Deixe em branco para assinatura sem data de expiração</p>
          </div>
        )}
      </div>
      
      <div className="pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-500 mb-6">
          <p><strong>ID do usuário:</strong> {user.id}</p>
          <p><strong>Data de criação:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
          <p><strong>Última atualização:</strong> {new Date(user.updated_at).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-brand-purple hover:bg-brand-dark text-white rounded-lg transition-colors flex items-center"
        >
          <Save size={18} className="mr-2" />
          <span>Salvar Alterações</span>
        </button>
      </div>
    </form>
  );
};

export default UserForm;