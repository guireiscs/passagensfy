import React, { useState } from 'react';
import { Key, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SecurityPage: React.FC = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdatePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Basic validation
    if (!passwordData.currentPassword) {
      setPasswordError('Por favor, informe sua senha atual');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // For now, just mock a successful password change
      // In a real app, you would call an API to update the password
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPasswordSuccess('Senha atualizada com sucesso!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Ocorreu um erro ao atualizar a senha. Por favor, tente novamente.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      // In a real app, you would call an API to delete the account
      alert('Função de exclusão de conta ainda não implementada.');
    }
  };

  const handleLogoutAllSessions = () => {
    if (window.confirm('Tem certeza que deseja encerrar todas as sessões? Você precisará fazer login novamente em todos os dispositivos.')) {
      // In a real app, you would call an API to logout all sessions
      signOut();
      navigate('/login');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Segurança</h2>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="font-medium mb-4">Alterar Senha</h3>
          
          {passwordError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {passwordError}
            </div>
          )}
          
          {passwordSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
              {passwordSuccess}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Senha Atual
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Digite sua senha atual"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Digite sua nova senha"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres e incluir números e letras.</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                  placeholder="Confirme sua nova senha"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleUpdatePassword}
                disabled={isChangingPassword}
                className="px-4 py-2 bg-brand-purple hover:bg-brand-dark text-white rounded-lg transition flex items-center"
              >
                {isChangingPassword ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-t-2 border-white mr-2"></div>
                    Atualizando...
                  </>
                ) : "Atualizar Senha"}
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-4">Sessões Ativas</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gray-200 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Esta sessão</p>
                  <p className="text-sm text-gray-500">Seu dispositivo atual • Ativo agora</p>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                Atual
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <button 
              onClick={handleLogoutAllSessions}
              className="text-red-600 hover:text-red-800 text-sm font-medium transition"
            >
              <LogOut size={16} className="inline mr-1" />
              Encerrar todas as sessões
            </button>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="font-medium mb-4">Ações de Segurança</h3>
          
          <div className="space-y-4">
            <div>
              <button 
                onClick={handleDeleteAccount}
                className="text-red-600 hover:text-red-800 font-medium flex items-center transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Excluir minha conta</span>
              </button>
              <p className="mt-1 text-xs text-gray-500">Esta ação é irreversível e excluirá todos os seus dados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;